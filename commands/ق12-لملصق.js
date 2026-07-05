import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { sticker } from '../lib/sticker.js';

export default {
    name: 'لملصق',
    aliases: ['sticker', 'ملصق', 'لاستكر', 'تحويل_ملصق'],
    category: 'ق12',
    description: '🖼️ تحويل الصورة إلى ملصق (ستيكر)',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const cfg = ctx.cfg;
        const packname = cfg.botRights || 'ALPHA BOT';
        const author = cfg.botRights || 'ALPHA BOT';

        let imageMsg = m.message?.imageMessage;
        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!imageMsg && quotedMsg?.imageMessage) imageMsg = quotedMsg.imageMessage;

        if (!imageMsg) {
            return sock.sendMessage(chatId, { text: '🖼️┇لازم ترد على صورة عشان أحولها لملصق!┇😅' }, { quoted: m });
        }

        await sock.sendMessage(chatId, { react: { text: '🔃', key: m.key } });

        try {

            const stream = await downloadContentFromMessage(imageMsg, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            if (!buffer.length) throw new Error('فشل تحميل الصورة');

            const stikerBuffer = await sticker(buffer, null, packname, author);

            if (!stikerBuffer) throw new Error('فشل التحويل');

            await sock.sendMessage(chatId, { sticker: stikerBuffer }, { quoted: m });
            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('Sticker error:', err);
            await sock.sendMessage(chatId, { text: '❌ فشل تحويل الصورة إلى ملصق. تأكد من أن الصورة صالحة.' }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────