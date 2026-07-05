export default {
    name: 'ريستر',
    aliases: ['اعادة', 'restart'],
    category: 'ق3',
    description: 'إعادة تشغيل البوت',
    group: false,      // يعمل في الخاص والمجموعات
    admin: false,
    elite: false,      // لا نحتاجها لأن owner=true كافٍ
    owner: true,       // فقط المطور الأساسي

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;

        // إرسال رسالة تأكيد
        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> *🔄 جاري إعادة التشغيل...*\n> *⏳ سيعود البوت خلال ثوانٍ*\n> *⋅ ───━ •﹝♦﹞• ━─── ⋅*\n> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });

        setTimeout(() => {
            process.exit(1);   // الخروج برمز غير صفري، ليعيد تشغيله المشرف (مثل PM2)
        }, 1000);

        return true;
    }
};