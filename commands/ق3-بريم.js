export default {
    name: 'بريميوم',
    aliases: ['premium'],
    category: 'ق3',
    description: 'تفعيل أو إلغاء البريميوم',
    group: false,       // يعمل في الخاص والمجموعات
    admin: false,
    elite: false,
    owner: true,        // يسمح للمطور فقط (main.js سيمنع الآخرين)
    
    execute: async (sock, m, args, ctx) => {
        const { db } = ctx;
        const chatJid = m.key.remoteJid;
        const contextInfo = m.message?.extendedTextMessage?.contextInfo;
        const targetName = contextInfo?.quotedMessage?.pushName;
        const targetParticipant = contextInfo?.participant;

        if (!contextInfo || (!targetName && !targetParticipant)) {
            await sock.sendMessage(chatJid, {
                text: '⚠️ يرجى الرد على رسالة الشخص.'
            }, { quoted: m });
            return false;
        }

        let targetKey = targetName
            ? Object.keys(db.data.users).find(key =>
                key.includes('@s.whatsapp.net') &&
                db.data.users[key].name === targetName)
            : null;

        if (!targetKey && targetParticipant?.includes('@s.whatsapp.net')) {
            targetKey = targetParticipant;
        }

        if (!targetKey) {
            await sock.sendMessage(chatJid, {
                text: '⚠️ لم يتم العثور على المستخدم في قاعدة البيانات.'
            }, { quoted: m });
            return false;
        }

        const user = db.data.users[targetKey];
        user.premium = !user.premium;
        db.save();

        const statusEmoji = user.premium ? '👑' : '❌';
        const statusWord = user.premium ? 'تفعيل' : 'إلغاء';

        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> *${statusEmoji} تم ${statusWord} البريميوم بنجاح*\n> *┤ 👤 المستخدم: ${user.name || targetName}*\n> *┤ 📌 الحالة: ${user.premium ? 'بريميوم 👑' : 'عادي 👤'}*\n> *┤────────────···*\n> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`,
            mentions: [targetKey]
        }, { quoted: m });

        return true;
    }
};