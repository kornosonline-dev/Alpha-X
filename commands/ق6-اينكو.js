import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
    name: 'تغيير',
    aliases: ['الضبط', 'اعدادات', 'group'],
    category: 'ق6',
    description: 'تغيير اسم أو وصف أو صورة',
    group: true,
    admin: true,
    botAdmin: true,      // يتطلب أن يكون البوت مشرفاً
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const option = (args[0] || '').toLowerCase();

        if (!['صورة', 'اسم', 'وصف'].includes(option)) {
            const helpText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n` +
                `> *✧───[ \`الاستخدام الصحيح\` ]───╮*\n` +
                `> *┤ 🖼️┊ .تغيير صورة (رد على صورة)*\n` +
                `> *┤ 📝┊ .تغيير اسم (الاسم الجديد)*\n` +
                `> *┤ 🗒️┊ .تغيير وصف (الوصف الجديد)*\n` +
                `> *┤────────────···*\n` +
                `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;
            return sock.sendMessage(chatJid, { text: helpText }, { quoted: m });
        }

        /* ───────── تغيير الصورة ───────── */
        if (option === 'صورة') {
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const mediaMsg = quoted?.imageMessage || m.message?.imageMessage;
            if (!mediaMsg) {
                return sock.sendMessage(chatJid, { text: '⚠️ يرجى الرد على صورة لتغيير صورة المجموعة.' }, { quoted: m });
            }

            try {
                // تحميل الصورة باستخدام downloadMediaMessage
                const buffer = await downloadMediaMessage(
                    { key: m.key, message: { imageMessage: mediaMsg } },
                    'buffer',
                    {},
                    sock
                );
                
                const imgPath = `./temp_group_${Date.now()}.jpg`;
                const image = await Jimp.read(buffer);
                await image.writeAsync(imgPath);

                await sock.updateProfilePicture(chatJid, { url: imgPath });
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

                return sock.sendMessage(chatJid, { text: '✅ تم تحديث صورة المجموعة بنجاح.' }, { quoted: m });
            } catch (err) {
                return sock.sendMessage(chatJid, { text: '❌ فشل تغيير الصورة، تأكد من صلاحياتي.' }, { quoted: m });
            }
        }

        /* ───────── تغيير الاسم ───────── */
        if (option === 'اسم') {
            const newName = args.slice(1).join(' ') || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
            if (!newName) return sock.sendMessage(chatJid, { text: '⚠️ اكتب الاسم الجديد بعد الأمر.' }, { quoted: m });

            try {
                await sock.groupUpdateSubject(chatJid, newName);
                return sock.sendMessage(chatJid, { text: `✅ تم تغيير اسم المجموعة إلى:\n*『 ${newName} 』*` }, { quoted: m });
            } catch (err) {
                return sock.sendMessage(chatJid, { text: '❌ فشل تغيير الاسم.' }, { quoted: m });
            }
        }

        /* ───────── تغيير الوصف ───────── */
        if (option === 'وصف') {
            const newDesc = args.slice(1).join(' ') || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
            if (!newDesc) return sock.sendMessage(chatJid, { text: '⚠️ اكتب الوصف الجديد بعد الأمر.' }, { quoted: m });

            try {
                await sock.groupUpdateDescription(chatJid, newDesc);
                return sock.sendMessage(chatJid, { text: '✅ تم تحديث وصف المجموعة بنجاح.' }, { quoted: m });
            } catch (err) {
                return sock.sendMessage(chatJid, { text: '❌ فشل تحديث الوصف.' }, { quoted: m });
            }
        }
    }
};