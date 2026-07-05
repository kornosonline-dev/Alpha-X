export default {
    name: 'انذار',
    aliases: ['warn', 'تحذير'],
    category: 'ق4',
    description: 'إنذار عضو في المجموعة',
    group: true,
    admin: true,
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const { db, isOwner } = ctx;   // isOwner من ctx
        const chatJid = m.key.remoteJid;
        const contextInfo = m.message?.extendedTextMessage?.contextInfo;
        const targetName = contextInfo?.quotedMessage?.pushName;
        const targetParticipant = contextInfo?.participant;

        if (!contextInfo || (!targetName && !targetParticipant)) {
            await sock.sendMessage(chatJid, {
                text: '⚠️ يرجى الرد على رسالة الشخص المراد إنذاره.'
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

        // منع إنذار المشرفين إلا للمطور
        const groupMetadata = await sock.groupMetadata(chatJid).catch(() => ({ participants: [] }));
        const isTargetAdmin = groupMetadata.participants.some(p => p.id === targetKey && (p.admin === 'admin' || p.admin === 'superadmin'));
        if (isTargetAdmin && !isOwner) {
            await sock.sendMessage(chatJid, {
                text: '⚠️ لا يمكن إنذار المشرفين.'
            }, { quoted: m });
            return false;
        }

        const user = db.data.users[targetKey];
        user.warn = (user.warn || 0) + 1;
        db.save();

        // إذا وصل لـ 3 إنذارات → طرد
        if (user.warn >= 3) {
            // التأكد من أن البوت مشرف
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = groupMetadata.participants.some(p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin'));
            if (!isBotAdmin) {
                await sock.sendMessage(chatJid, {
                    text: '❌ لا يمكن طرد العضو لأنني لست مشرفاً.'
                }, { quoted: m });
                return false;
            }

            await sock.sendMessage(chatJid, {
                text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> *🚨 تم طرد @${targetKey.split('@')[0]}*\n> *┤ 👤 المستخدم: ${user.name || targetName}*\n> *┤ ⚠️ السبب: وصل لـ 3 إنذارات*\n> *┤────────────···*\n> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`,
                mentions: [targetKey]
            }, { quoted: m });

            await sock.groupParticipantsUpdate(chatJid, [targetKey], 'remove');
            user.warn = 0;
            db.save();
            return true;
        }

        // إنذار عادي
        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> *⚠️ إنذار @${targetKey.split('@')[0]}*\n> *┤ 👤 المستخدم: ${user.name || targetName}*\n> *┤ 📊 الإنذارات: ${user.warn}/3*\n> *┤ ⚠️ عند الإنذار الثالث سيتم الطرد*\n> *┤────────────···*\n> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`,
            mentions: [targetKey]
        }, { quoted: m });

        return true;
    }
};