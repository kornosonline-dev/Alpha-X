import { createCanvas } from '@napi-rs/canvas';

export default {
    name: 'تصميم8',
    aliases: ['fire', 'مشتعل', 'تأثير7'],
    description: 'توليد نص ناري احترافي مشتعل برمجياً بالكامل مع جزيئات الرماد والحرارة',
    category: 'ق15',
    usage: '.نار [النص]',
    cooldown: 5,

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const text = args.join(' ').toUpperCase(); // الحروف الكبيرة تعطي مساحة أكبر لتوزيع اللهب

        if (!text) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ يرجى كتابة النص الذي تريد إشعاله.\nمثال: `.نار FIRE KING`' 
            });
        }

        if (text.length > 10) {
            return await sock.sendMessage(chatJid, { 
                text: '❌ الاسم طويل جداً! الحد الأقصى هو 10 أحرف للحفاظ على كثافة ألسنة اللهب.' 
            });
        }

        try {
            await sock.sendMessage(chatJid, { text: '🔥 جاري إشعال الحروف ورندرة تأثير اللهب والرماد...' });

            // أبعاد ممتازة ومتناسقة للتأثير (1200x800 بكسل)
            const width = 1200;
            const height = 800;
            const canvas = createCanvas(width, height);
            const ctxCanvas = canvas.getContext('2d');
            
            const cx = width / 2;
            const cy = height / 2 + 50; // خفض المركز قليلاً لترك مساحة للهب المتصاعد لأعلى

            // 1. خلفية داكنة جداً مع تدرج حراري خافت في السنتر (Dark Volcanic Background)
            const bgGrad = ctxCanvas.createRadialGradient(cx, cy, 50, cx, cy, width * 0.6);
            bgGrad.addColorStop(0, '#150500'); // توهج بركاني خافت في السنتر خلف النص
            bgGrad.addColorStop(1, '#020100'); // أسود فاحم في الأطراف
            ctxCanvas.fillStyle = bgGrad;
            ctxCanvas.fillRect(0, 0, width, height);

            // 2. إعدادات خط احترافي ضخم وسميك ليتحمل تأثير الاحتراق
            ctxCanvas.font = 'bold italic 140px "Impact", "Arial Black", sans-serif';
            ctxCanvas.textAlign = 'center';
            ctxCanvas.textBaseline = 'middle';

            // حساب أبعاد النص تقريبياً لتوليد ألسنة اللهب والدخان من مكان الحروف بالظبط
            const textWidth = ctxCanvas.measureText(text).width;
            const startX = cx - textWidth / 2;

            // 3. رندرة الدخان المتصاعد (Procedural Heat Smoke)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            for (let i = 0; i < 20; i++) {
                const sx = startX + (Math.random() * textWidth);
                const sy = cy - (Math.random() * 120);
                const sRadius = Math.random() * 100 + 50;
                
                const smokeGrad = ctxCanvas.createRadialGradient(sx, sy, 5, sx, sy, sRadius);
                smokeGrad.addColorStop(0, 'rgba(40, 30, 25, 0.2)'); // دخان برتقالي رمادي داكن
                smokeGrad.addColorStop(0.5, 'rgba(15, 10, 10, 0.08)');
                smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctxCanvas.fillStyle = smokeGrad;
                ctxCanvas.beginPath();
                ctxCanvas.arc(sx, sy, sRadius, 0, Math.PI * 2);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 4. رندرة ألسنة اللهب المتصاعدة (Procedural Animated Flames)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            
            // نولد حوالي 80 لسان لهب عشوائي ينطلق من جسم الحروف لأعلى
            for (let i = 0; i < 80; i++) {
                const fx = startX + (Math.random() * textWidth);
                const fy = cy + 20 - (Math.random() * 40); // قاعدة اللهب عند الحروف
                const flameHeight = Math.random() * 160 + 60; // طول لسان اللهب
                const flameWidth = Math.random() * 40 + 20;   // عرض القاعدة
                
                // تدرج لوني ناري حقيقي من الأبيض الساطع في السنتر إلى الأحمر في الأطراف
                const fireGrad = ctxCanvas.createLinearGradient(fx, fy, fx, fy - flameHeight);
                fireGrad.addColorStop(0, '#FFFFFF'); // قلب اللهب شديد الحرارة
                fireGrad.addColorStop(0.2, '#FFD54F'); // أصفر
                fireGrad.addColorStop(0.5, '#FF8F00'); // برتقالي
                fireGrad.addColorStop(0.8, '#E64A19'); // أحمر ناري
                fireGrad.addColorStop(1, 'rgba(0,0,0,0)'); // يختفي في الأعلى

                ctxCanvas.fillStyle = fireGrad;
                
                // رسم مسار لسان اللهب بشكل متعرج وحاد هندسياً (Bezier Curves)
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(fx - flameWidth / 2, fy);
                ctxCanvas.quadraticCurveTo(fx - flameWidth * 0.8, fy - flameHeight * 0.5, fx, fy - flameHeight);
                ctxCanvas.quadraticCurveTo(fx + flameWidth * 0.8, fy - flameHeight * 0.5, fx + flameWidth / 2, fy);
                ctxCanvas.closePath();
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 5. طبقات النص المشتعل والظلال التوهجية (Red Glow & Multiple Shadows)
            // أ) التوهج الخارجي الأحمر الضخم (Outer Heat Radiation)
            ctxCanvas.save();
            ctxCanvas.strokeStyle = '#D84315';
            ctxCanvas.lineWidth = 20;
            ctxCanvas.lineJoin = 'round';
            ctxCanvas.shadowColor = '#FF3D00';
            ctxCanvas.shadowBlur = 45;
            ctxCanvas.strokeText(text, cx, cy);
            ctxCanvas.restore();

            // ب) تأثير الحواف المحترقة المتفحمة (Burning Edges)
            ctxCanvas.strokeStyle = '#110500'; // حافة سوداء متفحمة تفصل الواجهة
            ctxCanvas.lineWidth = 8;
            ctxCanvas.strokeText(text, cx, cy);

            // ج) تدرج واجهة النص الرئيسي (High Quality Orange/Red Gradient)
            const textGrad = ctxCanvas.createLinearGradient(cx, cy - 60, cx, cy + 60);
            textGrad.addColorStop(0, '#FFEB3B'); // لمعان أصفر شديد في الأعلى من أثر الحرارة
            textGrad.addColorStop(0.4, '#FF9800'); // برتقالي متوسط
            textGrad.addColorStop(0.8, '#D84315'); // أحمر داكن
            textGrad.addColorStop(1, '#210400'); // أسود متفحم تماماً في قاع الحروف

            ctxCanvas.fillStyle = textGrad;
            ctxCanvas.fillText(text, cx, cy);

            // 6. رندرة جزيئات الرماد والشرر المتطاير (Ash Particles & Fire Sparks)
            ctxCanvas.save();
            ctxCanvas.globalCompositeOperation = 'screen';
            for (let i = 0; i < 60; i++) {
                const ax = startX - 50 + (Math.random() * (textWidth + 100));
                // الجزيئات تتطاير لأعلى من منطقة الحروف وتخف كلما ارتفعت
                const ay = cy + 50 - (Math.random() * 350); 
                const aSize = Math.random() * 4 + 1;

                // تنويع الألوان بين شرارات مضيئة (أصفر/برتقالي) ورماد متفحم خافت
                ctxCanvas.fillStyle = Math.random() > 0.3 ? '#FFB300' : '#FF3D00';
                ctxCanvas.shadowColor = ctxCanvas.fillStyle;
                ctxCanvas.shadowBlur = Math.random() * 10 + 2;

                ctxCanvas.beginPath();
                // رسم جزيئات الرماد غير منتظمة الشكل عن طريق إمالتها قليلاً
                ctxCanvas.arc(ax, ay, aSize, 0, Math.PI * 2);
                ctxCanvas.fill();
            }
            ctxCanvas.restore();

            // 7. تحويل لوحة الكانفاس إلى بافر جودة عالية وإرسالها مباشرة
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            await sock.sendMessage(chatJid, {
                image: buffer,
                caption: `🔥 *تم إشعال الاسم وتوليد لوجو اللهب الواقعي بنجاح!* 🔥\n✨ *التقنية:* \`Procedural Heat & Fire Sparks Engine\``
            });

        } catch (error) {
            console.error('❌ Error in fire text plugin:', error);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ داخلي أثناء معالجة رندرة وتوليد تأثير النار.' });
        }
    }
};
