import axios from 'axios';
import { URL } from 'url';

const SUSPICIOUS_DOMAINS = [
    'bit.ly', 'tinyurl.com', 'cutt.ly', 'ow.ly', 'short.link', 'rb.gy',
    'is.gd', 'buff.ly', 't.co', 'goo.gl', 'tiny.cc', 'shorte.st',
    'sh.st', 'lnkd.in', 'db.tt', 'qr.ae', 'adf.ly', 'shink.in',
    'v.gd', 'cli.gs', 'shorturl.at', 'tiny.one', 'short.io',
    'rebrand.ly', '2.gp', 'shorturl.is', 'linktr.ee',

    '.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.bid', '.date', '.download'
];

const UNKNOWN_MESSAGE = '⚠️ تعذر فك الرابط (قد يكون غير صالح أو لا يستجيب)';

async function unshorten(url) {
    let current = url;
    let redirects = 0;
    const visited = new Set();
    let isSafe = true;
    let reason = '';

    const MAX_REDIRECTS = 10;

    while (redirects < MAX_REDIRECTS) {
        if (visited.has(current)) {
            return {
                original: url,
                final: current,
                redirects,
                safe: false,
                reason: 'دورة إعادة توجيه لا نهائية'
            };
        }
        visited.add(current);

        try {
            const response = await axios({
                method: 'HEAD',
                url: current,
                maxRedirects: 0,
                timeout: 10000,
                validateStatus: status => status >= 200 && status < 400 || status === 301 || status === 302 || status === 307 || status === 308,
            });

            const status = response.status;
            if (status >= 200 && status < 300) {
                break;
            } else if ([301, 302, 307, 308].includes(status)) {
                const location = response.headers.location;
                if (!location) {
                    break;
                }

                const next = new URL(location, current).href;
                current = next;
                redirects++;
            } else {
                break;
            }
        } catch (error) {
            return {
                original: url,
                final: current,
                redirects,
                safe: false,
                reason: 'فشل الاتصال بالخادم'
            };
        }
    }

    try {
        const finalUrl = new URL(current);
        const domain = finalUrl.hostname.toLowerCase();

        for (const suspect of SUSPICIOUS_DOMAINS) {
            if (domain.includes(suspect) || domain === suspect) {
                isSafe = false;
                reason = `النطاق "${domain}" قد يكون مشبوهاً (مختصر أو غير موثوق)`;
                break;
            }
        }

        if (domain.includes('bit.ly') || domain.includes('tinyurl') || domain.includes('cutt.ly') || domain.includes('short')) {
            isSafe = false;
            reason = 'الرابط لا يزال مختصراً، قد يكون خطيراً';
        }
    } catch {
        isSafe = false;
        reason = 'رابط غير صالح';
    }

    return {
        original: url,
        final: current,
        redirects,
        safe: isSafe,
        reason: reason || (isSafe ? 'آمن' : 'غير آمن')
    };
}

export default {
    name: 'كاشف',
    aliases: ['اكتشف', 'افحصه', 'checklink'],
    description: 'كاشف الروابط المشبوهة',
    category: 'ق2',
    usage: '.كاشف <الرابط> [رابط آخر...]',
    group: false,

    async execute(sock, m, args, { cfg, db }) {
        const jid = m.key.remoteJid;
        if (!args.length) {
            return sock.sendMessage(jid, {
                text: '⚠️ أرسل رابطاً لفحصه.\nمثال: .كاشف https://bit.ly/2XyZabc'
            }, { quoted: m });
        }

        const urls = [];
        for (const arg of args) {
            if (arg.startsWith('http://') || arg.startsWith('https://')) {
                urls.push(arg);
            } else if (arg.includes('.') && !arg.includes(' ')) {
                urls.push('https://' + arg);
            }
        }

        if (!urls.length) {
            return sock.sendMessage(jid, {
                text: '❌ لم أجد رابطاً صالحاً في الرسالة.'
            }, { quoted: m });
        }

        let results = [];
        for (const url of urls) {
            const result = await unshorten(url);
            results.push(result);
        }

        let message = '*❐═━━━═╊⊰🔍⊱╉═━━━═❐*\n' +
                      '*┇ فحص الروابط ┇*\n' +
                      '*❐═━━━═╊⊰🔍⊱╉═━━━═❐*\n\n';

        for (const r of results) {
            const statusEmoji = r.safe ? '✅' : '⚠️';
            message += `*${statusEmoji} الرابط:* ${r.original}\n`;
            message += `*┇ الرابط النهائي:* ${r.final}\n`;
            message += `*┇ عمليات إعادة التوجيه:* ${r.redirects}\n`;
            message += `*┇ الحالة:* ${r.reason}\n\n`;
        }

        message += '*❐═━━━═╊⊰🔍⊱╉═━━━═❐*\n' +
                   '> *تم الفحص بواسطة SUNG BOT*';

        await sock.sendMessage(jid, { text: message }, { quoted: m });
    }
};


// ──────────[ 𝒜𝒴𝒪𝒰ℬ ]───────────