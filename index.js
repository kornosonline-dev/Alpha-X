// ────────────────[البداية]────────────────
import Auth, { 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore 
} from '@whiskeysockets/baileys';
import cfonts from 'cfonts';
const { say } = cfonts;
import chalk from 'chalk';
import pino from 'pino';
import fs from 'fs';
import boxen from 'boxen';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// ────────────────[المحركات والملفات الرئيسية]────────────────
import cfg from './config.js';
import main, { enqueue } from './main.js'; // استيراد الطابور من main.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let reconnectCount = 0;
const MAX_RECONNECT = 10;

// ────────────────[مساعد الإقتران]────────────────
const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, (ans) => { rl.close(); resolve(ans); }));
};

// ────────────────[عرض شعار البوت]────────────────
say(cfg.botLogo || 'ALPHA X', {
    font: 'block',
    align: 'center',
    colors: ['cyan', 'blue'],
    space: true,
});

async function Go() {
    const { state, saveCreds } = await useMultiFileAuthState(cfg.sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = Auth.default({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        syncFullHistory: false,
    });

    // ────────────────[اعدادات كود الإقتران]────────────────
    if (!sock.authState.creds.registered) {
        const phoneNumber = await question(chalk.blueBright('Your Number Phone: '));
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log(
            boxen(chalk.magentaBright(`Your Pairing Code: ${code}`), {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'magenta',
                backgroundColor: '#1a1a1a'
            })
        );
    }

    // ────────────────[الجلسة تحديث]────────────────
    sock.ev.on('creds.update', saveCreds);

    // ─── كاشف تتبع حضور الحالات (Presence Tracker) ───
    const presenceCache = new Map();
    sock.ev.on('presence.update', (update) => {
        try {
            const presences = update.presences || {};
            for (const [jid, data] of Object.entries(presences)) {
                const status = data?.lastKnownPresence || data?.presence;
                if (status) {
                    presenceCache.set(jid, { status, timestamp: Date.now() });
                }
            }
        } catch (_) {}
    });
    globalThis.presenceCache = presenceCache;

    // ────────────────[الربط الموحد عبر نظام الطوابير]────────────────

    // 1. استقبال الرسائل النصية
    sock.ev.on('messages.upsert', (data) => {
        const chatJid = data.messages?.[0]?.key?.remoteJid;
        if (!chatJid) return;
        enqueue(chatJid, () => main.handler(sock, data, { cfg }));
    });

    // 2. كاشف حركة الأعضاء (ترقية/إعفاء/دخول/خروج)
    sock.ev.on('group-participants.update', (data) => {
        const chatJid = data.id || data.jid;
        if (chatJid) {
            enqueue(chatJid, () => main.handler(sock, { ...data, isGroupUpdate: true }, { cfg }));
        } else {
            main.handler(sock, { ...data, isGroupUpdate: true }, { cfg });
        }
    });

    // 3. كاشف إعدادات المجموعة (اسم/وصف/صورة/قفل)
    sock.ev.on('groups.update', ([data]) => {
        const chatJid = data.id || data.jid;
        if (chatJid) {
            enqueue(chatJid, () => main.handler(sock, { ...data, isGroupUpdate: true }, { cfg }));
        } else {
            main.handler(sock, { ...data, isGroupUpdate: true }, { cfg });
        }
    });

    // ────────────────[اعداد حالة الاتصال وإعادة المحاولة الذكي]────────────────
    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            
            if (shouldReconnect) {
                if (reconnectCount >= MAX_RECONNECT) {
                    console.log(chalk.red('❌ تجاوز الحد الأقصى لإعادة الاتصال (10 محاولات) — إنهاء العملية.'));
                    process.exit(1);
                }

                reconnectCount++;
                // حساب وقت الانتظار بشكل تصاعدي مضاعف (بدءاً من ثانيتين حتى دقيقة كحد أقصى)
                const delay = Math.min(1000 * Math.pow(2, reconnectCount), 60000);
                console.log(chalk.yellow(`⚠️  محاولة إعادة الاتصال رقم ${reconnectCount} بعد ${delay / 1000} ثانية...`));
                setTimeout(Go, delay);
            } else {
                console.log(chalk.red('❌ تم تسجيل الخروج — يرجى تسجيل الدخول مجدداً.'));
                process.exit(0);
            }
        } else if (connection === 'open') {
            reconnectCount = 0; // تصفير العداد عند نجاح الاتصال

            globalThis.conn = sock; // حفظ الاتصال ككائن عالمي
            sock.userId = sock.user?.id?.replace(/:\d+/, '').split('@')[0];

            console.log(
                chalk.bold.cyan('\n ✨ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐁𝐎𝐓 𝐀𝐋𝐏𝐇𝐀 𝐗 ✨ \n') +
                chalk.gray(' ──────────────────────────────────\n') +
                chalk.green('  ● ') + chalk.white('Status  : ') + chalk.greenBright('Online\n') +
                chalk.green('  ● ') + chalk.white('Mode    : ') + chalk.whiteBright((cfg.mode || 'Public') + '\n') +
                chalk.green('  ● ') + chalk.white('Version : ') + chalk.whiteBright((cfg.botVersion || '2.0.0') + '\n')
            );
        }
    });
}

// ────────────────[بدأ التشغيل]────────────────
Go().catch(e => {
    console.error(chalk.redBright('[ FATAL ERROR ] :'), e);
    process.exit(1);
});

// ────────────────[𝒜𝒴𝒪𝒰ℬ]────────────────
