import { sticker } from '../lib/sticker.js';

const stickerImages = [
    "https://telegra.ph/file/ea43b170bcc6ab9f27299.png",
    "https://telegra.ph/file/a1471d99d3a76aa4579e1.jpg",
    "https://telegra.ph/file/36b272958227dafec4048.png",
    "https://telegra.ph/file/6a30c3f14b5268f4b9612.jpg",
    "https://telegra.ph/file/c97f77e4f97962615ed84.png"
];

export default {
    name: 'ميسي',
    aliases: ['ميسي', 'معزة', 'جوت'],
    category: 'ق12',
    description: '🎭 إرسال ملصق عشوائي (ميسي، معزة، جوت)',
    customPrefix: /(ميسي|معزه|جوت)/i,
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const cfg = ctx.cfg;

        const randomImage = stickerImages[Math.floor(Math.random() * stickerImages.length)];

        await sock.sendMessage(chatId, { react: { text: '🎨', key: m.key } });

        try {
            const packname = cfg.botRights || 'ALPHA BOT';
            const author = cfg.botRights || 'ALPHA BOT';
            const stickerBuffer = await sticker(null, randomImage, packname, author);

            if (stickerBuffer) {
                await sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: m });
                await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });
            } else {
                throw new Error('فشل إنشاء الملصق');
            }
        } catch (err) {
            console.error('Random sticker error:', err);

            await sock.sendMessage(chatId, { sticker: { url: randomImage } }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────