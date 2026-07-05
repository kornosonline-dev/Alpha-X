//────────────────[المكتبات الأساسية]────────────────
import pino from 'pino';
import chalk from 'chalk';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import db, { loadDatabase } from './lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ────────────────[تحميل قاعدة البيانات]────────────────
await loadDatabase();

export const commandsCache = { cmds: new Map(), als: new Map() };
export const systems = new Map();

// ─── Rate Limiting ───
const rateLimits = new Map();
const RATE_LIMIT_MS = 2000; 
const MAX_MAP_SIZE = 5000;

// ─── Per-Chat Queue ───
const chatQueues = new Map();

export function enqueue(chatJid, task) {
    const current = chatQueues.get(chatJid) || Promise.resolve();
    const next = current
        .then(() => task())
        .catch(e => console.error(chalk.red(`[Queue Error] ${chatJid}:`), e))
        .finally(() => {
            if (chatQueues.get(chatJid) === next) {
                chatQueues.delete(chatJid);
            }
        });
    chatQueues.set(chatJid, next);
    return next;
}

// ─── كائن الرسائل المخصص للبوت ───
const msgs = {
  owner: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ❌ لا تملك صلاحية استخدام هذا الأمر*
> *┤ 👑 الأمر مخصص للمطورين فقط*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`,

  elite: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ❌ لا تملك صلاحية استخدام هذا الأمر*
> *┤ ⭐ الأمر مخصص للنخبة فقط*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  group: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ⚠️ لا يمكن تنفيذ الأمر*
> *┤ 👥 هذا الأمر يعمل داخل المجموعات فقط*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  botAdmin: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ⚠️ لا يمكن تنفيذ الأمر*
> *┤ 🛡️ يجب أن يكون البوت مشرفًا في المجموعة*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  admin: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ❌ لا تملك صلاحية استخدام هذا الأمر*
> *┤ 🛡️ الأمر مخصص للمشرفين فقط*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  premium: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ❌ لا تملك صلاحية استخدام هذا الأمر*
> *┤ 💎 الأمر مخصص للمشتركين المميزين*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  private: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ 🔒 هذا الأمر يعمل في الخاص فقط*
> *┤ 🚫 لا يمكن استخدامه داخل المجموعات*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  lockcmd: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ 🔒 هذا الأمر مقفل حاليًا*
> *┤ 🚧 لا يمكن استخدامه في الوقت الحالي*
> *┤ 🔄 قد يتم فتحه في تحديث قادم*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`,

  disabled: (comando) =>
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ ⚠️ هذا الأمر معطل حاليًا*
> *┤ 🛠️ الفريق يعمل على تحسينه*
> *┤ 🚀 سيتم إعادة تفعيله قريبًا بإذن الله*
> *┤ 🧾 الأمر المستخدم: \`${comando}\`*
> *┤────────────···*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`
};

// ────────────────[دالة التحميل التلقائي للملفات]────────────────
const loadFiles = async (folder, map, label, silent = false) => {
    const dir = path.join(__dirname, folder);
    if (!fs.existsSync(dir)) return;
    map.clear();
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const f of files) {
        try {
            const url = `file://${path.join(dir, f)}?upd=${Date.now()}`;
            const { default: content } = await import(url);
            if (folder === 'commands' && content?.name) {
                commandsCache.cmds.set(content.name, content);
                content.aliases?.forEach(a => commandsCache.als.set(a, content.name));
            } else if (folder === 'lib' && typeof content === 'function') {
                map.set(f, content);
            }
        } catch (e) { 
            console.log(chalk.red(`❌ Error in ${label} [${f}]:`), e.message); 
        }
    }
    if (!silent) {
        console.log(chalk.cyan(`🔄 [RELOAD] ${label} synchronized.`));
    }
};

chokidar.watch([path.join(__dirname, 'commands'), path.join(__dirname, 'lib')], { ignoreInitial: true }).on('all', () => {
    setTimeout(() => { 
        loadFiles('commands', commandsCache.cmds, 'Commands', false); 
        loadFiles('lib', systems, 'Systems', false); 
    }, 100);
});

