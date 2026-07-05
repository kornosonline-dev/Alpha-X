import { sticker } from '../lib/sticker.js';

export default {
    name: 'نرد',
    aliases: ['dado', 'dados', 'dadu'],
    category: 'ق12',
    description: '🎲 إرسال ملصق نرد عشوائي',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const cfg = ctx.cfg;

        const diceImages = [
            'https://tinyurl.com/gdd01',
            'https://tinyurl.com/gdd02',
            'https://tinyurl.com/gdd003',
            'https://tinyurl.com/gdd004',
            'https://tinyurl.com/gdd05',
            'https://tinyurl.com/gdd006'
        ];

        const randomImage = diceImages[Math.floor(Math.random() * diceImages.length)];
        const packname = cfg.botRights || 'ALPHA BOT';
        const author = cfg.botRights || 'ALPHA BOT';

        await sock.sendMessage(chatId, { react: { text: '🎲', key: m.key } });

        try {
            const stickerBuffer = await sticker(false, randomImage, packname, author);
            if (stickerBuffer) {
                await sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: m });
                await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });
            } else {
                throw new Error('فشل إنشاء الملصق');
            }
        } catch (err) {
            console.error('Dice sticker error:', err);
            await sock.sendMessage(chatId, { sticker: { url: randomImage } }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────