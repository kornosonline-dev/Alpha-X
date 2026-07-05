import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'افحص',
    aliases: ['الاخطاء', 'فحص'],
    category: 'ق3',
    description: 'فحص ملفات الأوامر',
    group: false,
    admin: false,
    elite: false,
    owner: true,        // فقط المطور
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        await sock.sendMessage(chatJid, {
            text: '*『🔍┇جـاري فـحـص الـمـلـفات...┇🔍』*'
        }, { quoted: m });

        const pluginsDir = __dirname;

        if (!fs.existsSync(pluginsDir)) {
            await sock.sendMessage(chatJid, {
                text: '*【❌┇لم يتم العثور على مجلد الأوامر!┇❌】*'
            }, { quoted: m });
            return false;
        }

        const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
        const results = [];

        for (const file of files) {
            const filePath = path.join(pluginsDir, file);
            let error = null;
            let commandInfo = null;

            try {
                const code = fs.readFileSync(filePath, 'utf8');
                const match =
                    code.match(/name\s*:\s*['"`]([^'"`]+)['"`]/i) ||
                    code.match(/aliases\s*:\s*\[([^\]]+)\]/i);
                if (match) commandInfo = match[0].trim();

                const dynamicPath = `file://${filePath}?t=${Date.now()}`;
                await import(dynamicPath);
            } catch (e) {
                error = e.message.split('\n')[0] || String(e);
            }

            results.push({
                file,
                error,
                commandInfo: commandInfo || 'لا يوجد أمر محدد'
            });
        }

        const total = results.length;
        const errors = results.filter(r => r.error);
        const errorCount = errors.length;

        let msg = `*⎔⋅• ━╼╃ ⌬〔️🐲〕⌬ ╄╾ ━ •⋅⎔*\n`;
        msg += `*『🛠️┇نتـائـج الـفـحـص الـفـنـي┇🛠️』*\n\n`;
        msg += `*⎔⋅• ━╼╃ ⌬〔️🐲〕⌬ ╄╾ ━ •⋅⎔*\n`;
        msg += `*【📂┇إجمالي الملفات : ${total}┇📂】*\n`;
        msg += `*【⚠️┇ملفات بها أخطاء : ${errorCount}┇⚠️】*\n`;
        msg += `*✠ ━━ • ━ ‹✤› ━ • ━━ ✠*\n`;

        if (errorCount === 0) {
            msg += `*『✅┇الوضع الحالي: جميع الملفات سليمة┇✅』*\n`;
        } else {
            msg += `*『❌┇تفاصيل الملفات المعطوبة┇❌』*\n`;
            for (const r of errors) {
                msg += `\n*【📄┇الملف : ${r.file}┇📄】*\n`;
                msg += `*【💢┇الخطأ : ${r.error}┇💢】*\n`;
                msg += `*【🧩┇الأمر : ${r.commandInfo}┇🧩】*\n`;
                msg += `*✠ ━━ • ━ ‹✤› ━ • ━━ ✠*`;
            }
        }

        msg += `\n\n*⎔⋅• ━╼╃ ⌬〔️🐲〕⌬ ╄╾ ━ •⋅⎔*\n`;
        msg += `*𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃*`;

        await sock.sendMessage(chatJid, {
            text: msg.trim()
        }, { quoted: m });

        return true;
    }
};