await loadFiles('commands', commandsCache.cmds, 'Commands', true);
await loadFiles('lib', systems, 'Systems', true);

// ────────────────[الميديل وير]────────────────
export const pre = [
    async (m, { cfg }) => {
        try {
            if (m.isGroupUpdate || m.messageStubType) return true;

            const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
            if (!text || typeof text !== 'string') return true;

            // ✅ قراءة البريفكس من cfg.prefix (مع دعم المصفوفة أو النص)
            const prefixes = Array.isArray(cfg.prefix) ? cfg.prefix : [cfg.prefix];
            const isCommand = prefixes.some(p => text.startsWith(p));

            if (isCommand) {
                const jid = m.key?.remoteJid || 'unknown';
                const senderName = m.pushName || 'Unknown User';
                const time = moment().tz('Africa/Ndjamena').format('YYYY-MM-DD HH:mm:ss');
                console.log(chalk.magentaBright(`\n╭─── [ ALPHA X LOG ] ───`));
                console.log(chalk.cyan(`│ 📥 Command Detected`));
                console.log(chalk.yellow(`│ 👤 From: ${jid}`));
                console.log(chalk.blue(`│ 📝 Name: ${senderName}`));
                console.log(chalk.green(`│ ⏰ Time: ${time}`));
                console.log(chalk.white(`│ 💬 Text: ${text}`));
                console.log(chalk.magenta(`╰──────────────────────────────\n`));
            }
            return true;
        } catch (err) {
            console.log(chalk.red('[ PRE ERROR ]'), err.message);
            return true;
        }
    }
];

