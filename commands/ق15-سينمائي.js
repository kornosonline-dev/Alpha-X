import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم5',
    aliases: ['marvel', 'مارفل', 'سينمائي'],
    description: 'توليد لوجو مارفل سينمائي ثلاثي الأبعاد برمجياً بالكامل ومتوافق مع الاستضافات',
    category: 'ق15',
    usage: '.تصميم5 [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' ').toUpperCase();

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة الاسم الذي تريد تصميمه بستايل مارفل.\nمثال: `.تصميم5 SUNG`' 
            });
        }

        if (text.length > 8) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 8 أحرف لضمان ضخامة وحجم الخط.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '⏳ جاري معالجة ورندرة لوجو Marvel السينمائي باحترافية...' });

            // أبعاد ممتازة ومستقرة جداً للاستضافة
            const width = 1920;
            const height = 1080;
            const canvas = createCanvas(width, height);
            const ctxCanvas = canvas.getContext('2d');
            
            const cx = width / 2;
            const cy = height / 2;

            // الخلفية المعدنية الحمراء
            const bgGrad = ctxCanvas.createRadialGradient(cx, cy, 100, cx, cy, width * 0.6);
            bgGrad.addColorStop(0, '#A30000');
            bgGrad.addColorStop(0.5, '#4A0000');
            bgGrad.addColorStop(1, '#120000');
            ctxCanvas.fillStyle = bgGrad;
            ctxCanvas.fillRect(0, 0, width, height);

            // تأثير المعدن المصقول
            ctxCanvas.save();
            ctxCanvas.globalAlpha = 0.04;
            ctxCanvas.strokeStyle = '#FFFFFF';
            ctxCanvas.lineWidth = 1;
            for (let i = 0; i < width; i += 4) {
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(i, 0);
                ctxCanvas.lineTo(i + (Math.random() * 10 - 5), height);
                ctxCanvas.stroke();
            }
            ctxCanvas.restore();

            // حساب حجم الخط ديناميكياً
            const baseFontSize = Math.min(180, (width * 0.85) / (text.length * 0.65));
            ctxCanvas.font = `italic bold ${baseFontSize}px "Impact", "Arial Black", sans-serif`;
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';
            const textY = cy;

            // بناء العمق ثلاثي الأبعاد السميك (تم إصلاح اسم المتغير هنا تماماً)
            const shadowDepth = 30; 
            for (let i = shadowDepth; i > 0; i--) {
                ctxCanvas.fillStyle = i === 1 ? '#1A1A1A' : `rgb(${25 + i * 2}, ${20 + i}, 25)`;
                ctxCanvas.fillText(text, cx - i, textY + i);
            }

            // الحواف الذهبية (Bevel)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = ctxCanvas.createLinearGradient(cx, textY - 80, cx, textY + 80);
            ctxCanvas.strokeStyle.addColorStop(0, '#FFE082');
            ctxCanvas.strokeStyle.addColorStop(0.5, '#FFB300');
            ctxCanvas.strokeStyle.addColorStop(1, '#8D6E63');
            ctxCanvas.lineWidth = 8;
            ctxCanvas.lineJoin = 'miter';
            ctxCanvas.strokeText(text, cx, textY);
            ctxCanvas.restore();

            // الواجهة والانعكاسات الزجاجية (Gloss & Reflection)
            const frontGradient = ctxCanvas.createLinearGradient(cx, textY - baseFontSize/2, cx, textY + baseFontSize/2);
            frontGradient.addColorStop(0, '#FFFFFF');
            frontGradient.addColorStop(0.15, '#E53935');
            frontGradient.addColorStop(0.48, '#B71C1C');
            frontGradient.addColorStop(0.52, '#FF5252');
            frontGradient.addColorStop(0.85, '#7F0000');
            frontGradient.addColorStop(1, '#330000');

            ctxCanvas.fillStyle = frontGradient;
            ctxCanvas.fillText(text, cx, textY);

            // الـ Lens Flare الضوئي السينمائي
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            const flareX = cx - (text.length * baseFontSize * 0.22);
            const flareY = textY - (baseFontSize * 0.35);

            const flareGlow = ctxCanvas.createRadialGradient(flareX, flareY, 0, flareX, flareY, 200);
            flareGlow.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            flareGlow.addColorStop(0.1, 'rgba(255, 215, 0, 0.8)');
            flareGlow.addColorStop(0.4, 'rgba(229, 57, 53, 0.3)');
            flareGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctxCanvas.fillStyle = flareGlow;
            ctxCanvas.beginPath();
            ctxCanvas.arc(flareX, flareY, 200, 0, Math.PI * 2);
            ctxCanvas.fill();

            ctxCanvas.strokeStyle = 'rgba(255, 236, 179, 0.3)';
            ctxCanvas.lineWidth = 3;
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(flareX - 600, flareY - 150);
            ctxCanvas.lineTo(flareX + 1100, flareY + 275);
            ctxCanvas.stroke();

            ctxCanvas.restore();

            // الإطار الخارجي السينمائي
            ctxCanvas.strokeStyle = 'rgba(255, 215, 0, 0.15)';
            ctxCanvas.lineWidth = 4;
            ctxCanvas.strokeRect(30, 30, width - 60, height - 60);

            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `🎬 *تم توليد لوجو MARVEL السينمائي بنجاح!* 🎬`
            });

        } catch (error) {
            console.error('❌ Error in design5:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة التصميم.' });
        }
    }
};
