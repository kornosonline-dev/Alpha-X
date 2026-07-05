import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

export default {
    name: 'دمج',
    aliases: ['emojimix', 'مكس'],
    category: 'ق12',
    description: '🎭 دمج إيموجيين مع بعض لصنع ملصق (Emoji Kitchen)',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const text = args.join(' ').trim();
        const cfg = ctx.cfg;

        if (!text || !text.includes('+')) {
            return sock.sendMessage(chatId, {
                text: `⚠️ الصيغة الصحيحة:\n\n.دمج 😺+😆`
            }, { quoted: m });
        }

        const [emoji1, emoji2] = text.split('+').map(e => e.trim());

        if (!emoji1 || !emoji2) {
            return sock.sendMessage(chatId, {
                text: '❌ لازم تحط إيموجيين صحيحين'
            }, { quoted: m });
        }

        await sock.sendMessage(chatId, { react: { text: '🧩', key: m.key } });

        try {
            const url = `https://tenor.googleapis.com/v2/featured` +
                `?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ` +
                `&contentfilter=high` +
                `&media_filter=png_transparent` +
                `&component=proactive` +
                `&collection=emoji_kitchen_v5` +
                `&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;

            const res = await fetch(url);
            const json = await res.json();

            if (!json.results || json.results.length === 0) {
                throw new Error('هذا الدمج غير مدعوم');
            }

            const imgUrl = json.results[0].url;
            const packname = cfg.botRights || 'ALPHA BOT';
            const author = cfg.botRights || 'ALPHA BOT';

            const stiker = await sticker(false, imgUrl, packname, author);

            await sock.sendMessage(chatId, { sticker: stiker }, { quoted: m });
            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('Emojimix error:', err);
            await sock.sendMessage(chatId, {
                text: '❌ حدث خطأ أو هذا الدمج غير متوفر'
            }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────