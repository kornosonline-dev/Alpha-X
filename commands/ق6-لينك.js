export default {
    name: 'لينك',
    aliases: ['رابط', 'الرابط', 'link'],
    category: 'ق6',
    description: 'يرسل رابط دعوة المجموعة',
    group: true,        // يمنع التشغيل خارج المجموعات
    admin: true,        // يسمح للمشرفين فقط (بالإضافة إلى Elite و Owner)
    botAdmin: true,     // يتطلب أن يكون البوت مشرفاً
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        // جلب رابط الدعوة (البوت مشرف مضمون بفضل botAdmin: true)
        const code = await sock.groupInviteCode(chatJid);
        const groupLink = `https://chat.whatsapp.com/${code}`;

        const linkText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━

> *✧────[ \`رابط الدعوة\` ]────╮*
> *┤ 🔗┊ الرابط:*
> *┤ ${groupLink}*
> *┤────────────···*
> *✧────[ \`تنبيه\` ]────╮*
> *┤ ⚠️┊ لا تشارك الرابط مع الغرباء*
> *┤ 🛡️┊ اتبع قوانين المجموعة دائماً*
> *┤────────────···*
> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> 𝙱𝙰┇𝙰𝙻𝙿𝐇𝙰 𝚇 𝙱𝙾𝚃`;

        await sock.sendMessage(chatJid, { 
            text: linkText,
            contextInfo: {
                externalAdReply: {
                    title: "𝐀𝐋𝐏𝐇𝐀 𝐗 - 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐍𝐊",
                    body: "رابط الانضمام للمجموعة",
                    thumbnailUrl: "https://telegra.ph/file/0c329f64e167389140e4f.jpg",
                    sourceUrl: groupLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        return true;
    }
};