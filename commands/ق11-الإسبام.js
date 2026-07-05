export default {
    name: 'الإسبام',
    aliases: ['antispam'],
    description: 'تفعيل أو تعطيل نظام منع الإسبام في المجموعة',
    category: 'ق11',
    group: true,
    admin: true,
    elite: true,
    owner: true,

    execute: async (sock, m, args, ctx) => {
        const { db } = ctx;
        const chatJid = m.key.remoteJid;

        const key = 'antispam';
        const targetData = db.data.chats[chatJid];
        if (!targetData) {
            return await sock.sendMessage(chatJid, {
                text: '⚠️ لم يتم العثور على إعدادات هذه المجموعة.'
            }, { quoted: m });
        }

        const action = args[0]?.toLowerCase() || '';
        const enableWords = ['on', 'تفعيل', 'تشغيل'];
        const disableWords = ['off', 'تعطيل', 'ايقاف'];

        if (!action || !enableWords.concat(disableWords).includes(action)) {
            const currentStatus = targetData[key] ?? false;
            return await sock.sendMessage(chatJid, {
                text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐂𝐎𝐍𝐅𝐈𝐆~ 〕⌬ ╄╾ ━\n\n` +
                      `> *┤ الميزة: الإسبام*\n` +
                      `> *┤ الحالة: ${currentStatus ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                      `> *┤────────────···*\n` +
                      `> *💡 استخدم: .الإسبام on  للتفعيل*\n` +
                      `> *💡 أو: .الإسبام off  للتعطيل*\n` +
                      `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
            }, { quoted: m });
        }

        const isEnable = enableWords.includes(action);
        targetData[key] = isEnable;
        db.save();

        const statusEmoji = isEnable ? '✅' : '❌';
        const statusWord = isEnable ? 'تفعيل' : 'تعطيل';

        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐂𝐎𝐍𝐅𝐈𝐆~ 〕⌬ ╄╾ ━\n\n` +
                  `> *┤ ${statusEmoji} تم ${statusWord} ميزة الإسبام بنجاح*\n` +
                  `> *┤ الحالة الآن: ${isEnable ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                  `> *┤────────────···*\n` +
                  `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });
    }
};


// ──────────[ 𝒜𝒴𝒪𝒰ℬ ]───────────