import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم9',
    aliases: ['ice', 'جليد', 'تأثير9'],
    description: 'توليد نص جليدي مجمد برمجياً بالكامل مع شقوق الجليد وجزيئات الثلج',
    category: 'ق15',
    usage: '.ثلج [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' ').toUpperCase(); // الحروف الكبيرة تعطي مظهر البلورات الضخمة

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الاسم الذي تريد تجميده.\nمثال: `.ثلج COLD BOY`' 
            });
        }

        if (text.length > 10) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 10 أحرف لضمان دقة شقوق الجليد.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '❄️ جاري تجميد الحروف وبناء بلورات الثلج والصقيع...' });

            // أبعاد مثالية ومستقرة (1200x800 بكسل)
            const width = 1200;
            const height = 800;
            const canvas = createCanvas(width, height);
            const ctxCanvas = canvas.getContext('2d');
            
            const cx = width / 2;
            const cy = height / 2;

            // 1. خلفية داكنة جداً مع تدرج جليدي عميق في السنتر (Arctic Deep Blue Background)
            const bgGrad = ctxCanvas.createRadialGradient(cx, cy, 50, cx, cy, width * 0.6);
            bgGrad.addColorStop(0, '#021024'); // أزرق قطبي عميق في السنتر خلف النص
            bgGrad.addColorStop(0.5, '#050b14'); // أزرق داكن جداً
            bgGrad.addColorStop(1, '#010307'); // أسود قطبي في الأطراف
            ctxCanvas.fillStyle = bgGrad;
            ctxCanvas.fillRect(0, 0, width, height);

            // 2. توليد نسيج الصقيع عشوائياً في الخلفية (Frost Texture)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctxCanvas.lineWidth = 1;
            for (let i = 0; i < 400; i++) {
                const fx = Math.random() * width;
                const fy = Math.random() * height;
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(fx, fy);
                // خطوط صقيع متقاطعة وزوايا ثلجية حادة
                ctxCanvas.lineTo(fx + (Math.random() * 15 - 7), fy + (Math.random() * 15 - 7));
                ctxCanvas.stroke();
            }
            ctxCanvas.restore();

            // 3. إعدادات خط احترافي ضخم وحاد ليناسب كتل الجليد
            ctxCanvas.font = 'bold italic 135px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            const textWidth = ctxCanvas.measureText(text).width;
            const startX = cx - textWidth / 2;

            // 4. بناء العمق ثلاثي الأبعاد الجليدي (Thick Frozen 3D)
            const iceDepth = 25; 
            for (let i = iceDepth; i > 0; i--) {
                // تدرج أزرق ثلجي داكن للعمق لإعطاء إيحاء بسمك لوح الثلج
                ctxCanvas.fillStyle = `rgb(${10 + i}, ${Math.min(255, 40 + i * 4)}, ${Math.min(255, 80 + i * 5)})`;
                ctxCanvas.fillText(text, cx - i, cy + i);
            }

            // 5. طبقات التوهج واللمعان (Blue Glow & White Highlights)
            // أ) التوهج الخارجي الأزرق القطبي المشع (Glacial Outer Glow)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#00e5ff'; // أزرق نيون جليدي
            ctxCanvas.lineWidth = 16;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#00b0ff';
            ctxCanvas.shadowBlur = 35;
            ctxCanvas.strokeText(text, cx, cy);
            ctxCanvas.restore();

            // ب) إطار أبيض ساطع للحواف لمحاكاة قشرة الثلج المتجمدة (White Highlights / Bevel)
            ctxCanvas.strokeStyle = '#ffffff';
            ctxCanvas.lineWidth = 4;
            ctxCanvas.strokeText(text, cx, cy);

            // ج) تدرج واجهة النص الرئيسي (Crystal Gradient & Crystal Reflections)
            const textGrad = ctxCanvas.createLinearGradient(cx, cy - 60, cx, cy + 60);
            textGrad.addColorStop(0, '#ffffff'); // لمعان ثلجي ساطع جداً في الأعلى
            textGrad.addColorStop(0.3, '#b3e5fc'); // أزرق سماوي فاتح عاكس
            textGrad.addColorStop(0.5, '#0288d1'); // أزرق جليدي متوسط لخط الانعكاس
            textGrad.addColorStop(0.8, '#01579b'); // أزرق عميق متجمد
            textGrad.addColorStop(1, '#00b0ff'); // توهج سفلي خفيف

            ctxCanvas.fillStyle = textGrad;
            ctxCanvas.fillText(text, cx, cy);

            // 6. رسم شقوق الجليد الداخلية داخل الحروف برمجياً (Procedural Ice Cracks)
            ctxCanvas.save();
            // حصر الشقوق داخل نطاق الحروف فقط لتبدو طبيعية
            ctxCanvas.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctxCanvas.lineWidth = 2;
            
            for (let i = 0; i < text.length * 3; i++) {
                // توليد نقطة بداية عشوائية للشرخ فوق مساحة النص
                const crackX = startX + (Math.random() * textWidth);
                const crackY = cy + (Math.random() * 100 - 50);

                ctxCanvas.beginPath();
                ctxCanvas.moveTo(crackX, crackY);
                
                // رسم مسار الشرخ المتعرج (Zig-zag)
                let currentX = crackX;
                let currentY = crackY;
                for (let j = 0; j < 4; j++) {
                    currentX += (Math.random() * 30 - 15);
                    currentY += (Math.random() * 30 - 15);
                    ctxCanvas.lineTo(currentX, currentY);
                }
                ctxCanvas.stroke();
            }
            ctxCanvas.restore();

            // 7. تساقط جزيئات الثلج والبلورات المتلألئة (Snow Particles & Sparkles)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            for (let i = 0; i < 70; i++) {
                const sx = Math.random() * width;
                const sy = Math.random() * height;
                const sSize = Math.random() * 5 + 1.5;

                // تنويع أشكال الجزيئات بين دوائر ناعمة ونقاط حادة عاكسة
                ctxCanvas.fillStyle = Math.random() > 0.4 ? '#ffffff' : '#80d8ff';
                ctxCanvas.shadowColor = ctxCanvas.fillStyle;
                ctxCanvas.shadowBlur = Math.random() * 8 + 2;

                ctxCanvas.beginPath();
                ctxCanvas.arc(sx, sy, sSize, 0, Math.PI * 2);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 8. استخراج الصورة وإرسال البافر مباشرة
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `❄️ *تم تجميد الاسم وتوليد لوجو الجليد الكريستالي بنجاح!* ❄️\n✨ *التأثير:* \`Frozen Crystal & Ice Cracks Engine\``
            });

        } catch (error) {
            console.error('❌ Error in ice logo plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة رندرة وتوليد تأثير الثلج.' });
        }
    }
};
