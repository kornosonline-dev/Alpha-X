export default {
    name: 'اخرج',
    aliases: ['خروج', 'leave'],
    category: 'ق3',
    description: 'يخرج البوت من المجموعة',
    group: true,        // يعمل في المجموعات فقط (main.js سيمنع في الخاص)
    admin: false,
    elite: false,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        // إرسال رسالة وداع
        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> *✧────[ \`الرسالة\` ]────╮*\n> *┤ 🤖┊ تلقيت أمر من مطوري بالخروج من الجروب✔️*\n> َ\n> *┤ 🤗┊ وداعا. ألفا يحبكم*\n> *┤────────────···*\n> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });

        setTimeout(async () => {
            await sock.groupLeave(chatJid);
        }, 1000);

        return true;
    }
};