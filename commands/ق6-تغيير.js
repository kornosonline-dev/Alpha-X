export default {
    name: 'التغيرات',
    aliases: ['detect'],
    description: 'تفعيل أو تعطيل كشف التغيرات',
    category: 'ق6',
    group: true,
    admin: true,
    elite: true,
    owner: true,

    execute: async (sock, m, args, ctx) => {
        const { db } = ctx;
        const chatJid = m.key.remoteJid;

        const key = 'detect';
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
                      `> *┤ الميزة: التغيرات*\n` +
                      `> *┤ الحالة: ${currentStatus ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                      `> *┤────────────···*\n` +
                      `> *💡 استخدم: .التغيرات on  للتفعيل*\n` +
                      `> *💡 أو: .التغيرات off  للتعطيل*\n` +
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
                  `> *┤ ${statusEmoji} تم ${statusWord} ميزة التغيرات بنجاح*\n` +
                  `> *┤ الحالة الآن: ${isEnable ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                  `> *┤────────────···*\n` +
                  `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });
    }
};


// ──────────[ 𝒜𝒴𝒪𝒰ℬ ]───────────