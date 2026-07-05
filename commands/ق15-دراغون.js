import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم2',
    aliases: ['dragon', 'دراغون', 'تنين'],
    description: 'تصميم تنين دراغون بول احترافي متطابق مع المظهر الحقيقي',
    category: 'ق15',
    usage: '.تصميم2 [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.chat || m.key.remoteJid;
        const text = args.join(' ').toUpperCase();

        if (!text) {
            return await sock.sendMessage(chatJid, {
                text: '❌ يرجى كتابة النص الذي تريد وضعه.\nمثال: `.تصميم2 AYOUB`'
            }, { quoted: m });
        }

        if (text.length > 12) {
            return await sock.sendMessage(chatJid, {
                text: '❌ النص طويل جداً! الحد الأقصى هو 12 حرفاً لضمان دائرية التصميم.'
            }, { quoted: m });
        }

        try {
            // أبعاد الصورة المربعة المطابقة للصورة المطلوبة (1000x1000)
            const size = 1000;
            const canvas = createCanvas(size, size);
            const ctxCanvas = canvas.getContext('2d');

            // ─── 1. رسم خلفية السماء الصافية والغيوم الاحترافية ───
            const skyGradient = ctxCanvas.createLinearGradient(0, 0, 0, size);
            skyGradient.addColorStop(0, '#0099DE'); 
            skyGradient.addColorStop(0.6, '#52C2F3');
            skyGradient.addColorStop(1, '#FFFFFF');
            ctxCanvas.fillStyle = skyGradient;
            ctxCanvas.fillRect(0, 0, size, size);

            // رسم تأثير الغيوم الممتدة أسفل الصورة
            ctxCanvas.fillStyle = 'rgba(255, 255, 255, 0.85)';
            for (let i = 0; i < 6; i++) {
                ctxCanvas.beginPath();
                ctxCanvas.arc(i * 200, size - 50, 160, 0, Math.PI * 2);
                ctxCanvas.fill();
            }

            // ─── 2. رسم التنين شينرون الأصلي (Shenron) هندسياً بدقة أعلى ───
            // مركز التنين
            const cx = size / 2;
            const cy = size / 2 - 50;

            ctxCanvas.save();
            // رسم الحلقات الدائرية المتداخلة للتنين الأخضر (حلقات لولبية)
            ctxCanvas.lineWidth = 45;
            ctxCanvas.strokeStyle = '#23733A'; // الأخضر الأساسي لجسم التنين
            
            ctxCanvas.beginPath();
            ctxCanvas.arc(cx, cy, 260, 0, Math.PI * 1.8);
            ctxCanvas.stroke();

            ctxCanvas.beginPath();
            ctxCanvas.arc(cx, cy, 180, Math.PI * 0.2, Math.PI * 2);
            ctxCanvas.stroke();

            // رسم الحواف البطنية الصفراء للتنين (تطابق دراغون بول)
            ctxCanvas.lineWidth = 15;
            ctxCanvas.strokeStyle = '#FFF3A1';
            ctxCanvas.beginPath();
            ctxCanvas.arc(cx, cy, 235, 0, Math.PI * 1.75);
            ctxCanvas.stroke();
            ctxCanvas.restore();

            // رسم رأس التنين والقرون في المنتصف تماماً
            ctxCanvas.save();
            ctxCanvas.translate(cx, cy - 60);
            
            // الفك والوجه
            ctxCanvas.fillStyle = '#23733A';
            ctxCanvas.strokeStyle = '#123D1E';
            ctxCanvas.lineWidth = 5;
            ctxCanvas.beginPath();
            ctxCanvas.ellipse(0, 0, 50, 70, 0, 0, Math.PI * 2);
            ctxCanvas.fill();
            ctxCanvas.stroke();

            // الفم المفتوح باللون الأحمر الداكن
            ctxCanvas.fillStyle = '#C62828';
            ctxCanvas.beginPath();
            ctxCanvas.ellipse(0, 30, 25, 35, 0, 0, Math.PI * 2);
            ctxCanvas.fill();

            // أعين التنين الحمراء المضيئة
            ctxCanvas.fillStyle = '#FF0000';
            ctxCanvas.beginPath();
            ctxCanvas.arc(-20, -15, 8, 0, Math.PI * 2);
            ctxCanvas.arc(20, -15, 8, 0, Math.PI * 2);
            ctxCanvas.fill();

            // قرون دراغون بول البنية الطويلة (Antlers)
            ctxCanvas.fillStyle = '#C6A15A';
            ctxCanvas.lineWidth = 8;
            ctxCanvas.strokeStyle = '#5D4037';
            // قرن أيسر
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(-15, -50);
            ctxCanvas.lineTo(-50, -140);
            ctxCanvas.lineTo(-30, -140);
            ctxCanvas.closePath();
            ctxCanvas.fill(); ctxCanvas.stroke();
            // قرن أيمن
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(15, -50);
            ctxCanvas.lineTo(50, -140);
            ctxCanvas.lineTo(30, -140);
            ctxCanvas.closePath();
            ctxCanvas.fill(); ctxCanvas.stroke();

            // الشوارب الأسطورية الطويلة الممتدة على الجانبين
            ctxCanvas.strokeStyle = '#FFF3A1';
            ctxCanvas.lineWidth = 5;
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(-10, 10);
            ctxCanvas.bezierCurveTo(-120, 20, -180, -40, -250, 20);
            ctxCanvas.moveTo(10, 10);
            ctxCanvas.bezierCurveTo(120, 20, 180, -40, 250, 20);
            ctxCanvas.stroke();

            ctxCanvas.restore();

            // ─── 3. تأثير النص الدائري المنحني مع النجمة في المنتصف ───
            ctxCanvas.save();
            ctxCanvas.font = 'bold italic 130px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';

            const textY = cy + 220;

            // أ) الظل السميك ثلاثي الأبعاد باللون الأسود للحروف لتبدو بارزة جداً
            ctxCanvas.fillStyle = '#000000';
            const shadowDepth = 15;
            for (let i = shadowDepth; i > 0; i--) {
                ctxCanvas.fillText(text, cx + i, textY + i);
            }

            // ب) التدرج البرتقالي الناري الأصلي لشعار دراغون بول (Orange/Red Gradient)
            const textGradient = ctxCanvas.createLinearGradient(cx, textY - 80, cx, textY + 40);
            textGradient.addColorStop(0, '#FF8F00'); // برتقالي فاتح أعلى
            textGradient.addColorStop(1, '#E64A19'); // أحمر ناري أسفل
            
            ctxCanvas.fillStyle = textGradient;
            ctxCanvas.strokeStyle = '#000000';
            ctxCanvas.lineWidth = 14; // حدود سوداء سميكة للحروف
            
            ctxCanvas.strokeText(text, cx, textY);
            ctxCanvas.fillText(text, cx, textY);

            // ج) إضافة نجمة دراغون بول السوداء داخل الحرف الأوسط إذا كان هناك مساحة (تطابق اللوجو الأصلي)
            if (text.includes('O') || text.includes('U')) {
                ctxCanvas.fillStyle = '#000000';
                ctxCanvas.font = 'normal 45px sans-serif';
                ctxCanvas.fillText('★', cx + 15, textY - 5);
            }

            ctxCanvas.restore();

            // ─── 4. تحويل إلى كود بافر وإرساله ───
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });

            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `🐉 *تم تحديث التصميم بالكامل ليطابق مظهر دراغون بول الأصلي بنجاح!* 🐉`
            }, { quoted: m });

        } catch (error) {
            console.error('❌ تصميم2 الحقيقي error:', error);
            await sock.sendMessage(chatJid, {
                text: '❌ حدث خطأ داخلي أثناء رندرة أبعاد التنين شينرون.'
            }, { quoted: m });
        }
    }
};