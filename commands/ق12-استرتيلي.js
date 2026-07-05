import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

const TELEGRAM_BOT_TOKEN = '891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4'; // توكن البوت (من الكود الأصلي)

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    name: 'استيكتيلي',
    aliases: ['stickertele', 'استك_تيلي'],
    category: 'ق12',
    description: '📦 تحميل حزمة ملصقات من تيليجرام (باستخدام الرابط)',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;
        const url = args[0];

        if (!url) {
            return sock.sendMessage(chatId, {
                text: `⚠️ *أدخل رابط حزمة الملصقات من تيليجرام*\n\n📝 مثال:\n.استيكرال https://t.me/addstickers/Porcientoreal`
            }, { quoted: m });
        }

        if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi)) {
            return sock.sendMessage(chatId, {
                text: '❌ *الرابط غير صالح*\nيجب أن يكون رابط حزمة ملصقات تيليجرام مثل:\nhttps://t.me/addstickers/اسم_الحزمة'
            }, { quoted: m });
        }

        await sock.sendMessage(chatId, { react: { text: '📥', key: m.key } });

        const packName = url.replace('https://t.me/addstickers/', '');
        const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getStickerSet?name=${encodeURIComponent(packName)}`;

        try {
            const response = await fetch(apiUrl, {
                headers: { 'User-Agent': 'GoogleBot' }
            });
            if (!response.ok) throw new Error('فشل الاتصال بـ Telegram API');
            const json = await response.json();

            if (!json.ok || !json.result) {
                throw new Error('الحزمة غير موجودة أو الرابط خاطئ');
            }

            const stickerCount = json.result.stickers.length;
            const packInfo = `📦 *اسم الحزمة:* ${json.result.title || packName}\n🖼️ *عدد الملصقات:* ${stickerCount}\n⏳ *سيتم الإرسال خلال:* ${Math.ceil(stickerCount * 1.5)} ثانية`;

            await sock.sendMessage(chatId, { text: packInfo }, { quoted: m });

            const cfg = ctx.cfg;
            const defaultPack = cfg.botRights || 'ALPHA BOT';
            const defaultAuthor = cfg.botRights || 'ALPHA BOT';

            for (let i = 0; i < stickerCount; i++) {
                const stickerObj = json.result.stickers[i];
                const fileId = stickerObj.thumb?.file_id || stickerObj.file_id;
                if (!fileId) continue;

                const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
                const fileJson = await fileRes.json();
                if (!fileJson.ok || !fileJson.result?.file_path) continue;

                const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileJson.result.file_path}`;

                const stikerBuffer = await sticker(false, fileUrl, defaultPack, defaultAuthor);

                if (stikerBuffer) {
                    await sock.sendMessage(chatId, { sticker: stikerBuffer }, { quoted: m });
                }

                await delay(3000);
            }

            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });
        } catch (err) {
            console.error('Telegram sticker error:', err);
            await sock.sendMessage(chatId, {
                text: '❌ حدث خطأ أثناء تحميل الحزمة. تأكد من الرابط وأن البوت يعمل.'
            }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────