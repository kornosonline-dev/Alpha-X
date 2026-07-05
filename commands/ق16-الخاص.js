export default {
    name: 'الخاص',
    aliases: ['private'],
    description: 'تفعيل أو تعطيل وضع الخاص (يعمل البوت فقط في الخاص)',
    category: 'ق16',
    group: false,      // تعمل في الخاص والمجموعات
    admin: true,
    elite: true,
    owner: true,

    execute: async (sock, m, args, ctx) => {
        const { db } = ctx;
        const chatJid = m.key.remoteJid;

        const key = 'private';
        const targetData = db.data.settings;
        if (!targetData) {
            return await sock.sendMessage(chatJid, {
                text: '⚠️ لم يتم العثور على إعدادات البوت.'
            }, { quoted: m });
        }

        const action = args[0]?.toLowerCase() || '';
        const enableWords = ['on', 'تفعيل', 'تشغيل'];
        const disableWords = ['off', 'تعطيل', 'ايقاف'];

        if (!action || !enableWords.concat(disableWords).includes(action)) {
            const currentStatus = targetData[key] ?? false;
            return await sock.sendMessage(chatJid, {
                text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐂𝐎𝐍𝐅𝐈𝐆~ 〕⌬ ╄╾ ━\n\n` +
                      `> *┤ الميزة: الخاص*\n` +
                      `> *┤ الحالة: ${currentStatus ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                      `> *┤────────────···*\n` +
                      `> *💡 استخدم: .الخاص on  للتفعيل*\n` +
                      `> *💡 أو: .الخاص off  للتعطيل*\n` +
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
                  `> *┤ ${statusEmoji} تم ${statusWord} ميزة الخاص بنجاح*\n` +
                  `> *┤ الحالة الآن: ${isEnable ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                  `> *┤────────────···*\n` +
                  `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });
    }
};


// ──────────[ 𝒜𝒴𝒪𝒰ℬ ]───────────