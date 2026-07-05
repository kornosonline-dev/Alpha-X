export default {
    name: 'حذف',
    aliases: ['delete', 'del'],
    category: 'ق4',
    description: 'حذف رسالة عند الرد عليها',
    group: true,
    admin: true,
    elite: true,
    owner: true,
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const contextInfo = m.message?.extendedTextMessage?.contextInfo;

        if (!contextInfo?.stanzaId) {
            await sock.sendMessage(chatJid, {
                text: '⚠️ يرجى الرد على الرسالة المراد حذفها.'
            }, { quoted: m });
            return false;
        }

        // حذف الرسالة المردود عليها
        await sock.sendMessage(chatJid, {
            delete: {
                remoteJid: chatJid,
                fromMe: false,
                id: contextInfo.stanzaId,
                participant: contextInfo.participant
            }
        });

        // حذف رسالة الأمر نفسها
        await sock.sendMessage(chatJid, {
            delete: m.key
        });

        return true;
    }
};