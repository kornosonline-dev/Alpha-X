import axios from 'axios';
import { sticker } from '../lib/sticker.js';

export default {
    name: 'اقتباسي',
    aliases: ['اقتباس'],
    category: 'ق12',
    description: '💬 إنشاء ملصق يحتوي على نص مقتبس مع صورة المستخدم',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const cfg = ctx.cfg;

        let text = args.join(' ').trim();
        if (!text) {

            const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quotedMsg) {
                text = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '';
            }
        }

        if (!text) {
            return sock.sendMessage(chatId, { text: '❌ *أدخل النص الذي تريد تحويله إلى ملصق*' }, { quoted: m });
        }

        let targetJid = null;
        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned.length > 0) {
            targetJid = mentioned[0];
        } else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
            targetJid = m.message.extendedTextMessage.contextInfo.participant;
        } else {

            targetJid = m.key.participant || m.sender || m.key.remoteJid;
        }

        if (!targetJid || typeof targetJid !== 'string') {
            return sock.sendMessage(chatId, { text: '❌ لم أتمكن من تحديد المستخدم.' }, { quoted: m });
        }

        const mentionNumber = targetJid.split('@')[0];
        const cleanText = text.replace(new RegExp(`@${mentionNumber}\\s*`, 'g'), '').trim();

        if (cleanText.length === 0) {
            return sock.sendMessage(chatId, { text: '❌ النص فارغ بعد إزالة المنشن.' }, { quoted: m });
        }

        if (cleanText.length > 80) {
            return sock.sendMessage(chatId, { text: '⚠️ النص طويل جداً (الحد الأقصى 80 حرفاً)' }, { quoted: m });
        }

        await sock.sendMessage(chatId, { react: { text: '🖌️', key: m.key } });

        try {

            let ppUrl;
            try {
                ppUrl = await sock.profilePictureUrl(targetJid, 'image');
            } catch {
                ppUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
            }

            const userName = await getDisplayName(sock, targetJid);

            const obj = {
                type: 'quote',
                format: 'png',
                backgroundColor: '#000000',
                width: 512,
                height: 768,
                scale: 2,
                messages: [{
                    entities: [],
                    avatar: true,
                    from: {
                        id: 1,
                        name: userName,
                        photo: { url: ppUrl }
                    },
                    text: cleanText,
                    replyMessage: {}
                }]
            };

            const response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
                headers: { 'Content-Type': 'application/json' }
            });

            const imageBuffer = Buffer.from(response.data.result.image, 'base64');
            if (!imageBuffer) throw new Error('فشل إنشاء الصورة');

            const packname = cfg.botRights || 'SUNG BOT';
            const author = cfg.botRights || 'SUNG BOT';
            const stickerBuffer = await sticker(imageBuffer, false, packname, author);

            if (stickerBuffer) {
                await sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: m });
                await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });
            } else {
                throw new Error('فشل تحويل الصورة إلى ملصق');
            }
        } catch (err) {
            console.error('QC sticker error:', err);
            await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء إنشاء الملصق. تأكد من أن الخدمة تعمل.' }, { quoted: m });
        }
    }
};

async function getDisplayName(sock, jid) {
    try {
        const name = await sock.getName(jid);
        if (name && name !== jid) return name;
        return jid.split('@')[0];
    } catch {
        return jid.split('@')[0];
    }
}


// ──────────[ ALPHA ]───────────