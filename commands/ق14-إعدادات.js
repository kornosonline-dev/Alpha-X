import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'اعدادات',
    aliases: ['zarf_settings'],
    description: 'تفعيل أو تعطيل مزايا الزرف (الاسم، الوصف، النص، الصورة، الصوت)',
    category: 'ق14',
    group: false,
    admin: true,
    elite: true,
    owner: true,

    async execute(sock, m, args, ctx) {
        const chatJid = m.key.remoteJid;

        // تحديد المسار الصحيح لملف ZARF.js
        const zarfPath = path.resolve(__dirname, '../src/zarf/ZARF.js');

        // التحقق من وجود الملف
        if (!fs.existsSync(zarfPath)) {
            return await sock.sendMessage(chatJid, {
                text: '❌ ملف ZARF.js غير موجود في المسار: src/zarf/ZARF.js'
            }, { quoted: m });
        }

        // قراءة الملف الحالي
        let fileContent = fs.readFileSync(zarfPath, 'utf8');
        let zarfConfig;

        // محاولة استخراج الكائن من الملف
        try {
            const match = fileContent.match(/export\s+default\s+({[\s\S]*?});/);
            if (!match) {
                throw new Error('لم يتم العثور على export default');
            }
            zarfConfig = eval('(' + match[1] + ')');
        } catch (e) {
            console.error('❌ خطأ في قراءة ملف ZARF.js:', e);
            return await sock.sendMessage(chatJid, {
                text: '❌ فشل قراءة ملف ZARF.js، تأكد من صياغته.'
            }, { quoted: m });
        }

        // خريطة الخصائص
        const features = {
            'الاسم': { path: 'zarf.newSubject', key: 'enabled' },
            'الوصف': { path: 'zarf.newDescription', key: 'enabled' },
            'النص': { path: 'zarf.text', key: 'enabled' },
            'الصورة': { path: 'zarf.imagine', key: 'enabled' },
            'الصوت': { path: 'zarf.music', key: 'enabled' }
        };

        // الحصول على الوسيطات
        const featureName = args[0]?.toLowerCase() || '';
        const action = args[1]?.toLowerCase() || '';

        const enableWords = ['on', 'تفعيل', 'تشغيل'];
        const disableWords = ['off', 'تعطيل', 'ايقاف'];

        // عرض القائمة إذا لم يتم تحديد خاصية
        if (!featureName || !features[featureName]) {
            let statusText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐂𝐎𝐍𝐅𝐈𝐆~ 〕⌬ ╄╾ ━\n\n`;
            statusText += `> *✧────[ إعدادات الزرف ]────╮*\n`;
            for (const [name, info] of Object.entries(features)) {
                const parts = info.path.split('.');
                let current = zarfConfig;
                for (const part of parts) {
                    current = current?.[part];
                }
                const status = current?.[info.key] ? '🟢' : '🔴';
                statusText += `> *┤ ${status} ${name}*\n`;
            }
            statusText += `> *┤────────────···*\n`;
            statusText += `> *💡 استخدم: .اعدادات [الخاصية] [on/off]*\n`;
            statusText += `> *💡 مثال: .اعدادات الاسم on*\n`;
            statusText += `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;
            return await sock.sendMessage(chatJid, { text: statusText }, { quoted: m });
        }

        // تحديد الخاصية المطلوبة
        const featureInfo = features[featureName];
        const parts = featureInfo.path.split('.');

        // الوصول إلى الكائن الصحيح (مثل zarf.imagine)
        let target = zarfConfig;
        for (const part of parts) {
            if (!target[part]) {
                target[part] = {};
            }
            target = target[part];
        }
        // الآن target هو الكائن الداخلي (مثل imagine أو newSubject)
        // نعدل الخاصية 'enabled' داخله
        const currentValue = target[featureInfo.key];

        // إذا لم يُحدد إجراء، نعرض حالة هذه الخاصية فقط
        if (!action || !enableWords.concat(disableWords).includes(action)) {
            const status = currentValue ? 'نشط 🟢' : 'متوقف 🔴';
            return await sock.sendMessage(chatJid, {
                text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐂𝐎𝐍𝐅𝐈𝐆~ 〕⌬ ╄╾ ━\n\n` +
                      `> *┤ الخاصية: ${featureName}*\n` +
                      `> *┤ الحالة: ${status}*\n` +
                      `> *┤────────────···*\n` +
                      `> *💡 استخدم: .اعدادات ${featureName} on/off*\n` +
                      `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
            }, { quoted: m });
        }

        // تحديد القيمة الجديدة
        const isEnable = enableWords.includes(action);

        // تعديل القيمة في الكائن الصحيح
        target[featureInfo.key] = isEnable;

        // تحويل الكائن إلى نص JavaScript مع الاحتفاظ بالتنسيق
        const newContent = `export default ${JSON.stringify(zarfConfig, null, 2)};`;

        // كتابة الملف
        try {
            fs.writeFileSync(zarfPath, newContent, 'utf8');
        } catch (e) {
            console.error('❌ خطأ في كتابة ملف ZARF.js:', e);
            return await sock.sendMessage(chatJid, {
                text: '❌ فشل حفظ التغييرات، تأكد من صلاحيات الكتابة.'
            }, { quoted: m });
        }

        // إرسال رسالة النجاح
        const statusEmoji = isEnable ? '✅' : '❌';
        const statusWord = isEnable ? 'تفعيل' : 'تعطيل';

        await sock.sendMessage(chatJid, {
            text: `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐂𝐎𝐍𝐅𝐈𝐆~ 〕⌬ ╄╾ ━\n\n` +
                  `> *┤ ${statusEmoji} تم ${statusWord} خاصية "${featureName}" بنجاح*\n` +
                  `> *┤ الحالة الآن: ${isEnable ? 'نشط 🟢' : 'متوقف 🔴'}*\n` +
                  `> *┤────────────···*\n` +
                  `> *⚠️ قد تحتاج إلى إعادة تشغيل البوت لتطبيق التغييرات على الأوامر الجديدة.*\n` +
                  `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`
        }, { quoted: m });
    }
};