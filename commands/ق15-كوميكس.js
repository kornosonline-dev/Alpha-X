import { createCanvas } from 'canvas';

export default {
    name: 'تصميم1',
    aliases: ['كميكس', 'كوميكس'],
    description: 'توليد لوجو كوميكس احترافي بأعلى أداء مع برق متطور وتأثيرات ثلاثية الأبعاد',
    category: 'ق15',
    usage: '.تصميم1 [الاسم]',
    cooldown: 4,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.chat || m.key.remoteJid;
        const text = args.join(' ').toUpperCase();

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الاسم الذي تريد تصميمه.\nمثال: `.تصميم Ayoub`' 
            }, { quoted: m });
        }

        if (text.length > 15) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 15 حرفاً لضمان بقائه داخل الانفجار.' 
            }, { quoted: m });
        }

        try {
            const size = 1000;
            const canvas = createCanvas(size, size);
            const ctxCanvas = canvas.getContext('2d');

            // ─── 1. خلفية متدرجة غامقة ───
            const bgGradient = ctxCanvas.createRadialGradient(500, 500, 100, 500, 500, 700);
            bgGradient.addColorStop(0, '#1a1a2e');
            bgGradient.addColorStop(0.5, '#16213e');
            bgGradient.addColorStop(1, '#0f0f1a');
            ctxCanvas.fillStyle = bgGradient;
            ctxCanvas.fillRect(0, 0, size, size);

            // ─── 2. أشعة الشمس الخلفية (Sunburst) مع تأثير توهج ───
            ctxCanvas.save();
            ctxCanvas.translate(size / 2, size / 2);
            const totalBeams = 36;
            const angleStep = (Math.PI * 2) / totalBeams;

            for (let i = 0; i < totalBeams; i++) {
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(0, 0);
                ctxCanvas.arc(0, 0, size + 100, i * angleStep, (i + 1) * angleStep + 0.05);
                ctxCanvas.closePath();
                
                const currentAngle = (i * (360 / totalBeams));
                // ألوان متدرجة من الأحمر/البرتقالي إلى البنفسجي/الأزرق
                const hue = (currentAngle + 180) % 360;
                ctxCanvas.fillStyle = `hsl(${hue}, 90%, 60%)`;
                ctxCanvas.globalAlpha = 0.3 + (Math.sin(i * 0.3) * 0.1);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // ─── 3. توهج دائري في المنتصف ───
            const glow = ctxCanvas.createRadialGradient(500, 500, 50, 500, 500, 400);
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            glow.addColorStop(0.5, 'rgba(255, 200, 0, 0.08)');
            glow.addColorStop(1, 'rgba(255, 200, 0, 0)');
            ctxCanvas.fillStyle = glow;
            ctxCanvas.fillRect(0, 0, size, size);

            // ─── 4. صاعقة البرق المتطورة (3 برقات متداخلة) ───
            const drawLightning = (startX, startY, endX, endY, color, width, offsetX = 0, offsetY = 0) => {
                ctxCanvas.save();
                ctxCanvas.translate(offsetX, offsetY);
                ctxCanvas.strokeStyle = color;
                ctxCanvas.lineWidth = width;
                ctxCanvas.lineCap = 'round';
                ctxCanvas.lineJoin = 'round';
                ctxCanvas.shadowColor = color;
                ctxCanvas.shadowBlur = 30;

                const points = [
                    { x: startX, y: startY },
                    { x: startX + 30, y: startY + 80 },
                    { x: startX - 20, y: startY + 160 },
                    { x: startX + 50, y: startY + 250 },
                    { x: startX - 30, y: startY + 340 },
                    { x: startX + 40, y: startY + 430 },
                    { x: startX - 20, y: startY + 520 },
                    { x: endX, y: endY }
                ];

                // إضافة تموج عشوائي للبرق
                for (let i = 1; i < points.length - 1; i++) {
                    points[i].x += (Math.random() - 0.5) * 30;
                    points[i].y += (Math.random() - 0.5) * 10;
                }

                ctxCanvas.beginPath();
                ctxCanvas.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    const xc = (points[i].x + points[i - 1].x) / 2;
                    const yc = (points[i].y + points[i - 1].y) / 2;
                    ctxCanvas.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
                }
                ctxCanvas.lineTo(points[points.length - 1].x, points[points.length - 1].y);
                ctxCanvas.stroke();

                // إضافة فروع للبرق
                const branches = [
                    [points[3], points[4]],
                    [points[5], points[6]]
                ];
                for (const branch of branches) {
                    ctxCanvas.shadowBlur = 20;
                    ctxCanvas.lineWidth = width * 0.4;
                    ctxCanvas.beginPath();
                    ctxCanvas.moveTo(branch[0].x, branch[0].y);
                    ctxCanvas.lineTo(branch[0].x + 50 + Math.random() * 30, branch[0].y - 40 - Math.random() * 30);
                    ctxCanvas.stroke();
                }

                ctxCanvas.restore();
            };

            // برق رئيسي (أصفر)
            drawLightning(500, 20, 500, 780, '#FFD700', 12, 0, 0);
            // برق ثانوي (أبيض مع توهج)
            drawLightning(480, 30, 520, 770, '#FFFFFF', 5, 0, 0);
            // برق جانبي أيسر
            drawLightning(400, 40, 350, 750, '#FF6B00', 8, -30, 0);
            // برق جانبي أيمن
            drawLightning(600, 40, 650, 750, '#FF6B00', 8, 30, 0);

            // ─── 5. سحابة الانفجار الكوميدي (Comic Blast) ───
            ctxCanvas.save();
            ctxCanvas.translate(size / 2, size / 2);
            
            // ظل الانفجار
            ctxCanvas.shadowColor = 'rgba(255, 200, 0, 0.5)';
            ctxCanvas.shadowBlur = 50;
            
            // الانفجار الخارجي (جولة مدببة)
            ctxCanvas.fillStyle = '#FFFFFF';
            ctxCanvas.strokeStyle = '#1A1A1A';
            ctxCanvas.lineWidth = 15;
            
            ctxCanvas.beginPath();
            const points = 20;
            const innerRadius = 180;
            const outerRadius = 250;
            
            for (let i = 0; i < points; i++) {
                const angle = (i * Math.PI * 2) / points - Math.PI / 2;
                const radius = (i % 2 === 0) ? outerRadius : innerRadius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctxCanvas.moveTo(x, y);
                else ctxCanvas.lineTo(x, y);
            }
            ctxCanvas.closePath();
            ctxCanvas.fill();
            ctxCanvas.stroke();

            // توهج داخلي للانفجار
            const innerGlow = ctxCanvas.createRadialGradient(0, 0, 50, 0, 0, innerRadius);
            innerGlow.addColorStop(0, 'rgba(255, 255, 100, 0.3)');
            innerGlow.addColorStop(1, 'rgba(255, 255, 100, 0)');
            ctxCanvas.fillStyle = innerGlow;
            ctxCanvas.beginPath();
            ctxCanvas.arc(0, 0, innerRadius, 0, Math.PI * 2);
            ctxCanvas.fill();

            ctxCanvas.restore();

            // ─── 6. كتابة النص بتأثير ثلاثي الأبعاد احترافي ───
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            const textX = size / 2;
            const textY = size / 2;

            // تحديد حجم الخط حسب طول النص
            let fontSize = 110;
            if (text.length > 8) fontSize = 90;
            if (text.length > 12) fontSize = 75;
            
            ctxCanvas.font = `italic bold ${fontSize}px "Impact", "Arial Black", sans-serif`;

            // أ) الظل الأسود المتدرج (3D Effect)
            const shadowSteps = 15;
            for (let i = shadowSteps; i > 0; i--) {
                ctxCanvas.fillStyle = `rgba(0, 0, 0, ${0.3 + (i / shadowSteps) * 0.5})`;
                ctxCanvas.fillText(text, textX + i * 1.2, textY + i * 1.2);
            }

            // ب) التدرج اللوني للنص الرئيسي (ناري متوهج)
            const textGradient = ctxCanvas.createLinearGradient(textX, textY - 60, textX, textY + 60);
            textGradient.addColorStop(0, '#FFF8E1');   // أبيض مصفر
            textGradient.addColorStop(0.2, '#FFD700'); // ذهبي
            textGradient.addColorStop(0.5, '#FF6B00'); // برتقالي
            textGradient.addColorStop(0.8, '#FF1744'); // أحمر ناري
            textGradient.addColorStop(1, '#D50000');   // أحمر غامق

            ctxCanvas.shadowColor = 'rgba(255, 200, 0, 0.3)';
            ctxCanvas.shadowBlur = 20;
            ctxCanvas.fillStyle = textGradient;
            ctxCanvas.fillText(text, textX, textY);

            // ج) الحواف الخارجية السوداء (Stroke) لتبدو كملصقات الكوميكس
            ctxCanvas.shadowBlur = 0;
            ctxCanvas.strokeStyle = '#1A1A1A';
            ctxCanvas.lineWidth = 6;
            ctxCanvas.strokeText(text, textX, textY);

            // د) حواف داخلية بيضاء لإضفاء اللمعان
            ctxCanvas.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctxCanvas.lineWidth = 2;
            ctxCanvas.strokeText(text, textX - 1, textY - 1);

            // ─── 7. نقط بيضاء صغيرة (تأثير النجوم) ───
            for (let i = 0; i < 80; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const radius = Math.random() * 3 + 1;
                const alpha = Math.random() * 0.5 + 0.2;
                ctxCanvas.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctxCanvas.beginPath();
                ctxCanvas.arc(x, y, radius, 0, Math.PI * 2);
                ctxCanvas.fill();
            }

            // ─── 8. إطار خارجي بزوايا كوميكس ───
            ctxCanvas.strokeStyle = '#1A1A1A';
            ctxCanvas.lineWidth = 8;
            ctxCanvas.strokeRect(20, 20, size - 40, size - 40);

            // زوايا مدببة في الإطار
            const cornerSize = 40;
            const corners = [
                [20, 20],
                [size - 20, 20],
                [20, size - 20],
                [size - 20, size - 20]
            ];
            for (const [cx, cy] of corners) {
                ctxCanvas.fillStyle = '#FFD700';
                ctxCanvas.shadowColor = 'rgba(255, 200, 0, 0.5)';
                ctxCanvas.shadowBlur = 15;
                ctxCanvas.beginPath();
                ctxCanvas.arc(cx, cy, cornerSize / 2, 0, Math.PI * 2);
                ctxCanvas.fill();
                ctxCanvas.shadowBlur = 0;
                ctxCanvas.strokeStyle = '#1A1A1A';
                ctxCanvas.lineWidth = 3;
                ctxCanvas.stroke();
            }

            // ─── تحويل الكانفاس إلى Buffer وإرسالها ───
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });

            await sock.sendMessage(chatJid, { 
                image: buffer, 
                caption: `⚡ *لوجو كوميكس احترافي*\n` +
                         `┊👤 الاسم: \`${text}\`\n` +
                         `┊⚡ نوع: تصميم كوميكس\n` +
                         `┊🖌️ التقنية: Canvas 3D\n` +
                         `*❐═━━━═╊⊰🐉⊱╉═━━━═❐*` +
                         `\n> ${ctx.cfg?.botRights || '𝙱𝙰┇𝚂𝚄𝙽𝙶 𝙱𝙾𝚃'}`
            }, { quoted: m });

        } catch (error) {
            console.error('Canvas execution error:', error);
            await sock.sendMessage(chatJid, { 
                text: '❌ حدث خطأ أثناء معالجة الكانفاس. تأكد من تثبيت حزمة canvas في السيرفر.' 
            }, { quoted: m });
        }
    }
};
