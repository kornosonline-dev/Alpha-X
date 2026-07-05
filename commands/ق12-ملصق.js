import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

export default {
    name: 'ملصق',
    aliases: ['stickername', 'ملصق_اسم'],
    category: 'ق12',
    description: '🎭 إنشاء ملصق (ستيكر) من اسم شخصية أنمي',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const text = args.join(' ').trim();
        const cfg = ctx.cfg;

        if (!text) {
            return sock.sendMessage(chatId, {
                text: `⚠️ اكتب اسم شخصية أو أنمي\n\n📝 مثال:\n.ملصق ناروتو`
            }, { quoted: m });
        }

        await sock.sendMessage(chatId, { react: { text: '🔍', key: m.key } });

        try {
            const url = `https://api.dorratz.com/v2/googleimage?query=${encodeURIComponent(text + ' anime sticker png')}`;
            const res = await fetch(url);
            const json = await res.json();

            if (!json || !json.results || json.results.length === 0) {
                return sock.sendMessage(chatId, {
                    text: `❌ لم أجد ملصقًا لـ: *${text}*`
                }, { quoted: m });
            }

            const img = json.results[Math.floor(Math.random() * json.results.length)];
            const packname = cfg.botRights || 'ALPHA BOT';
            const author = cfg.botRights || 'ALPHA BOT';

            const stkr = await sticker(false, img.url, packname, author);

            if (!stkr) throw new Error('فشل إنشاء الملصق');

            await sock.sendMessage(chatId, { sticker: stkr }, { quoted: m });
            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('Sticker from name error:', err);
            await sock.sendMessage(chatId, {
                text: '❌ حدث خطأ أثناء إنشاء الملصق.'
            }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA]───────────