import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم4',
    aliases: ['comic2', 'كوميكس2', 'انفجار'],
    description: 'توليد لوجو كوميكس خارق وعالي الدقة برمجياً بالكامل عبر Rust Canvas',
    category: 'ق15',
    usage: '.تصميم4 [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid; // الطريقة الأكثر أماناً لجلب الـ Jid في Baileys
        const text = args.join(' ').toUpperCase();

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الاسم الذي تريد تصميمه على لوجو الكوميكس.\nمثال: `.تصميم4 AYOUB`' 
            });
        }

        if (text.length > 10) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 10 أحرف للحفاظ على أبعاد الانفجار.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '⏳ جاري رندرة وتوليد لوجو الكوميكس بدقة 2K عبر محرك Rust...' });

            const size = 2000;
            const canvas = createCanvas(size, size);
            const ctxCanvas = canvas.getContext('2d');
            const cx = size / 2;
            const cy = size / 2;

            // الخلفية المنقسمة
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy);
            const totalBeams = 36;
            const angleStep = (Math.PI * 2) / totalBeams;

            for (let i = 0; i < totalBeams; i++) {
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(0, 0);
                ctxCanvas.arc(0, 0, size * 1.5, i * angleStep, (i + 1) * angleStep);
                ctxCanvas.lineTo(0, 0);
                
                const currentAngle = i * (360 / totalBeams);
                if (currentAngle > 90 && currentAngle <= 270) {
                    ctxCanvas.fillStyle = (i % 2 === 0) ? '#D32F2F' : '#991B1B'; 
                } else {
                    ctxCanvas.fillStyle = (i % 2 === 0) ? '#7B1FA2' : '#4A148C'; 
                }
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // نقاط الكوميكس (Halftone)
            ctxCanvas.save();
            ctxCanvas.fillStyle = 'rgba(0, 0, 0, 0.12)';
            const dotSpacing = 30;
            for (let x = 0; x < size; x += dotSpacing) {
                for (let y = 0; y < size; y += dotSpacing) {
                    ctxCanvas.beginPath();
                    ctxCanvas.arc(x, y, 4, 0, Math.PI * 2);
                    ctxCanvas.fill();
                }
            }
            ctxCanvas.restore();

            // خطوط الحركة
            ctxCanvas.save();
            ctxCanvas.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctxCanvas.lineWidth = 4;
            for (let i = 0; i < 40; i++) {
                const angle = Math.random() * Math.PI * 2;
                const startDist = size * 0.25 + Math.random() * 200;
                const endDist = size * 0.45 + Math.random() * 300;
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(cx + Math.cos(angle) * startDist, cy + Math.sin(angle) * startDist);
                ctxCanvas.lineTo(cx + Math.cos(angle) * endDist, cy + Math.sin(angle) * endDist);
                ctxCanvas.stroke();
            }
            ctxCanvas.restore();

            // صاعقة البرق المركزية
            ctxCanvas.save();
            ctxCanvas.fillStyle = '#FFEA00';
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 12;
            ctxCanvas.shadowColor = 'rgba(255, 234, 0, 0.5)';
            ctxCanvas.shadowBlur = 40;

            ctxCanvas.beginPath();
            ctxCanvas.moveTo(cx + 50, cy - 600);
            ctxCanvas.lineTo(cx + 150, cy - 100);
            ctxCanvas.lineTo(cx, cy - 100);
            ctxCanvas.lineTo(cx + 120, cy + 400);
            ctxCanvas.lineTo(cx - 100, cy + 400);
            ctxCanvas.lineTo(cx - 30, cy + 650);
            ctxCanvas.lineTo(cx - 150, cy + 150);
            ctxCanvas.lineTo(cx - 20, cy + 150);
            ctxCanvas.lineTo(cx - 120, cy - 250);
            ctxCanvas.lineTo(cx, cy - 250);
            ctxCanvas.closePath();
            ctxCanvas.fill();
            ctxCanvas.stroke();
            ctxCanvas.restore();

            // سحابة الانفجار
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy);
            ctxCanvas.fillStyle = '#FFFFFF';
            ctxCanvas.strokeStyle = '#111111';
            ctxCanvas.lineWidth = 24;

            ctxCanvas.beginPath();
            const cloudPoints = 20;
            for (let i = 0; i < cloudPoints; i++) {
                const angle = (i * Math.PI * 2) / cloudPoints;
                const radius = (i % 2 === 0) ? 520 : 380;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctxCanvas.moveTo(x, y);
                else ctxCanvas.lineTo(x, y);
            }
            ctxCanvas.closePath();
            ctxCanvas.stroke();
            ctxCanvas.fill();
            ctxCanvas.restore();

            // رسم النجوم
            const drawComicStar = (sx, sy, spikes, outerRadius, innerRadius) => {
                let rot = Math.PI / 2 * 3;
                let x = sx;
                let y = sy;
                let step = Math.PI / spikes;

                ctxCanvas.beginPath();
                ctxCanvas.moveTo(sx, sy - outerRadius);
                for (let i = 0; i < spikes; i++) {
                    x = sx + Math.cos(rot) * outerRadius;
                    y = sy + Math.sin(rot) * outerRadius;
                    ctxCanvas.lineTo(x, y);
                    rot += step;
                    x = sx + Math.cos(rot) * innerRadius;
                    y = sy + Math.sin(rot) * innerRadius;
                    ctxCanvas.lineTo(x, y);
                    rot += step;
                }
                ctxCanvas.lineTo(sx, sy - outerRadius);
                ctxCanvas.closePath();
                ctxCanvas.fillStyle = '#FFEA00';
                ctxCanvas.strokeStyle = '#000000';
                ctxCanvas.lineWidth = 6;
                ctxCanvas.stroke();
                ctxCanvas.fill();
            };
            drawComicStar(cx - 450, cy - 450, 5, 50, 22);
            drawComicStar(cx + 500, cy - 400, 5, 45, 20);
            drawComicStar(cx - 550, cy + 350, 5, 60, 25);
            drawComicStar(cx + 450, cy + 450, 5, 40, 18);

            // النص ثلاثي الأبعاد والظلال
            ctxCanvas.font = 'italic bold 230px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            ctxCanvas.fillStyle = '#000000';
            const depthSteps = 28;
            for (let i = depthSteps; i > 0; i--) {
                ctxCanvas.fillText(text, cx + i, cy + i);
            }

            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#9C27B0';
            ctxCanvas.lineWidth = 45;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#E040FB';
            ctxCanvas.shadowBlur = 50;
            ctxCanvas.strokeText(text, cx, cy);
            ctxCanvas.restore();

            ctxCanvas.strokeStyle = '#111111';
            ctxCanvas.lineWidth = 25;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.strokeText(text, cx, cy);

            const textGradient = ctxCanvas.createLinearGradient(cx, cy - 120, cx, cy + 120);
            textGradient.addColorStop(0, '#FFEB3B');
            textGradient.addColorStop(0.4, '#FF9800');
            textGradient.addColorStop(1, '#F4511E');

            ctxCanvas.fillStyle = textGradient;
            ctxCanvas.fillText(text, cx, cy);

            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `💥 *تم توليد لوجو الكوميكس الخارق 2K بنجاح!*`
            });

        } catch (error) {
            console.error('❌ Error in design4:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء رندرة الكوميكس.' });
        }
    }
};
