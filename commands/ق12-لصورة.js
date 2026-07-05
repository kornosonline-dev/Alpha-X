import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    name: 'لصورة',
    aliases: ['تحويل_صورة', 'toimage'],
    category: 'ق12',
    description: '🖼️ تحويل الملصق (ستيكر) إلى صورة',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;

        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        let stickerMsg = quotedMsg?.stickerMessage;

        if (!stickerMsg) {
            return sock.sendMessage(chatId, { text: '🖼️┇لازم ترد على ملصق عشان أحوله لصورة!┇😅' }, { quoted: m });
        }

        await sock.sendMessage(chatId, { react: { text: '🔄', key: m.key } });

        try {

            const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            if (!buffer.length) throw new Error('فشل تحميل الملصق');

            await sock.sendMessage(chatId, {
                image: buffer,
                caption: `*❐═━━━═╊⊰🖼️⊱╉═━━━═❐*\n\n✅ *تم تحويل الملصق إلى صورة بنجاح*\n🤖 بواسطة: ALPHA \n\n*❐═━━━═╊⊰🖼️⊱╉═━━━═❐*`
            }, { quoted: m });

            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('Sticker to image error:', err);
            await sock.sendMessage(chatId, { text: '❌ فشل تحويل الملصق إلى صورة. تأكد من أن الملف صالح.' }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────