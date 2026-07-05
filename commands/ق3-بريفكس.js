import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsPath = path.join(__dirname, '../config.js');

export default {
    name: 'بريفكس',
    aliases: ['بادئة', 'prefix'],
    category: 'ق3',
    description: 'إدارة بادئات البوت',
    usage   : '.بريفكس اضافة ! | .بريفكس حذف ! | .بريفكس قائمة',
    owner : true,

    execute: async (sock, m, args, { cfg }) => {
        const chatJid = m.key.remoteJid;
        const reply   = (text) => sock.sendMessage(chatJid, { text }, { quoted: m });

        const sub    = args[0]?.toLowerCase();
        const symbol = args[1]?.trim();

        if (!sub || sub === 'list' || sub === 'قائمة') {
            const list = cfg.prefix.join('  |  ');
            return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 𝐋𝐈𝐒𝐓 〕━━━╮*
*┃ 📋 البادئات الحالية :*
*┃ ${list}*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
            );
        }

        if (!symbol) {
            return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ ❌ يجب تحديد الرمز*
*┃ 📌 مثال : .بريفكس اضاقة !*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
            );
        }

        if (sub === 'add' || sub === 'اضافة') {
            if (cfg.prefix.includes(symbol)) {
                return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ ⚠️ البادئة موجودة مسبقاً*
*┃ 📌 الرمز : ${symbol}*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
                );
            }

            cfg.prefix.push(symbol);
            await updateSettings(cfg.prefix);

            return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ ✅ تمت الإضافة بنجاح*
*┃ 📌 الرمز : ${symbol}*
*┃ 📋 الكل : ${cfg.prefix.join(' | ')}*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
            );
        }

        if (sub === 'remove' || sub === 'حذف') {
            if (!cfg.prefix.includes(symbol)) {
                return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ ⚠️ البادئة غير موجودة*
*┃ 📌 الرمز : ${symbol}*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
                );
            }

            if (cfg.prefix.length === 1) {
                return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ ❌ لا يمكن حذف آخر بادئة*
*┃ 📌 يجب أن تبقى بادئة واحدة*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
                );
            }

            cfg.prefix = cfg.prefix.filter(p => p !== symbol);
            await updateSettings(cfg.prefix);

            return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ ✅ تم الحذف بنجاح*
*┃ 📌 الرمز : ${symbol}*
*┃ 📋 الكل : ${cfg.prefix.join(' | ')}*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
            );
        }

        return reply(
`*╭━━━〔 𝐏𝐑𝐄𝐅𝐈𝐗 〕━━━╮*
*┃ 📌 الاستخدام :*
*┃ .بريفكس قائمة — عرض البادئات*
*┃ .بريفكس اضافة ! — إضافة بادئة*
*┃ .بريفكس حذق ! — حذف بادئة*
*╰━━━━━━━━━━━━━━━━━━━━╯*`
        );
    },
};

const updateSettings = async (newPrefixes) => {
    let content = fs.readFileSync(settingsPath, 'utf8');

    content = content.replace(
        /prefix\s*:\s*\[.*?\]/s,
        `prefix: [${newPrefixes.map(p => `'${p}'`).join(', ')}]`
    );

    fs.writeFileSync(settingsPath, content, 'utf8');
};


// ──────────[ 𝒜𝒴𝒪𝒰ℬ ]───────────