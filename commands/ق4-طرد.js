export default {
    name: 'طرد',
    aliases: ['كرش', 'kick'],
    category: 'ق4',
    description: 'لطرد عضو من المجموعة',
    group: true,
    admin: true,
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        // التحقق من أن البوت مشرف (لأن الطرد يتطلب صلاحية)
        const groupMetadata = await sock.groupMetadata(chatJid).catch(() => null);
        if (!groupMetadata) {
            await sock.sendMessage(chatJid, { text: '❌ لا يمكن جلب معلومات المجموعة.' }, { quoted: m });
            return false;
        }
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = groupMetadata.participants.some(p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin'));
        if (!isBotAdmin) {
            await sock.sendMessage(chatJid, { text: '❌ يجب أن أكون مشرفاً لأتمكن من الطرد.' }, { quoted: m });
            return false;
        }

        // تحديد المستهدف
        let userToKick = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
                         m.message.extendedTextMessage?.contextInfo?.participant;
        if (!userToKick && args[0]) {
            userToKick = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }
        if (!userToKick) {
            await sock.sendMessage(chatJid, { text: '⚠️ يرجى الرد على رسالة العضو أو عمل منشن له.' }, { quoted: m });
            return false;
        }

        // منع طرد المشرفين أو المطور (المطور محمي في main.js لكن نضعه احتياطاً)
        const isTargetAdmin = groupMetadata.participants.some(p => p.id === userToKick && (p.admin === 'admin' || p.admin === 'superadmin'));
        if (isTargetAdmin) {
            await sock.sendMessage(chatJid, { text: '❌ لا يمكن طرد مشرف.' }, { quoted: m });
            return false;
        }

        await sock.groupParticipantsUpdate(chatJid, [userToKick], 'remove');

        const kickText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *✧────[ \`إجراء إداري\` ]────╮*
> *┤ 👤┊ العضو: @${userToKick.split('@')[0]}*
> *┤ 🚫┊ الإجراء: طرد من المجموعة*
> *┤ 👮‍♂️┊ بواسطة: ${m.pushName}*
> *┤────────────···*
> *✧────[ \`النتيجة\` ]────╮*
> *┤ 🗑️┊ تم التنظيف بنجاح ✔️*
> *┤────────────···*
> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;

        await sock.sendMessage(chatJid, { text: kickText, mentions: [userToKick, m.key.participant || m.participant || chatJid] }, { quoted: m });
        return true;
    }
};