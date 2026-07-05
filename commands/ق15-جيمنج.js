import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم6',
    aliases: ['جيمنج', 'تأثير6', 'سايبر'],
    description: 'توليد لوجو جيمنج احترافي بستايل نيون وCyberpunk متوهج بالكامل',
    category: 'ق15',
    usage: '.جيمنج [الاسم]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' ').toUpperCase(); // أسماء الجيمنج تظهر بشكل أفضل بالحروف الكبيرة

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة اسم الجيمنج الذي تريد تصميمه.\nمثال: `.جيمنج PRO N1`' 
            });
        }

        if (text.length > 10) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 10 أحرف لضمان توزيع تأثيرات النيون.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '🎮 جاري توليد ورندرة لوجو الجيمنج الاحترافي (RGB Engine)...' });

            // أبعاد مثالية ومستقرة جداً للـ Panel لمنع أي كراش (1200x1200 بكسل)
            const size = 1200;
            const canvas = createCanvas(size, size);
            const ctxCanvas = canvas.getContext('2d');
            const cx = size / 2;
            const cy = size / 2;

            // 1. خلفية داكنة جداً مع تدرج دائري نيون (Cyberpunk Grid Vignette)
            const bgGrad = ctxCanvas.createRadialGradient(cx, cy, 50, cx, cy, size * 0.7);
            bgGrad.addColorStop(0, '#0d0e15'); // رمادي داكن مزرق
            bgGrad.addColorStop(1, '#020204'); // أسود خالص لحواف اللوجو
            ctxCanvas.fillStyle = bgGrad;
            ctxCanvas.fillRect(0, 0, size, size);

            // 2. رسم تأثير الدخان والدوران النيوني في الخلفية (Neon Smoke Smoke & Energy Circle)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            
            // حلقة الطاقة المضيئة (Cyberpunk Ring)
            ctxCanvas.strokeStyle = '#ff0055'; // نيون وردي
            ctxCanvas.lineWidth = 8;
            ctxCanvas.shadowColor = '#ff0055';
            ctxCanvas.shadowBlur = 30;
            ctxCanvas.beginPath();
            ctxCanvas.arc(cx, cy, 320, 0, Math.PI * 2);
            ctxCanvas.stroke();

            ctxCanvas.strokeStyle = '#00f2fe'; // نيون سيان/تركواز متداخل
            ctxCanvas.lineWidth = 4;
            ctxCanvas.shadowColor = '#00f2fe';
            ctxCanvas.shadowBlur = 15;
            ctxCanvas.beginPath();
            ctxCanvas.arc(cx, cy, 340, 0, Math.PI * 2);
            ctxCanvas.stroke();
            ctxCanvas.restore();

            // 3. توليد جزيئات النيون وشرارات النار (Fire Sparks & Energy Particles)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            for (let i = 0; i < 70; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 250 + Math.random() * 200;
                const px = cx + Math.cos(angle) * distance;
                const py = cy + Math.sin(angle) * distance;
                const pSize = Math.random() * 5 + 1;
                
                // ألوان RGB سايبربانك عشوائية للشرارات
                const colors = ['#ff0055', '#00f2fe', '#9d4edd', '#00ff87'];
                const color = colors[Math.floor(Math.random() * colors.length)];

                ctxCanvas.fillStyle = color;
                ctxCanvas.shadowColor = color;
                ctxCanvas.shadowBlur = 10;
                ctxCanvas.beginPath();
                ctxCanvas.arc(px, py, pSize, 0, Math.PI * 2);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 4. إعدادات خط الجيمنج العريض والسميك
            ctxCanvas.font = 'italic bold 120px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            // 5. بناء العمق ثلاثي الأبعاد الديناميكي (Thick 3D Typography)
            const textDepth = 22;
            for (let i = textDepth; i > 0; i--) {
                // تدرج لوني داكن للـ 3D يعطي إحساس الصلابة المعدنية
                ctxCanvas.fillStyle = `rgb(${10 + i}, ${5 + i}, 25)`;
                ctxCanvas.fillText(text, cx - i, cy + i);
            }

            // 6. تأثيرات الإطار الخارجي المتعدد للخط (Multiple Outlines & Neon Glow)
            // أ) الإطار الخارجي البعيد المتوهج (الوردي الساطع)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#ff0055';
            ctxCanvas.lineWidth = 26;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#ff0055';
            ctxCanvas.shadowBlur = 40;
            ctxCanvas.strokeText(text, cx, cy);
            ctxCanvas.restore();

            // ب) الإطار الداخلي الوسيط (السيان التركواز الحاد)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#00f2fe';
            ctxCanvas.lineWidth = 14;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.strokeText(text, cx, cy);
            ctxCanvas.restore();

            // ج) الإطار الأسود الفاصل لحفظ معالم الحروف
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 8;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.strokeText(text, cx, cy);

            // 7. التدرج اللوني لواجهة النص الرئيسي (Cyberpunk RGB Gradient)
            const textGrad = ctxCanvas.createLinearGradient(cx, cy - 60, cx, cy + 60);
            textGrad.addColorStop(0, '#ffffff'); // لمعان علوي أبيض ساطع
            textGrad.addColorStop(0.3, '#00f2fe'); // سيان متوهج
            textGrad.addColorStop(1, '#9d4edd'); // بنفسجي داكن غامق في الأسفل

            ctxCanvas.fillStyle = textGrad;
            ctxCanvas.fillText(text, cx, cy);

            // 8. تحويل اللوحة الفنية إلى بافر جودة عالية وإرسالها
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `🎮 *تم توليد لوجو الجيمنج الاحترافي بنجاح!* 🎮\n✨ *الستايل:* \`Cyberpunk Neon RGB\``
            });

        } catch (error) {
            console.error('❌ Error in gaming logo plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة رندرة لوجو الجيمنج.' });
        }
    }
};
