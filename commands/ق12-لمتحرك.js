import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '..', 'temp');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

export default {
    name: 'لمتحرك',
    aliases: ['متحرك', 'gif2sticker', 'stikergif'],
    category: 'ق12',
    description: '🎬 تحويل فيديو قصير أو GIF إلى ملصق متحرك (ستيكر متحرك)',
    execute: async (sock, m, args, ctx) => {
        const chatId = m.key.remoteJid;

        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        let videoMsg = quotedMsg?.videoMessage;
        let gifMsg = quotedMsg?.gifMessage;

        if (!videoMsg && !gifMsg) {
            return sock.sendMessage(chatId, { text: '🎞️┇لازم ترد على فيديو قصير أو GIF عشان أحوله لملصق متحرك!┇😅' }, { quoted: m });
        }

        const mediaType = videoMsg ? 'video' : 'gif';
        const mediaMsg = videoMsg || gifMsg;

        await sock.sendMessage(chatId, { react: { text: '🎬', key: m.key } });

        const inputPath = path.join(TEMP_DIR, `input_${Date.now()}.mp4`);
        const outputPath = path.join(TEMP_DIR, `output_${Date.now()}.webp`);

        try {

            const stream = await downloadContentFromMessage(mediaMsg, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            if (!buffer.length) throw new Error('فشل تحميل الملف');

            fs.writeFileSync(inputPath, buffer);

            await sock.sendMessage(chatId, { text: '⏳ *جاري تحويل المقطع إلى ملصق متحرك...*' }, { quoted: m });

            await new Promise((resolve, reject) => {
                const cmd = `ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0" -loop 0 -an -vsync 0 "${outputPath}"`;
                exec(cmd, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            if (!fs.existsSync(outputPath)) throw new Error('فشل إنشاء الملف');

            await sock.sendMessage(chatId, { sticker: fs.readFileSync(outputPath) }, { quoted: m });
            await sock.sendMessage(chatId, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('GIF sticker error:', err);
            await sock.sendMessage(chatId, { text: '❌ فشل تحويل المقطع إلى ملصق متحرك. تأكد أن المدة قصيرة (أقل من 10 ثوانٍ).' }, { quoted: m });
        } finally {

            try {
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            } catch (e) {}
        }
    }
};


// ──────────[ ALPHA ]───────────