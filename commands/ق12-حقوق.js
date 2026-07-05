import { addExif } from '../lib/sticker.js';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    name: 'حقوق',
    aliases: ['wm', 'سرقة'],
    category: 'ق12',
    description: '🏷️ إضافة حقوق (اسم الباكدج والكاتب) على الملصق',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const cfg = ctx.cfg;
        const text = args.join(' ').trim();

        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = quotedMsg?.stickerMessage;

        if (!stickerMsg) {
            return sock.sendMessage(chatId, { text: '👀┇لازم ترد على الاستيكر اللي عايز تضيف عليه اسم الباكدج يامعلم!┇😎' }, { quoted: m });
        }

        let packname, author;

        if (!text) {

            packname = cfg.botRights || 'SUNG BOT';
            author = cfg.ownerRights || 'SUNG BOT';
        } else if (text.includes('|')) {

            const parts = text.split('|');
            packname = parts[0].trim() || cfg.botRights || 'ALPHA BOT';
            author = parts[1]?.trim() || cfg. ownerRights || 'ALPHA BOT';
        } else {

            packname = text;
            author = text;
        }

        await sock.sendMessage(chatId, { react: { text: '🏷️', key: m.key } });

        try {

            const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            if (!buffer.length) throw new Error('فشل تحميل الملصق');

            const stiker = await addExif(buffer, packname, author);

            if (!stiker) throw new Error('فشل إضافة الحقوق');

            await sock.sendMessage(chatId, { sticker: stiker }, { quoted: m });
            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('WM error:', err);
            await sock.sendMessage(chatId, { text: '😔┇حصلت غلطة! تأكد انك رديت على استيكر وضفت اسم الباكدج ياعم!┇🚨' }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────