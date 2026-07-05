import axios from 'axios';
import chalk from 'chalk';

export default {
    name: 'ايرين',
    aliases: ['إيرين ييغر', 'إيرين'],
    description: 'تحدث مع إيرين ييغر',
    category: 'ق1',
    group: false,

    execute: async (sock, m, args, ctx) => {
        const text = args.join(' ');
        const characterName = 'إيرين ييغر';

        if (!text) {
            return sock.sendMessage(m.key.remoteJid, {
                text: `⚠️ | ماذا تريد أن تقول لـ ${characterName}؟`
            }, { quoted: m });
        }

        const systemPrompt = 'أنت إيرين ييغر، تحدث عن الحرية وإبادة الأعداء.';

        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${ctx.cfg.geminiKey}`;
            const geminiResponse = await axios.post(geminiUrl, {
                contents: [{ parts: [{ text: `Roleplay Instruction: ${systemPrompt}\n\nUser Question: ${text}` }] }]
            });
            const result = geminiResponse.data.candidates[0].content.parts[0].text;

            const aiText = `> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━\n\n` +
                           `> *✧────[ \`${characterName.toUpperCase()}\` ]────╮*\n` +
                           `> ${result}\n` +
                           `> *┤────────────···*\n` +
                           `> 𝙱𝙰┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃`;

            await sock.sendMessage(m.key.remoteJid, { text: aiText }, { quoted: m });

        } catch (err) {
            console.log(chalk.yellow("⚠️ Gemini Failed, trying OpenAI..."));
            try {
                const res = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${ctx.cfg.openAIKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = res.data.choices[0].message.content;
                await sock.sendMessage(m.key.remoteJid, { text: `*(OpenAI)*\n${result}` }, { quoted: m });
            } catch (openAiErr) {
                console.log(chalk.red("❌ Both APIs Failed:"), openAiErr.message);
                sock.sendMessage(m.key.remoteJid, { text: '❌ | عذراً، جميع المحركات معطلة حالياً. تأكد من صحة مفاتيح الـ API في config.js' }, { quoted: m });
            }
        }
    }
};