export const handler = async (sock, data, { cfg }) => {
    try {
        let m = data.isGroupUpdate ? data : data.messages && data.messages[0];

        const isStub = !!m?.messageStubType;
        const isGroupUpdate = !!m?.isGroupUpdate;
        
        if (!m || (!m.message && !isGroupUpdate && !isStub) || (m.key && m.key.fromMe)) return;

        const chatJid = isGroupUpdate ? (m.id || m.jid) : m.key.remoteJid;
        if (!chatJid) return;

        // ─── دالة فك الترميز (مطابقة لطريقة handler.js) ───
        const decodeJid = (jid) => {
            if (!jid) return '';
            return jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        };

        const senderJid = isGroupUpdate ? 
            decodeJid(m.author || m.participants?.[0] || chatJid) : 
            decodeJid(m.key?.participant || m.participant || chatJid);

        // ────────────────[تهيئة البيانات]────────────────
        if (!isGroupUpdate && !isStub && senderJid) {
            if (typeof db.data.users[senderJid] !== 'object') db.data.users[senderJid] = {};
            const user = db.data.users[senderJid];
            user.name = m.pushName || user.name || 'User';

            const defaults = { exp: 0, level: 0, coin: 0, banned: false, premium: false, marry: '', bank: 0, warn: 0, role: 'E', muto: false, commands: 0 };
            for (const [k, v] of Object.entries(defaults)) if (!(k in user)) user[k] = v;
        }

        if (chatJid && chatJid.endsWith('@g.us')) {
            if (typeof db.data.chats[chatJid] !== 'object') db.data.chats[chatJid] = {};
            const chat = db.data.chats[chatJid];
            const defaults = { autolevel: false, welcome: false, aceptar: false, detect: false, react: false, antilink: false, antilink2: false, antifake: false, antispam: false, antiswear: false, anticall: false, antistatus: false, antimention: false };
            for (const [k, v] of Object.entries(defaults)) if (!(k in chat)) chat[k] = v;
        }
       
        if (typeof db.data.settings !== 'object') db.data.settings = {};
        const globalSettings = db.data.settings;
        if (!('botName' in globalSettings)) globalSettings.botName = cfg.botName;
        if (!('private' in globalSettings)) globalSettings.private = false;
        if (!('responses' in globalSettings)) globalSettings.responses = true;
        if (!('mode' in globalSettings)) globalSettings.mode = 'public';

        db.save(); 

        // ─── جلب صلاحيات وإعدادات المشرفين والمجموعات (معدل) ───
        const isGroup = chatJid?.endsWith('@g.us');
        let participants = [];
        let isAdmin = false;
        let isBotAdmin = false;

        if (isGroup && !isGroupUpdate && !isStub) {
            const groupMetadata = await sock.groupMetadata(chatJid).catch(() => ({ participants: [] }));
            participants = groupMetadata.participants || [];
            
            // تنظيف الأرقام بنفس طريقة handler.js
            const cleanSenderNumber = senderJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
            const cleanBotNumber = (sock.user?.id || sock.user?.jid || sock.decodeJid?.(sock.user?.id) || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
            
            // البحث باستخدام JSON.stringify (للتطابق مع handler.js)
            const userGroup = participants.find(u => JSON.stringify(u).includes(cleanSenderNumber));
            const botGroup = participants.find(u => JSON.stringify(u).includes(cleanBotNumber));
            
            isAdmin = userGroup?.admin === 'admin' || userGroup?.admin === 'superadmin' || userGroup?.isAdmin || false;
            isBotAdmin = botGroup?.admin === 'admin' || botGroup?.admin === 'superadmin' || botGroup?.isAdmin || false;
        }

        const isOwner = decodeJid(cfg.ownerNumber) === senderJid;
        const isElite = (cfg.eliteNumbers || []).map(n => decodeJid(n)).includes(senderJid);
        const isPremium = isOwner || isElite || db.data.users[senderJid]?.premium === true;
        const mode = cfg.mode?.toLowerCase() || 'public';

        if (mode === 'private' && !isOwner && !isElite && !isPremium) return;
        if (mode === 'self' && !isOwner) return;

        // ─── إنشاء كائن الرسالة المقتبسة (quoted) والميديا ───
        let quoted = null;
        const ctxInfo = m.message?.extendedTextMessage?.contextInfo;
        if (ctxInfo && ctxInfo.quotedMessage) {
            const qMsg = ctxInfo.quotedMessage;
            const qType = qMsg ? (Object.keys(qMsg)[0] || '') : '';
            quoted = {
                key: {
                    remoteJid: chatJid,
                    id: ctxInfo.stanzaId,
                    participant: ctxInfo.participant || chatJid
                },
                message: qMsg,
                type: qType,
                body: qMsg?.conversation || qMsg?.extendedTextMessage?.text || qMsg?.[qType]?.caption || '',
                isMedia: ['imageMessage', 'videoMessage', 'documentMessage', 'audioMessage', 'stickerMessage'].includes(qType),
                mediaType: qType ? qType.replace('Message', '').toLowerCase() : '',
                mimetype: qMsg?.[qType]?.mimetype || null,
                download: async () => {
                    if (!quoted.isMedia) return null;
                    return await downloadMediaMessage(
                        { key: quoted.key, message: qMsg },
                        'buffer',
                        {},
                        sock
                    );
                }
            };
        }

        const ctx = { sock, cfg, db, cmds: commandsCache.cmds, als: commandsCache.als, systems, quoted, participants, isAdmin, isBotAdmin, isOwner, isElite, isPremium, senderJid, decodeJid };

        // --- تشغيل الأنظمة التلقائية ---
        for (const [name, sys] of systems) { 
            const result = await sys(sock, m, ctx).catch(console.error); 
            if (result === true) return; 
        }

        if (isGroupUpdate || isStub) return;

        // ... بعد تنفيذ الأنظمة التلقائية

// --- معالجة الأوامر وفحص الخصائص والصلاحيات ---
const txt = m.message.conversation || m.message.extendedTextMessage?.text || '';
// ✅ قراءة البريفكس من cfg.prefix
const prefixes = Array.isArray(cfg.prefix) ? cfg.prefix : [cfg.prefix];
const prefix = prefixes.find(p => txt.startsWith(p)) || null;
if (!prefix) return;

const args = txt.slice(prefix.length).trim().split(/\s+/);
const cmdName = args.shift().toLowerCase();
const key = commandsCache.cmds.has(cmdName) ? cmdName : commandsCache.als.get(cmdName);

if (!key) return;
const command = commandsCache.cmds.get(key);



        // 1. فحص خاصية قفل الأمر (lockcmd)
        if (command.lockcmd === true) {
            return await sock.sendMessage(chatJid, { text: msgs.lockcmd(cmdName) }, { quoted: m });
        }

        // 2. فحص خاصية تعطيل الأمر (disabled)
        if (command.disabled === true) {
            if (!isOwner && !isElite) {
                return await sock.sendMessage(chatJid, { text: msgs.disabled(cmdName) }, { quoted: m });
            }
        }

        // 3. فحص بيئة العمل (جروب / خاص)
        if (command.group && !isGroup) {
            return await sock.sendMessage(chatJid, { text: msgs.group(cmdName) }, { quoted: m });
        }
        if (command.private && isGroup) {
            return await sock.sendMessage(chatJid, { text: msgs.private(cmdName) }, { quoted: m });
        }
        if (command.botAdmin && !isBotAdmin) {
            return await sock.sendMessage(chatJid, { text: msgs.botAdmin(cmdName) }, { quoted: m });
        }

        // 4. فحص الصلاحيات الشامل (owner, elite, admin, premium)
        let requiredPermissions = [];
        if (command.allow && Array.isArray(command.allow)) {
            requiredPermissions = command.allow;
        } else {
            const permMap = { owner: isOwner, elite: isElite, admin: isAdmin, premium: isPremium };
            for (const [pk, pv] of Object.entries(permMap)) {
                if (command[pk] === true) requiredPermissions.push(pk);
            }
        }

        if (requiredPermissions.length > 0) {
            const hasPermission = requiredPermissions.some(perm => {
                switch (perm) {
        case 'owner': return isOwner;
        case 'elite': return isElite;
        case 'admin': return isAdmin;
        case 'premium': return isPremium;
                    default: return false;
                }
            });
            if (!hasPermission) {
                const primaryPerm = requiredPermissions[0];
                const errorMsg = msgs[primaryPerm] ? msgs[primaryPerm](cmdName) : `⛔ هذا الأمر يتطلب صلاحية: ${requiredPermissions.join(', ')}`;
                return await sock.sendMessage(chatJid, { text: errorMsg }, { quoted: m });
            }
        }

        // 5. التقييد الزمني (Rate Limiting)
        if (!isOwner) {
            const now = Date.now();
            const lastCmd = rateLimits.get(senderJid) || 0;
            if (now - lastCmd < RATE_LIMIT_MS) {
                return await sock.sendMessage(chatJid, { text: '⏳ انتظر قليلاً قبل تنفيذ الأمر التالي.' }, { quoted: m });
            }
            rateLimits.set(senderJid, now);
            if (rateLimits.size > MAX_MAP_SIZE) rateLimits.clear();
        }

        // تشغيل ميدل وير ما قبل التنفيذ
        for (const fn of pre) { 
            if (!(await fn(m, ctx))) return; 
        }

        // تنفيذ الأمر
        await command.execute(sock, m, args, { ...ctx, command });
        
        if (db.data.users[senderJid]) {
            db.data.users[senderJid].commands += 1;
            db.save(); 
        }
    } catch (e) { 
        console.log(chalk.red(`❌ Handler Error:`), e.message); 
    }
};

// ─── تنظيف الملفات المؤقتة التلقائي الآمن ───
const cleanTempFolderSafe = (dirPath, maxAgeMs = 5 * 60 * 1000) => {
    if (!fs.existsSync(dirPath)) return;
    fs.readdir(dirPath, (err, files) => {
        if (err) return;
        const now = Date.now();
        files.forEach(file => {
            if (file === '.gitignore') return;
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                if (now - stats.mtimeMs > maxAgeMs) {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (!unlinkErr) console.log(chalk.yellow(`[Auto-Clean] Deleted stagnant temp file: ${file}`));
                    });
                }
            });
        });
    });
};

const tempDirectory = path.join(__dirname, './temp');
setInterval(() => {
    cleanTempFolderSafe(tempDirectory, 5 * 60 * 1000);
}, 10 * 60 * 1000);

// ────────────────[النهاية]────────────────
export default { handler };