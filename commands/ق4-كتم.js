export default {
    name: 'كتم',
    aliases: ['mute'],
    category: 'ق4',
    description: 'كتم عضو في المجموعة',
    group: true,        // يمنع التشغيل خارج المجموعات
    admin: true,        // يسمح للمشرفين (بالإضافة إلى Elite و Owner إن وجدت)
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        try {
            const { db, isOwner } = ctx;          // نأخذ isOwner من ctx
            const chatJid = m.key.remoteJid;
            const contextInfo = m.message?.extendedTextMessage?.contextInfo;
            const targetName = contextInfo?.quotedMessage?.pushName;
            const targetParticipant = contextInfo?.participant;

            // التأكد من الرد على رسالة
            if (!contextInfo || (!targetName && !targetParticipant)) {
                await sock.sendMessage(chatJid, {
                    text: '⚠️ يرجى الرد على رسالة الشخص المراد كتمه.'
                }, { quoted: m });
                return false;
            }

            // البحث عن المستخدم في قاعدة البيانات
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

            // جلب بيانات المجموعة للتحقق من صلاحيات المستهدف
            const groupMetadata = await sock.groupMetadata(chatJid).catch(() => ({ participants: [] }));
            const participants = groupMetadata.participants || [];
            const targetInGroup = participants.find(p => p.id === targetKey);
            const isTargetAdmin = targetInGroup?.admin === 'admin' || targetInGroup?.admin === 'superadmin';

            // منع كتم المشرفين إلا للمطور
            if (isTargetAdmin && !isOwner) {
                await sock.sendMessage(chatJid, {
                    text: '⚠️ لا يمكن كتم المشرفين.'
                }, { quoted: m });
                return false;
            }

            // تفعيل الكتم
            db.data.users[targetKey].muto = true;
            db.save();

            await sock.sendMessage(chatJid, {
                text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐌𝐔𝐓𝐄~ 〕⌬ ╄╾ ━\n\n> *🔇 تم الكتم بنجاح*\n> *┤ 👤 المستخدم: ${db.data.users[targetKey].name || targetName}*\n> *┤ 🚫 الحالة: ممنوع من التحدث*\n> *┤────────────···*\n> *⚠️ سيتم حذف رسائله تلقائياً.*\n> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`,
                mentions: [targetKey]
            }, { quoted: m });

            return true;

        } catch (error) {
            console.error("❌ Mute Command Error:", error);
        }
    }
};