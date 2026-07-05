import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import chalk from 'chalk';

const execAsync = promisify(exec);
const tmp = path.join(process.cwd(), 'temp');

if (!fs.existsSync(tmp)) {
    fs.mkdirSync(tmp, { recursive: true });
}

async function gifToMp4(url) {
    const id = Date.now();
    const gifPath = path.join(tmp, `${id}.gif`);
    const mp4Path = path.join(tmp, `${id}.mp4`);

    const writer = fs.createWriteStream(gifPath);
    const res = await axios({ url, responseType: 'stream' });
    res.data.pipe(writer);
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    await execAsync(`ffmpeg -i "${gifPath}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p "${mp4Path}"`);

    const buffer = fs.readFileSync(mp4Path);
    fs.unlinkSync(gifPath);
    fs.unlinkSync(mp4Path);

    return buffer;
}

export default {
    name: 'خائف',
    aliases: ['scared', 'خوف', 'خايف'],
    category: 'ق13',
    description: 'إرسال GIF خوف لشخص ما',

    execute: async (sock, m, args, ctx) => {
        const chatJid = m.key.remoteJid;
        const sender = m.key.participant || m.participant || chatJid;

        let target = null;

        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        if (!target && m.message?.contextInfo?.mentionedJid) {
            target = m.message.contextInfo.mentionedJid[0];
        }

        if (!target && m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
            if (quoted?.key?.participant) {
                target = quoted.key.participant;
            } else if (quoted?.participant) {
                target = quoted.participant;
            } else if (quoted?.sender) {
                target = quoted.sender;
            }
        }

        if (!target && m.message?.extendedTextMessage?.contextInfo?.participant) {
            target = m.message.extendedTextMessage.contextInfo.participant;
        }

        if (!target && m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.key?.remoteJid) {
            target = m.message.extendedTextMessage.contextInfo.quotedMessage.key.remoteJid;
        }

        if (!target) {
            const text = m.message?.conversation ||
                        m.message?.extendedTextMessage?.text ||
                        m.message?.imageMessage?.caption ||
                        m.message?.videoMessage?.caption || '';
            const match = text.match(/@(\d+)/);
            if (match) {
                target = match[1] + '@s.whatsapp.net';
            }
        }

        if (!target && m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        }

        if (!target) {
            return sock.sendMessage(chatJid, {
                text: '⚠️ يرجى منشن الشخص (@اسم) أو الرد على رسالته.'
            }, { quoted: m });
        }

        const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
        if (target === botJid || target === sock.user?.id) {
            return sock.sendMessage(chatJid, {
                text: '😅 لا يمكنك منشن البوت نفسه!'
            }, { quoted: m });
        }

        if (!chatJid.endsWith('@g.us')) {
            return sock.sendMessage(chatJid, {
                text: '⚠️ هذا الأمر يعمل فقط في المجموعات.'
            }, { quoted: m });
        }

        let groupMetadata;
        try {
            groupMetadata = await sock.groupMetadata(chatJid);
        } catch (err) {
            console.error(chalk.red('Failed to get group metadata:'), err);
            return sock.sendMessage(chatJid, {
                text: '❌ فشل جلب بيانات المجموعة.'
            }, { quoted: m });
        }

        const participant = groupMetadata.participants.find(p => p.id === target);
        if (!participant) {
            return sock.sendMessage(chatJid, {
                text: '⚠️ الشخص المذكور غير موجود في هذه المجموعة.'
            }, { quoted: m });
        }

        const apiKey = ctx.cfg.giphyApiKey;
        if (!apiKey) {
            return sock.sendMessage(chatJid, {
                text: '❌ مفتاح Giphy غير موجود في الإعدادات.'
            }, { quoted: m });
        }

        try {
            const giphyRes = await axios.get('https://api.giphy.com/v1/gifs/random', {
                params: {
                    api_key: apiKey,
                    tag: 'anime scared',
                    rating: 'g'
                }
            });

            const gifUrl = giphyRes.data?.data?.images?.original?.url;
            if (!gifUrl) {
                throw new Error('لم يتم العثور على GIF');
            }

            const videoBuffer = await gifToMp4(gifUrl);

            const caption = `*_@${sender.split('@')[0]} خايف من @${target.split('@')[0]}_*\n> *_أنمي: scared_*`;

            await sock.sendMessage(chatJid, {
                video: videoBuffer,
                caption: caption,
                gifPlayback: true,
                mentions: [sender, target]
            });

        } catch (err) {
            console.error(chalk.red('[SCARED ERROR]'), err);
            await sock.sendMessage(chatJid, {
                text: `❌ حدث خطأ: ${err.message || 'غير معروف'}`
            }, { quoted: m });
        }
    }
};


// ──────────[ ALPHA ]───────────