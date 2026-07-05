export default {
    name: 'فك_الكتم',
    aliases: ['unmute'],
    category: 'ق4',
    description: 'فك كتم عضو في المجموعة',
    group: true,
    admin: true,
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const { db } = ctx;
        const chatJid = m.key.remoteJid;
        const contextInfo = m.message?.extendedTextMessage?.contextInfo;
        const targetName = contextInfo?.quotedMessage?.pushName;
        const targetParticipant = contextInfo?.participant;

        if (!contextInfo || (!targetName && !targetParticipant)) {
            await sock.sendMessage(chatJid, {
                text: '⚠️ يرجى الرد على رسالة الشخص المراد فك كتمه.'
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

        db.data.users[targetKey].muto = false;
        db.save();

        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐌𝐔𝐓𝐄~ 〕⌬ ╄╾ ━\n\n> *🔊 تم فك الكتم بنجاح*\n> *┤ 👤 المستخدم: ${db.data.users[targetKey].name || targetName}*\n> *┤ ✅ الحالة: مسموح له بالتحدث*\n> *┤────────────···*\n> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`,
            mentions: [targetKey]
        }, { quoted: m });

        return true;
    }
};