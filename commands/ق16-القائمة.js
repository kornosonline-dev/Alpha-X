import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- الكاش (تحميل الصورة مرة واحدة عند تشغيل البوت لضمان السرعة) ---
const menuImgPath = path.join(__dirname, '../src/media/menu.png');
const FALLBACK_IMAGE_URL = 'https://files.catbox.moe/dzdua0.jpg';

let cachedImage = null;
let isImageLoaded = false;

// دالة لتحميل الصورة (محلية أو من الرابط)
async function loadMenuImage() {
    try {
        // محاولة تحميل الصورة المحلية
        if (fs.existsSync(menuImgPath)) {
            cachedImage = fs.readFileSync(menuImgPath);
            isImageLoaded = true;
            console.log('✅ تم تحميل صورة المنيو من الملف المحلي');
            return;
        }

        // إذا لم توجد الصورة المحلية، حمّل من الرابط الاحتياطي
        console.log('🔄 الصورة المحلية غير موجودة، جاري التحميل من الرابط الاحتياطي...');
        const response = await axios.get(FALLBACK_IMAGE_URL, { 
            responseType: 'arraybuffer',
            timeout: 10000 
        });
        
        cachedImage = Buffer.from(response.data);
        isImageLoaded = true;
        console.log('✅ تم تحميل صورة المنيو من الرابط الاحتياطي');

    } catch (error) {
        console.error('❌ فشل تحميل صورة المنيو:', error.message);
        cachedImage = null;
        isImageLoaded = false;
    }
}

// تحميل الصورة فوراً عند تشغيل البوت
await loadMenuImage();

export default {
    name: 'اوامر',
    aliases: ['الاوامر', 'أوامر', 'menu'],
    description: 'عرض كل أوامر البوت',
    category: 'ق16',

    execute: async (sock, m, args, ctx) => {
        try {
            const chatJid = m.key.remoteJid;
            const senderJid = m.key.participant || chatJid;
            const senderNumber = senderJid.split('@')[0];

            // 🚀 إضافة التفاعل التلقائي بمجرد طلب الأمر
            await sock.sendMessage(chatJid, { 
                react: { text: "🚀", key: m.key } 
            });

            const { metadata, db } = ctx;

            // --- حساب الوقت واليوم بسرعة فائقة ---
            const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            const now = new Date();
            const dayName = days[now.getDay()];
            const dateStr = metadata?.date || now.toLocaleDateString('ar-EG');
            
            const uptime = process.uptime();
            const uptimeStr = `${Math.floor(uptime / 3600)}:${Math.floor((uptime % 3600) / 60)}:${Math.floor(uptime % 60)}`;

            const readMore = String.fromCharCode(8206).repeat(4001);

            const menuText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━
> *┤────────────···*
> *┤ مرحبا بك @${senderNumber} 👋*
> *┤────────────···*
> *✧──[ معلومات الـبـوت ]──╮*
> *┤ 🤖┊الإسم: 𝐀𝐋𝐏𝐇𝐀 𝐗*
> *┤ ⚙️┊الإصدار: 2.0v*
> *┤ 🖲┊ البادئة: .*
> *┤ ♦┊ المهنة : إدارة*
> *┤ 🌐┊الموقع الإلكتروني:*
> https://kornos.online
> *┤────────────···*
> *✧────[ الـوقـت ]────╮*
> *┤ 📆┊التاريخ: ${dateStr}*
> *┤ 🗓┊اليوم: ${dayName}*
> *┤ 🚀┊ النشاط: ${uptimeStr}*
> *┤────────────···*
> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
\`لعرض الأوامر إضغط على مزيد\`
${readMore}
> *✧────[ الأوامر ]────╮*
> *┤────────────···*
> *┤🎭┊ \`.ق1\`:*
> *┤ قسم الشخصيات*
> *┤🧰┊ \`.ق2\`:*
> *┤ قسم الأدوات*
> *┤🧑‍💻┊ \`.ق3\`:*
> *┤ قسم المطور*
> *┤🧾┊ \`.ق4\`:*
> *┤ قسم المشرفين*
> *┤☪️┊ \`.ق5\`:*
> *┤ قسم الدين*
> *┤👥┊ \`.ق6\`:*
> *┤ قسم الجروبات*
> *┤🎮┊ \`.ق7\`:*
> *┤ قسم الألعاب*
> *┤🖼️┊ \`.ق8\`:*
> *┤ قسم الصور*
> *┤🏦┊ \`.ق9\`:*
> *┤ قسم البنك*
> *┤⬇️┊ \`.ق10\`:*
> *┤ قسم الميديا*
> *┤🛡️┊ \`.ق11\`:*
> *┤ قسم الحماية*
> *┤🔂┊ \`.ق12\`:*
> *┤ قسم الملصقات*
> *┤🍥┊ \`.ق13\`:*
> *┤ قسم الريكشنات*
> *┤🕹️┊ \`.ق14\`:*
> *┤ قسم الــزرف*
> *┤🧩┊ \`.ق15\`:*
> *┤ قسم التصميم*
> *┤♨️┊ \`.ق16\`:*
> *┤ قسم النظام*
> *┤────────────···*
> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;

            // استخدام الصورة المخزنة مؤقتاً (محلية أو من الرابط)
            const payload = cachedImage 
                ? { image: cachedImage, caption: menuText, mentions: [senderJid] }
                : { text: menuText, mentions: [senderJid] };

            await sock.sendMessage(chatJid, payload, { quoted: m });
            return true;

        } catch (error) {
            console.error("❌ Error in Menu Command:", error);
            
            // في حالة حدوث خطأ، نرسل النص فقط بدون صورة
            try {
                const senderJid = m.key.participant || m.key.remoteJid;
                const senderNumber = senderJid.split('@')[0];
                const menuTextFallback = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n> ⚠️ حدث خطأ في تحميل الصورة\n> تم إرسال القائمة كنص فقط.\n\n${menuText}`;
                await sock.sendMessage(chatJid, { text: menuTextFallback, mentions: [senderJid] }, { quoted: m });
            } catch (e) {
                console.error("❌ فشل إرسال القائمة البديلة:", e);
            }
        }
    }
};