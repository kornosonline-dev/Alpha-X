import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'السرعة',
    aliases: ['حالة', 'speed', 'ping', 'بانغ'],
    description: 'قياس سرعة البوت وزمن الاستجابة للخوادم',
    category: 'info',
    group: false,      // يعمل في الخاص والمجموعات

    async execute(sock, m, args, ctx) {
        const chatJid = m.key.remoteJid;
        const startTime = Date.now();

        // 1. إرسال رسالة تفاعلية
        await sock.sendMessage(chatJid, { react: { text: '⏳', key: m.key } });

        // 2. تشغيل سكربت Python لقياس البنج
        const scriptPath = path.resolve(__dirname, '../speed.py');
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

        // أولاً نقيس ping المحلي (زمن استجابة البوت نفسه)
        // عن طريق إرسال رسالة وانتظارها (سيتم حسابه لاحقاً)
        
        let pingData = null;
        try {
            const { stdout } = await new Promise((resolve, reject) => {
                exec(`${pythonCmd} ${scriptPath}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(stderr || error.message));
                        return;
                    }
                    resolve({ stdout });
                });
            });

            pingData = JSON.parse(stdout);
        } catch (err) {
            console.error('❌ خطأ في تشغيل speed.py:', err.message);
            // نعرض رسالة خطأ لكن نكمل بعرض معلومات جزئية
        }

        // 3. حساب زمن استجابة البوت المحلي (WhatsApp Ping)
        const botPing = Date.now() - startTime;

        // 4. تحضير النص
        let resultText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐒𝐏𝐄𝐄𝐃~ 〕⌬ ╄╾ ━\n\n`;
        resultText += `> *✧────[ 📊 معلومات السرعة ]────╮*\n`;

        // زمن استجابة البوت المحلي
        resultText += `> *┤ 🤖┊ Ping البوت: ${botPing}ms*\n`;
        resultText += `> *┤ 🕒┊ الوقت: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}*\n`;
        resultText += `> *┤────────────···*\n`;

        // نتائج الخوادم
        if (pingData && pingData.results) {
            resultText += `> *✧────[ 🌐 Ping الخوادم ]────╮*\n`;
            for (const item of pingData.results) {
                const status = item.ping !== null ? `${item.ping}ms` : '❌ غير متاح';
                const emoji = item.ping !== null && item.ping < 50 ? '🟢' :
                              item.ping !== null && item.ping < 150 ? '🟡' :
                              item.ping !== null ? '🔴' : '⚫';
                resultText += `> *┤ ${emoji} ${item.name}: ${status}*\n`;
            }
            if (pingData.average !== null) {
                const avgEmoji = pingData.average < 50 ? '🟢' :
                                 pingData.average < 150 ? '🟡' : '🔴';
                resultText += `> *┤────────────···*\n`;
                resultText += `> *┤ 📈 ${avgEmoji} المتوسط: ${pingData.average}ms*\n`;
                resultText += `> *┤ ✅ تم قياس ${pingData.valid_count}/${pingData.total_count} خادم*\n`;
            }
        } else {
            resultText += `> *┤ ⚠️ تعذر قياس الخوادم*\n`;
        }

        resultText += `> *┤────────────···*\n`;
        resultText += `> *✧────[ ℹ️ معلومات النظام ]────╮*\n`;
        resultText += `> *┤ 💻 النظام: ${process.platform}*\n`;
        resultText += `> *┤ 🧠 الإصدار: Node ${process.version}*\n`;
        resultText += `> *┤────────────···*\n`;
        resultText += `> *💡 استخدم: .السرعة أو .حالة*\n`;
        resultText += `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;

        // 5. إرسال النتيجة مع رد فعل
        await sock.sendMessage(chatJid, { react: { text: '✅', key: m.key } });
        await sock.sendMessage(chatJid, { text: resultText }, { quoted: m });
    }
};
