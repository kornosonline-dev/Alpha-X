export default {
    name: 'ايقاف',
    aliases: ['اغلاق', 'stop'],
    category: 'ق3',
    description: 'إيقاف البوت عن العمل',
    group: false,
    admin: false,
    elite: false,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> *⚠️ جاري إيقاف البوت...*\n> *🔴 البوت سيتوقف الآن*\n> *⋅ ───━ •﹝♦﹞• ━─── ⋅*\n> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });

        setTimeout(() => {
            process.exit(0);
        }, 1000);

        return true;
    }
};