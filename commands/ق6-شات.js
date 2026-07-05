export default {
    name: 'شات',
    aliases: ['القروب', 'المجموعة', 'group'],
    category: 'ق6',
    description: 'فتح أو قفل إرسال الرسائل',
    group: true,         // يعمل في المجموعات فقط
    admin: true,
    botAdmin: true,      // يتطلب أن يكون البوت مشرفاً
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const option = args[0];

        if (!['فتح', 'قفل', 'اغلاق'].includes(option)) {
            const helpText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n` +
                `> *✧───[ \`الاستخدام الصحيح\` ]───╮*\n` +
                `> *┤ 🔓┊ .شات فتح (للكل)*\n` +
                `> *┤ 🔒┊ .شات قفل (للمشرفين)*\n` +
                `> *┤────────────···*\n` +
                `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;
            return sock.sendMessage(chatJid, { text: helpText }, { quoted: m });
        }

        try {
            if (option === 'فتح') {
                await sock.groupSettingUpdate(chatJid, 'not_announcement');
                const openText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n` +
                    `> *✧────[ \`إجراء إداري\` ]────╮*\n` +
                    `> *┤ 🔓┊ حالة الشات: مفتوح*\n` +
                    `> *┤ 👥┊ الآن يمكن للجميع الإرسال*\n` +
                    `> *┤ 👮‍♂️┊ بواسطة: ${m.pushName}*\n` +
                    `> *┤────────────···*\n` +
                    `> 𝙱𝙰┇𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`;
                await sock.sendMessage(chatJid, { text: openText }, { quoted: m });
            } else {
                await sock.groupSettingUpdate(chatJid, 'announcement');
                const closeText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n` +
                    `> *✧────[ \`إجراء إداري\` ]────╮*\n` +
                    `> *┤ 🔒┊ حالة الشات: مقفل*\n` +
                    `> *┤ 🚫┊ الإرسال متاح للمشرفين فقط*\n` +
                    `> *┤ 👮‍♂️┊ بواسطة: ${m.pushName}*\n` +
                    `> *┤────────────···*\n` +
                    `> 𝙱𝙰┇𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`;
                await sock.sendMessage(chatJid, { text: closeText }, { quoted: m });
            }
        } catch (err) {
            await sock.sendMessage(chatJid, { text: '❌ فشل الإجراء، تأكد من أنني مشرف في هذه المجموعة.' }, { quoted: m });
        }
        return true;
    }
};