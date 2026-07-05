import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsPath = path.join(__dirname, '../config.js');

export default {
    name: 'مود',
    aliases: ['الوضع', 'وضع'],
    category: 'ق14',
    description: 'تغيير وضع البوت (عام، خاص، نفس)',

    owner: true,
    elite : true, 

    execute: async (sock, m, args, ctx) => {
        try {
            const chatJid = m.key.remoteJid;
            const mode = args[0]?.toLowerCase();

            if (!mode) {
                const currentMode = ctx.cfg.mode || 'Public';
                const modeEmojis = {
                    'public': '🌍',
                    'private': '🔒',
                    'self': '🤖'
                };
                const modeNames = {
                    'public': 'عام (الكل يستطيع الاستخدام)',
                    'private': 'خاص (المطور + النخبة + المميزين فقط)',
                    'self': 'نفس (المطور فقط)'
                };
                const emoji = modeEmojis[currentMode.toLowerCase()] || '⚙️';
                const name = modeNames[currentMode.toLowerCase()] || currentMode;

                await sock.sendMessage(chatJid, {
                    text:
`> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗~ 〕⌬ ╄╾ ━

> *✧────[ الوضع الحالي ]────╮*

${emoji} *الوضع:* ${name}

📌 *للتحويل استخدم:*
.مود عام
.مود خاص
.مود نفس

> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> *𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃*`
                }, { quoted: m });
                return true;
            }

            const validModes = ['عام', 'public', 'خاص', 'private', 'نفس', 'self'];
            if (!validModes.includes(mode)) {
                await sock.sendMessage(chatJid, {
                    text:
`❌ وضع غير معروف!

📌 *الأوضاع المتاحة:*
• عام (public) - الكل يستطيع الاستخدام
• خاص (private) - المطور + النخبة + المميزين فقط
• نفس (self) - المطور فقط

📝 *مثال:* .مود عام`
                }, { quoted: m });
                return false;
            }

            let newMode;
            if (['عام', 'public'].includes(mode)) newMode = 'Public';
            else if (['خاص', 'private'].includes(mode)) newMode = 'Private';
            else if (['نفس', 'self'].includes(mode)) newMode = 'Self';

            let settingsContent = fs.readFileSync(settingsPath, 'utf8');

            const modeRegex = /mode:\s*['"`]([^'"`]*)['"`]/i;
            if (modeRegex.test(settingsContent)) {
                settingsContent = settingsContent.replace(modeRegex, `mode: '${newMode}'`);
            } else {

                settingsContent = settingsContent.replace(
                    /prefix:\s*\[([^\]]*)\]/,
                    `prefix: [$1],\n    mode: '${newMode}'`
                );
            }

            fs.writeFileSync(settingsPath, settingsContent, 'utf8');

            ctx.cfg.mode = newMode;

            const modeEmojis = {
                'Public': '🌍',
                'Private': '🔒',
                'Self': '🤖'
            };
            const modeDescriptions = {
                'Public': '✅ الكل يستطيع استخدام البوت',
                'Private': '🔐 فقط المطور + النخبة + المميزين',
                'Self': '🤖 فقط المطور'
            };

            await sock.sendMessage(chatJid, {
                text:
`*❐═━━━═╊⊰✅⊱╉═━━━═❐*
*『 تم تغيير وضع البوت 』*
*❐═━━━═╊⊰✅⊱╉═━━━═❐*

${modeEmojis[newMode]} *الوضع الجديد:* ${newMode}

📊 *الوصف:* ${modeDescriptions[newMode]}

🔄 *سيتم تطبيق التغييرات فوراً*

> *⋅ ───━ •﹝♦﹞• ━─── ⋅*
> *𝙱𝚈┇𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃*`
            }, { quoted: m });

            return true;

        } catch (error) {
            console.error("❌ Error in Mode Command:", error);
            await sock.sendMessage(m.key.remoteJid, {
                text: `❌ حدث خطأ: ${error.message}`
            }, { quoted: m });
        }
    }
};


// ──────────[ 𝒜𝒴𝒪𝒰ℬ ]───────────