import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم10',
    aliases: ['luxury', 'gold', 'تأثير10'],
    description: 'توليد لوجو ذهبي فاخر ثلاثي الأبعاد مع انعكاسات معدنية وشرارات مضيئة',
    category: 'ق15',
    usage: '.ذهبي [الاسم]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' '); // نترك حالة الحروف حرة لتناسب الخطوط الكلاسيكية الفاخرة

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الاسم الذي تريد تصميمه بستايل ذهبي فاخر.\nمثال: `.ذهبي LUXURY`' 
            });
        }

        if (text.length > 12) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 12 حرفاً للحفاظ على تفاصيل الانعكاسات.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '✨ جاري صهر الذهب ورندرة اللوجو الملكي الفاخر...' });

            // أبعاد ممتازة ومستقرة ومثالية للجروبات والبروفايل (1200x800 بكسل)
            const width = 1200;
            const height = 800;
            const canvas = createCanvas(width, height);
            const ctxCanvas = canvas.getContext('2d');
            
            const cx = width / 2;
            const cy = height / 2;

            // 1. خلفية سوداء ملكية داكنة مع تدرج دائري خفيف جداً (Luxury Black Vignette)
            const bgGrad = ctxCanvas.createRadialGradient(cx, cy, 30, cx, cy, width * 0.6);
            bgGrad.addColorStop(0, '#0b0c10'); // رمادي كربوني غامق جداً في المنتصف
            bgGrad.addColorStop(1, '#020203'); // أسود ملكي في الأطراف
            ctxCanvas.fillStyle = bgGrad;
            ctxCanvas.fillRect(0, 0, width, height);

            // 2. إعدادات خط Serif كلاسيكي أنيق وفاخر (Elegant Serif Typography)
            ctxCanvas.font = 'bold 130px "Times New Roman", "Georgia", serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            const textWidth = ctxCanvas.measureText(text).width;
            const startX = cx - textWidth / 2;

            // 3. بناء العمق ثلاثي الأبعاد والبروز الذهبي (Thick 3D & Gold Emboss)
            const goldDepth = 20; 
            for (let i = goldDepth; i > 0; i--) {
                // تدرج برونزي/ذهبي داكن متدرج ليعطي الإحساس بالعمق المعدني المصقول
                ctxCanvas.fillStyle = `rgb(${40 + i * 2}, ${30 + i}, 10)`;
                ctxCanvas.fillText(text, cx - i, cy + i);
            }

            // 4. تأثير التوهج الخارجي والظلال المتعددة (Outer Glow & Dynamic Shadow)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = 'rgba(212, 175, 55, 0.3)'; // ذهبي ملكي شفاف
            ctxCanvas.lineWidth = 12;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#D4AF37';
            ctxCanvas.shadowBlur = 30; // توهج ناعم فاخر محيط بالكلمة
            ctxCanvas.strokeText(text, cx, cy);
            ctxCanvas.restore();

            // 5. بناء التدرج المعدني للواجهة الرئيسية (Premium Metallic Gold Gradient)
            const goldGrad = ctxCanvas.createLinearGradient(cx, cy - 60, cx, cy + 60);
            goldGrad.addColorStop(0, '#FFF9C4'); // لمعان بلاتيني ذهبي ساطع في الأعلى
            goldGrad.addColorStop(0.2, '#D4AF37'); // ذهبي ملكي نقي
            goldGrad.addColorStop(0.48, '#AA771C'); // ذهبي داكن (خط الانعكاس الداخلي)
            goldGrad.addColorStop(0.52, '#F3E5AB'); // بريق معدني مفاجئ في المنتصف (Reflection)
            goldGrad.addColorStop(0.8, '#D4AF37'); // عودة للذهبي الصافي
            goldGrad.addColorStop(1, '#5B4010'); // برونزي داكن جداً في الأسفل للحصول على مظهر الـ Emboss

            ctxCanvas.fillStyle = goldGrad;
            ctxCanvas.fillText(text, cx, cy);

            // 6. إضافة تحديد داخلي وخارجي رفيع لحواف الحروف لإبراز دقة التصميم
            ctxCanvas.strokeStyle = '#FFF9C4'; // خط ذهبي ساطع شديد النحافة للحواف
            ctxCanvas.lineWidth = 2;
            ctxCanvas.strokeText(text, cx, cy);

            // 7. توليد بريق جزيئات الذهب اللامعة المتناثرة حول النص (Golden Sparkles & Particles)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            for (let i = 0; i < 45; i++) {
                // نثر الجزيئات قريباً من جسم النص ليحاكيه بشكل جمالي
                const px = startX - 30 + (Math.random() * (textWidth + 60));
                const py = cy + (Math.random() * 120 - 60);
                const pSize = Math.random() * 3 + 1;

                // ألوان بريق متنوعة من الفضي الساطع إلى الذهبي النقي
                ctxCanvas.fillStyle = Math.random() > 0.5 ? '#FFF9C4' : '#D4AF37';
                ctxCanvas.shadowColor = ctxCanvas.fillStyle;
                ctxCanvas.shadowBlur = Math.random() * 8 + 2;

                ctxCanvas.beginPath();
                ctxCanvas.arc(px, py, pSize, 0, Math.PI * 2);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 8. تصدير اللوحة الفنية إلى بافر وإرسالها للمستخدم مباشرة
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `✨ *تم توليد اللوجو الذهبي الملكي الفاخر بنجاح!* ✨\n🏆 *الستايل:* \`Premium Metallic Gold Emboss\``
            });

        } catch (error) {
            console.error('❌ Error in luxury gold plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة ورندرة اللوجو الذهبي.' });
        }
    }
};
