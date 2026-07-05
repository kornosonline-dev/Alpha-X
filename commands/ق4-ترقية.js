export default {
    name: 'ترقية',
    aliases: ['رفع_ادمن', 'ترقيه', 'promote'],
    category: 'ق4',
    description: 'لرفع عضو إلى رتبة مشرف',
    group: true,
    admin: true,
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        let userToPromote = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
                            m.message.extendedTextMessage?.contextInfo?.participant;
        if (!userToPromote && args[0]) {
            userToPromote = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }
        if (!userToPromote) {
            await sock.sendMessage(chatJid, { text: '⚠️ يرجى الرد على رسالة العضو أو منشن له.' }, { quoted: m });
            return false;
        }

        try {
            await sock.groupParticipantsUpdate(chatJid, [userToPromote], 'promote');
            const promoteText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *✧────[ \`ترقية إدارية\` ]────╮*
> *┤ 👤┊ العضو: @${userToPromote.split('@')[0]}*
> *┤ ✨┊ الرتبة: مشرف (Admin)*
> *┤ 👮‍♂️┊ بواسطة: ${m.pushName}*
> *┤────────────···*
> *✧────[ \`النتيجة\` ]────╮*
> *┤ ✅┊ تمت الترقية بنجاح ✔️*
> *┤────────────···*
> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;
            await sock.sendMessage(chatJid, { text: promoteText, mentions: [userToPromote] }, { quoted: m });
        } catch {
            await sock.sendMessage(chatJid, { text: '❌ فشل الأمر، تأكد من أنني مشرف في هذه المجموعة.' }, { quoted: m });
        }
        return true;
    }
};