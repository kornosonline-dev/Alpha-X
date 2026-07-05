import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم7',
    aliases: ['جرافيتي', 'شوارعي', 'بخاخ'],
    description: 'توليد نص جرافيتي احترافي مع جدار إسمنتي وتأثير سيلان البخاخ',
    category: 'ق15',
    usage: '.جرافيتي [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' '); // نترك النص كما هو ليعطي طابع الكتابة الحرة

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة النص الذي تريد تحويله إلى جرافيتي.\nمثال: `.جرافيتي Urban King`' 
            });
        }

        if (text.length > 12) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ النص طويل جداً! الحد الأقصى هو 12 حرفاً لضمان دقة تفاصيل الجدار وسيلان الطلاء.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '🎨 جاري رش الجدار وتوليد نص الجرافيتي الشوارعي...' });

            // أبعاد ممتازة ومستقرة للأمر (1400x900 بكسل) عريضة لتناسب الـ Wall Texture
            const width = 1400;
            const height = 900;
            const canvas = createCanvas(width, height);
            const ctxCanvas = canvas.getContext('2d');
            
            const cx = width / 2;
            const cy = height / 2;

            // 1. توليد جدار الطوب الإسمنتي برمجياً (Procedural Brick Wall Texture)
            ctxCanvas.fillStyle = '#2b2b2b'; // لون طوب أساسي داكن غامق
            ctxCanvas.fillRect(0, 0, width, height);

            ctxCanvas.strokeStyle = '#1c1c1c'; // لون الفواصل بين قوالب الطوب
            ctxCanvas.lineWidth = 6;
            const brickHeight = 60;
            const brickWidth = 140;

            for (let y = 0; y < height; y += brickHeight) {
                // إزاحة الطوب في الأسطر الزوجية لإعطاء شكل بناء حقيقي (Offset)
                const offset = ((y / brickHeight) % 2 === 0) ? 0 : brickWidth / 2;
                
                // رسم الخط الأفقي للسطر
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(0, y);
                ctxCanvas.lineTo(width, y);
                ctxCanvas.stroke();

                // رسم الفواصل العمودية للطوب
                for (let x = -offset; x < width + brickWidth; x += brickWidth) {
                    ctxCanvas.beginPath();
                    ctxCanvas.moveTo(x, y);
                    ctxCanvas.lineTo(x, y + brickHeight);
                    ctxCanvas.stroke();
                }
            }

            // إضافة خشونة وتعتيم إسمنتي عشوائي (Wall Grunge)
            ctxCanvas.fillStyle = 'rgba(0, 0, 0, 0.15)';
            for (let i = 0; i < 800; i++) {
                const gx = Math.random() * width;
                const gy = Math.random() * height;
                const gSize = Math.random() * 4 + 1;
                ctxCanvas.fillRect(gx, gy, gSize, gSize);
            }

            // 2. إعداد الخط اليدوي السميك (Hand-drawn feeling)
            ctxCanvas.font = 'italic bold 150px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            // تدوير طفيف لإعطاء مظهر الجرافيتي الحر غير المنتظم
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy);
            ctxCanvas.rotate(-0.04); // إمالة خفيفة لليسار تماشيًا مع الفن الشوارعي

            // 3. تأثير رشاش البخاخ الخلفي الشامل (Background Spray Splashes)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            for (let i = 0; i < 15; i++) {
                // هالات ألوان نيون عشوائية خلف النص لتبدو كرشات بخاخ عريضة
                const sx = (Math.random() - 0.5) * (text.length * 90);
                const sy = (Math.random() - 0.5) * 100;
                const sRadius = Math.random() * 120 + 60;
                
                const sprayGrad = ctxCanvas.createRadialGradient(sx, sy, 10, sx, sy, sRadius);
                sprayGrad.addColorStop(0, i % 2 === 0 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 0, 127, 0.4)');
                sprayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctxCanvas.fillStyle = sprayGrad;
                ctxCanvas.beginPath();
                ctxCanvas.arc(sx, sy, sRadius, 0, Math.PI * 2);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 4. بناء الـ 3D والظلال السميكة المشوهة (Thick Urban Shadows)
            ctxCanvas.fillStyle = '#111111';
            const depth = 35;
            for (let i = depth; i > 0; i--) {
                // إزاحة خشنة للأسفل واليمين لصنع عمق صلب فوق الطوب
                ctxCanvas.fillText(text, i, i);
            }

            // 5. حدود النيون المتوهجة المكررة (Neon Outlines)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#ff007f'; // وردي فوسفوري متوهج
            ctxCanvas.lineWidth = 24;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#ff007f';
            ctxCanvas.shadowBlur = 35;
            ctxCanvas.strokeText(text, 0, 0);
            ctxCanvas.restore();

            // إطار أسود حاد يفصل النيون عن الواجهة
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 12;
            ctxCanvas.strokeText(text, 0, 0);

            // 6. تدرج ألوان الواجهة الرئيسية للنص (Graffiti High Quality Gradient)
            const frontGrad = ctxCanvas.createLinearGradient(0, -70, 0, 70);
            frontGrad.addColorStop(0, '#00f2fe'); // تركواز نيون علوي
            frontGrad.addColorStop(0.5, '#4facfe'); // أزرق متوسط
            frontGrad.addColorStop(1, '#000000'); // تعتيم سفلي حاد لستايل الشوارع
            ctxCanvas.fillStyle = frontGrad;
            ctxCanvas.fillText(text, 0, 0);

            // 7. رسم سيلان الطلاء وقطرات البخاخ (Paint Drips & Splatters)
            ctxCanvas.fillStyle = '#00f2fe'; // نفس لون واجهة الحروف لتظهر القطرات ممتدة منها
            ctxCanvas.save();
            
            // حساب مواقع تقريبية لأسفل الحروف لرسم التسييل
            const textWidth = ctxCanvas.measureText(text).width;
            const startX = -textWidth / 2;
            const segment = textWidth / (text.length * 2);

            for (let i = 0; i < text.length * 2; i++) {
                if (Math.random() > 0.4) { // رندرة عشوائية للسيلان لتبدو طبيعية وغير مكررة
                    const dripX = startX + (i * segment) + (Math.random() * 15 - 7);
                    const dripY = 50; // يبدأ السيلان من أسفل الحرف
                    const dripLength = Math.random() * 90 + 30; // أطوال عشوائية للسيولة

                    // رسم خط السيلان المنحدر لأسفل
                    ctxCanvas.beginPath();
                    ctxCanvas.lineWidth = Math.random() * 6 + 3;
                    ctxCanvas.lineCap = 'round';
                    ctxCanvas.strokeStyle = '#00f2fe';
                    ctxCanvas.moveTo(dripX, dripY);
                    ctxCanvas.lineTo(dripX, dripY + dripLength);
                    ctxCanvas.stroke();

                    // رسم نقطة دائرية ممتلئة في نهاية خط السيلان (تأثير تجميع الجاذبية للطلاء)
                    ctxCanvas.beginPath();
                    ctxCanvas.arc(dripX, dripY + dripLength, ctxCanvas.lineWidth * 0.9, 0, Math.PI * 2);
                    ctxCanvas.fill();
                }
            }

            // إضافة قطرات طلاء متناثرة معزولة بالأسفل (Splashes)
            for (let i = 0; i < 25; i++) {
                const sx = (Math.random() - 0.5) * (textWidth + 100);
                const sy = 120 + Math.random() * 150;
                const sSize = Math.random() * 6 + 2;
                ctxCanvas.beginPath();
                ctxCanvas.arc(sx, sy, sSize, 0, Math.PI * 2);
                ctxCanvas.fill();
            }

            ctxCanvas.restore(); // إنهاء تأثير السيلان والقطرات
            ctxCanvas.restore(); // إنهاء التدوير الكلي والإزاحة للجرافيتي

            // 8. تحويل لوحة الجرافيتي إلى بافر جودة عالية وإرسالها
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `🎨 *تم رش وتوليد لوحة الجرافيتي الشوارعية بنجاح!* 🎨\n🧱 *البيئة:* \`Procedural Concrete Brick Wall\``
            });

        } catch (error) {
            console.error('❌ Error in graffiti plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء توليد جدار الجرافيتي.' });
        }
    }
};
