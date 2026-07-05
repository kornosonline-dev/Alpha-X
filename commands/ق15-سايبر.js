import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم11',
    aliases: ['سايبر', 'تأثير11'],
    description: 'توليد لوجو سايبربانك نيون ثلاثي الأبعاد مع شبكة رقمية وأضواء المستقبل',
    category: 'ق15',
    usage: '.سايبربانك [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' ').toUpperCase();

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الاسم الذي تريد تصميمه بستايل السايببربانك.\nمثال: `.سايبربانك NEO X`' 
            });
        }

        if (text.length > 10) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 10 أحرف للحفاظ على أبعاد شبكة النيون.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '⚡ جاري شحن مكثفات النيون وبناء شبكة السايربانك الرقمية...' });

            // أبعاد ممتازة ومستقرة للرندرة السريعة (1200x800 بكسل)
            const width = 1200;
            const height = 800;
            const canvas = createCanvas(width, height);
            const ctxCanvas = canvas.getContext('2d');
            
            const cx = width / 2;
            const cy = height / 2;

            // 1. خلفية السماء الليلية لمدينة المستقبل (Retro Sci-Fi Background)
            const bgGrad = ctxCanvas.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#030106'); // أسود أرجواني داكن في الأعلى
            bgGrad.addColorStop(0.5, '#0b0214'); // بنفسجي غامق عند خط الأفق
            bgGrad.addColorStop(1, '#020b14'); // أزرق سيان داكن في الأسفل
            ctxCanvas.fillStyle = bgGrad;
            ctxCanvas.fillRect(0, 0, width, height);

            // 2. رندرة أضواء المدينة البعيدة خافتة في الأفق (Distant City Lights)
            ctxCanvas.save();
            ctxCanvas.globalAlpha = 0.15;
            ctxCanvas.fillStyle = '#00f2fe';
            for (let i = 0; i < 30; i++) {
                const w = Math.random() * 40 + 10;
                const h = Math.random() * 100 + 30;
                const x = Math.random() * width;
                const y = cy - h; // الأفق في منتصف الشاشة
                ctxCanvas.fillRect(x, y, w, h);
            }
            ctxCanvas.restore();

            // 3. رسم الأرضية الشبكية المنظورية برمجياً (3D Perspective Grid Floor)
            ctxCanvas.save();
            const horizon = cy; // خط الأفق
            ctxCanvas.strokeStyle = '#ff007f'; // نيون وردي فاقع للشبكة
            ctxCanvas.shadowColor = '#ff007f';
            
            // أ) الخطوط المنظورية الممتدة من الأفق (Perspective Lines)
            for (let x = -width * 0.5; x <= width * 1.5; x += 60) {
                ctxCanvas.globalAlpha = 0.25;
                ctxCanvas.lineWidth = 2;
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(cx, horizon); // نقطة التلاشي في السنتر
                ctxCanvas.lineTo(x, height);
                ctxCanvas.stroke();
            }

            // ب) الخطوط الأفقية التي تتقارب كلما اقتربت من الأفق (Horizontal Grid Lines)
            for (let y = horizon; y < height; y += 15) {
                // معادلة لزيادة المسافة تدريجياً لتبدو ثلاثية أبعاد حقيقية
                const ratio = (y - horizon) / (height - horizon);
                const currentY = horizon + ratio * ratio * (height - horizon);
                
                ctxCanvas.globalAlpha = 0.1 + ratio * 0.3; // تصبح أزهى كلما اقتربت للمشاهد
                ctxCanvas.lineWidth = 1 + ratio * 2;
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(0, currentY);
                ctxCanvas.lineTo(width, currentY);
                ctxCanvas.stroke();
            }
            ctxCanvas.restore();

            // 4. إضافة تأثير النويز الرقمي الخفيف (Digital Noise Texture)
            ctxCanvas.save();
            ctxCanvas.globalAlpha = 0.03;
            ctxCanvas.fillStyle = '#ffffff';
            for (let i = 0; i < 500; i++) {
                ctxCanvas.fillRect(Math.random() * width, Math.random() * height, 2, 2);
            }
            ctxCanvas.restore();

            // 5. إعدادات خط الخيال العلمي السميك والحاد (Sci-Fi Typography)
            ctxCanvas.font = 'italic bold 140px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';
            const textY = cy - 40; // رفع النص قليلاً فوق شبكة الأفق

            // 6. بناء العمق ثلاثي الأبعاد بألوان النيون المتداخلة (RGB 3D Reflections)
            const depth = 20; 
            for (let i = depth; i > 0; i--) {
                // تدرج لوني عميق ينتقل من الأزرق للبنفسجي في امتداد الـ 3D
                ctxCanvas.fillStyle = `rgb(${10 + i * 2}, ${5 + i}, ${40 + i * 4})`;
                ctxCanvas.fillText(text, cx - i, textY + i);
            }

            // 7. صهر ألوان النيون الثلاثية المتوهجة (Glow & Bloom Outlines)
            // أ) هالة النيون البنفسجية البعيدة (Deep Purple Bloom)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#9d4edd';
            ctxCanvas.lineWidth = 28;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#9d4edd';
            ctxCanvas.shadowBlur = 45;
            ctxCanvas.strokeText(text, cx, textY);
            ctxCanvas.restore();

            // ب) الوهج النيوني الأزرق الحاد (Cyan Neon Glow)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#00f2fe';
            ctxCanvas.lineWidth = 14;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#00f2fe';
            ctxCanvas.shadowBlur = 20;
            ctxCanvas.strokeText(text, cx, textY);
            ctxCanvas.restore();

            // ج) الإطار الفاصل النيوني الوردي الخارجي (Pink Neon Accent)
            ctxCanvas.strokeStyle = '#ff007f';
            ctxCanvas.lineWidth = 4;
            ctxCanvas.strokeText(text, cx, textY);

            // 8. تدرج واجهة النص النيون الساطع الأساسي (High Quality Cyber Gradient)
            const textGrad = ctxCanvas.createLinearGradient(cx, textY - 60, cx, textY + 60);
            textGrad.addColorStop(0, '#ffffff'); // قلب النيون الأبيض المشع بالحرارة
            textGrad.addColorStop(0.2, '#00f2fe'); // سيان
            textGrad.addColorStop(0.7, '#ff007f'); // وردي فاقع
            textGrad.addColorStop(1, '#7b2cbf'); // بنفسجي سايبر عميق في القاع

            ctxCanvas.fillStyle = textGrad;
            ctxCanvas.fillText(text, cx, textY);

            // 9. تصدير البافر عالي الجودة وإرساله
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `⚡ *تم رندرة لوجو السايبربانك المتوهج بنجاح!* ⚡\n📟 *البيئة:* \`3D Synthwave Grid & Neon Bloom Engine\``
            });

        } catch (error) {
            console.error('❌ Error in cyberpunk logo plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة رندرة وتوليد تأثير السايبربانك.' });
        }
    }
};
