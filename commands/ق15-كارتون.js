import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم12',
    aliases: ['popart', 'كارتون', 'تأثير12'],
    description: 'توليد لوجو بوب آرت وكوميكس كلاسيكي بألوان فاقعة وعشوائية برمجياً',
    category: 'ق15',
    usage: '.تصميم12 [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' ').toUpperCase();

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الكلمة التي تريد تحويلها لستايل البوب آرت.\nمثال: `.بوب_آرت BOOM`' 
            });
        }

        if (text.length > 8) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الكلمة طويلة جداً! الحد الأقصى هو 8 أحرف لضمان ملاءمتها داخل فقاعة الكلام.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '💥 جاري خلط الألوان الفاقعة ورندرة لوحة الـ Pop Art الكلاسيكية...' });

            const size = 1200;
            const canvas = createCanvas(size, size);
            const ctxCanvas = canvas.getContext('2d');
            const cx = size / 2;
            const cy = size / 2;

            // 1. إعداد مصفوفة لوحات الألوان الفاقعة العشوائية (Random Color Palettes)
            const palettes = [
                { bg: '#FFEB3B', explosion: '#FF3D00', bubble: '#FFFFFF', textTop: '#00E676', textBot: '#00B0FF' },
                { bg: '#E040FB', explosion: '#FFFF00', bubble: '#FFFFFF', textTop: '#FF3D00', textBot: '#FFEA00' },
                { bg: '#00E5FF', explosion: '#FF007F', bubble: '#FFFF00', textTop: '#FFFFFF', textBot: '#9C27B0' },
                { bg: '#FF3D00', explosion: '#FFFF00', bubble: '#FFFFFF', textTop: '#00F2FE', textBot: '#004AM8' }
            ];
            // اختيار لوحة ألوان عشوائية عند كل طلب لمنح تنوع مبهر
            const color = palettes[Math.floor(Math.random() * palettes.length)];

            // 2. تلوين الخلفية الأساسية باللون الفاقع
            ctxCanvas.fillStyle = color.bg;
            ctxCanvas.fillRect(0, 0, size, size);

            // 3. رندرة نقاط الكوميكس التراثية هندسياً (Procedural Comic Dots / Halftone)
            ctxCanvas.fillStyle = 'rgba(0, 0, 0, 0.15)';
            const dotSpacing = 28;
            for (let x = 0; x < size; x += dotSpacing) {
                for (let y = 0; y < size; y += dotSpacing) {
                    ctxCanvas.beginPath();
                    ctxCanvas.arc(x, y, 5, 0, Math.PI * 2);
                    ctxCanvas.fill();
                }
            }

            // 4. رسم الانفجار الكرتوني الخلفي الحاد (Cartoon Explosion)
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy);
            ctxCanvas.fillStyle = color.explosion;
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 14;
            ctxCanvas.lineJoin = 'miter';

            ctxCanvas.beginPath();
            const spikes = 16;
            const outerRadius = 480;
            const innerRadius = 320;
            for (let i = 0; i < spikes * 2; i++) {
                const angle = (i * Math.PI) / spikes;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                // إضافة عشوائية خفيفة للحواف لجعلها تبدو مرسومة يدوياً بكشكشة الكوميكس
                const dynamicRadius = radius + (Math.random() * 30 - 15);
                const ex = Math.cos(angle) * dynamicRadius;
                const ey = Math.sin(angle) * dynamicRadius;
                if (i === 0) ctxCanvas.moveTo(ex, ey);
                else ctxCanvas.lineTo(ex, ey);
            }
            ctxCanvas.closePath();
            ctxCanvas.stroke();
            ctxCanvas.fill();
            ctxCanvas.restore();

            // 5. رسم فقاعة الكلام الكرتونية الدائرية (Speech Bubble) في السنتر
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy);
            ctxCanvas.fillStyle = color.bubble;
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 12;

            ctxCanvas.beginPath();
            // رسم جسم الفقاعة البيضاوي المتعرج قليلاً لستايل قديم (Vintage)
            ctxCanvas.ellipse(0, -10, 340, 220, 0, 0, Math.PI * 2);
            ctxCanvas.stroke();
            ctxCanvas.fill();

            // ذيل الفقاعة الكرتوني الحاد المتجه لأسفل اليسار
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(-120, 150);
            ctxCanvas.lineTo(-240, 260); // رأس المثلث المشير للخارج
            ctxCanvas.lineTo(-50, 180);
            ctxCanvas.closePath();
            ctxCanvas.stroke();
            ctxCanvas.fill();
            ctxCanvas.restore();

            // 6. رسم نجوم مرحة متناثرة في الأركان (Funny Stars)
            const drawPopStar = (sx, sy, rOuter, rInner) => {
                ctxCanvas.save();
                ctxCanvas.fillStyle = '#FFFF00';
                ctxCanvas.strokeStyle = '#000000';
                ctxCanvas.lineWidth = 8;
                ctxCanvas.beginPath();
                for (let i = 0; i < 5 * 2; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2;
                    const r = i % 2 === 0 ? rOuter : rInner;
                    ctxCanvas.lineTo(sx + Math.cos(angle) * r, sy + Math.sin(angle) * r);
                }
                ctxCanvas.closePath();
                ctxCanvas.stroke();
                ctxCanvas.fill();
                ctxCanvas.restore();
            };
            drawPopStar(cx - 380, cy - 350, 55, 24);
            drawPopStar(cx + 400, cy - 320, 45, 20);
            drawPopStar(cx + 390, cy + 350, 60, 26);

            // 7. إعدادات خط الكوميكس الضخم والمائل (Comic Typography)
            ctxCanvas.font = 'italic bold 135px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            // تدوير طفيف للنص ليعطي طابع التأثيرات الصوتية للكوميكس (مثال: POW, CRASH)
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy - 10);
            ctxCanvas.rotate(-0.05);

            // أ) الظل الأسود السميك والمنفصل (Thick Pop Art Shadow)
            ctxCanvas.fillStyle = '#000000';
            const shadowShift = 18;
            ctxCanvas.fillText(text, shadowShift, shadowShift);

            // ب) الحدود الخارجية السوداء السميكة للخط (Thick Outline)
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 24;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.strokeText(text, 0, 0);

            // ج) تدرج واجهة النص الرئيسي الفاقع (Dynamic Text Gradient)
            const textGrad = ctxCanvas.createLinearGradient(0, -60, 0, 60);
            textGrad.addColorStop(0, color.textTop);
            textGrad.addColorStop(1, color.textBot);
            ctxCanvas.fillStyle = textGrad;
            ctxCanvas.fillText(text, 0, 0);

            ctxCanvas.restore();

            // 8. تحويل اللوحة إلى بافر بصيغة JPEG وإرسالها فوراً
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `💥 *تم توليد لوجو الـ POP ART بنجاح!* 💥\n🎨 *الألوان المدمجة:* \`Random Vintage Comic Palette\``
            });

        } catch (error) {
            console.error('❌ Error in popart logo plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة رندرة وتوليد البوب آرت.' });
        }
    }
};
