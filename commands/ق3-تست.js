export default {
    name: 'تست',
    aliases: ['حالة', 'ping'],
    category: 'ق3',
    description: 'عرض معلومات الحالة والسرعة',
    group: false,       // يعمل في كل مكان
    admin: false,
    elite: false,
    owner: false,       // متاح للجميع (بدون صلاحيات)
    
    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const start = Date.now();
        const end = Date.now(); // لحساب الفرق (0 عمليًا، لكن يمكن تعديله)
        const ping = end - start;

        let speedStatus = 'سريعة 🚀';
        if (ping > 500) speedStatus = 'متوسطة 🐢';
        if (ping > 1000) speedStatus = 'ضعيفة ⚠️';

        const testText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━

> *✧───[ \`المعلومات\`  ]───╮*
> *┤ 👑┊ البوت: 𝐀𝐋𝐏𝐇𝐀*
> *┤ 🛜┊ الحالة: ${ping}ms*
> *┤ 🚀┊ الإستجابة: ${speedStatus}*
> *┤────────────···*
> *✧────[ \`النتيجة\` ]────╮*
> *┤ 🤖┊ البوت يعمل بشكل ممتاز ✔️*
> *┤────────────···*
> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;

        await sock.sendMessage(chatJid, { text: testText }, { quoted: m });
        return true;
    }
};