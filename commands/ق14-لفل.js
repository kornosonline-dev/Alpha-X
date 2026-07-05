// commands/حسابي.js
import { getUniqueKicked } from '../lib/persist.js';

export default {
    name: 'لفل',
    aliases: ['مزروفين', 'عدد'],
    description: 'عرض مستواك ورتبتك بالزرف.',
    category: 'ق14',
    group: false,
    admin: false,
    elite: true,
    owner: true,  
    
    execute: async (sock, m, args, { cfg, command }) => {
        const chatJid = m.key.remoteJid;

        const kickedMap = getUniqueKicked();
        const totalKicked = kickedMap.size;

        const level = Math.floor(totalKicked / 5);

        let rank = 'E';
        if (level >= 220) rank = 'SSS+';
        else if (level >= 175) rank = 'SS+';
        else if (level >= 135) rank = 'S+';
        else if (level >= 100) rank = 'S';
        else if (level >= 70) rank = 'A';
        else if (level >= 45) rank = 'B';
        else if (level >= 25) rank = 'C';
        else if (level >= 10) rank = 'D';

        const response = `> *✧────[ \`الحــسـاب\` ]────╮*
> *┤ 👤 ┊ الاســم: سونغ*
> *┤ 🆙 ┊ المستوى: ${level}*
> *┤ 🏆 ┊ الـرتبة: ${rank}*
> *┤────────────···*
> *✧────[ \`المزروفين\` ]────╮*
> *┤ 👤 ┊ عدد الأعضاء: ${totalKicked}*
> *┤────────────···*
> © 𝙱𝚈 𝙻𝙸𝙻𝙸𝚃𝙷`;

        await sock.sendMessage(chatJid, { text: response });
    }
};
