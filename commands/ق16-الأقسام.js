// =============================================================
// 📂 أمر: ق (قائمة الأقسام)
// الوصف: يعرض قائمة كل أقسام الأوامر، أو أوامر قسم معيّن عند تمرير رقم
// الاستخدام: .ق          → يعرض كل الأقسام
//            .ق5         → يعرض أوامر القسم رقم 5
// =============================================================

// مصدر واحد للحقيقة: كل قسم عنده رقم + اسم عربي + إيموجي
// (بدل ما تتفرق البيانات في objects منفصلة وممكن تتعارض)
const CATEGORIES = {
    1:  { name: 'الشخصيات', emoji: '🎭' },
    2:  { name: 'الأدوات', emoji: '🧰' },
    3:  { name: 'المطور', emoji: '🧑‍💻' },
    4:  { name: 'المشرفين', emoji: '🧾' },
    5:  { name: 'الدين', emoji: '☪️' },
    6:  { name: 'الجروبات', emoji: '👥' },
    7:  { name: 'الألعاب', emoji: '🎮' },
    8:  { name: 'الصور', emoji: '🖼️' },
    9:  { name: 'البنك', emoji: '🏦' },
    10: { name: 'الميديا', emoji: '⬇️' },
    11: { name: 'الحماية', emoji: '🛡️' },
    12: { name: 'الملصقات', emoji: '🔂' },
    13: { name: 'الريكشنات', emoji: '🍥' },
    14: { name: 'الــزرف', emoji: '🕹️' },
    15: { name: 'التصميم', emoji: '🧩' },
    16: { name: 'النظام', emoji: '♨️' },
};

// أوامر يدوية إضافية لأقسام معينة (لو احتجت تضيف أمر مش موجود كملف)
// مثال: MANUAL_COMMANDS[9] = [{ name: 'مثال', description: 'وصف الأمر' }]
const MANUAL_COMMANDS = {};

const FOOTER = '> 𝙱𝚈┇ 𝙰𝙻𝙿𝙷𝙰 𝚇 𝙱𝙾𝚃';
const DIVIDER = '> *┤────────────···*';

/**
 * يبني نص القائمة الرئيسية لكل الأقسام
 */
function buildMainMenu() {
    const lines = Object.entries(CATEGORIES).map(
        ([num, { name, emoji }]) => `> *┤${emoji}┊ \`.ق${num}\`: قسم ${name}*`
    );

    return [
        '> ━ ╼╃ ⌬〔 ~𝐀𝐋𝐏𝐇𝐀 𝐗 𝐁𝐎𝐓~ 〕⌬ ╄╾ ━',
        '',
        '> *⋅ ───━ •﹝♦﹞• ━─── ⋅*',
        '`قائمة كل الأقسام المتوفرة في البوت`',
        '> *✧────[ الأقسام ]────╮*',
        DIVIDER,
        ...lines,
        DIVIDER,
        '> *⋅ ───━ •﹝♦﹞• ━─── ⋅*',
        FOOTER,
    ].join('\n');
}

/**
 * يبني نص أوامر قسم معيّن
 */
function buildCategoryMenu(categoryNumber, commands, emoji, categoryLabel) {
    const target = `ق${categoryNumber}`;
    const commandLines = commands.map(
        (cmd) =>
            `> *┤ ${emoji}┊ .${cmd.name}*\n> *┤ \`${cmd.description || 'لا يوجد وصف'}\`*`
    );

    return [
        `> ━ ╼╃ ⌬〔 *قسم: ${categoryLabel || target}* 〕⌬ ╄╾ ━`,
        DIVIDER,
        ...commandLines,
        DIVIDER,
        '> *⋅ ───━ •﹝♦﹞• ━─── ⋅*',
        FOOTER,
    ].join('\n');
}

/**
 * يستخرج رقم القسم من نص الأمر (مثال: ".ق5" → "5")
 */
function extractCategoryNumber(message) {
    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    const usedCommand = text.trim().split(' ')[0].slice(1);
    return usedCommand.replace('ق', '');
}

export default {
    name: 'ق',
    aliases: Array.from({ length: 16 }, (_, i) => `ق${i + 1}`),

    execute: async (sock, m, args, ctx) => {
        const { cmds } = ctx;
        const chatJid = m.key.remoteJid;
        const categoryNumber = extractCategoryNumber(m);

        // 📌 لا يوجد رقم → عرض القائمة الرئيسية لكل الأقسام
        if (!categoryNumber) {
            return sock.sendMessage(
                chatJid,
                { text: buildMainMenu() },
                { quoted: m }
            );
        }

        // 📌 رقم قسم غير معروف
        const category = CATEGORIES[categoryNumber];
        if (!category) {
            return sock.sendMessage(
                chatJid,
                { text: `> ⚠️ القسم *[ ق${categoryNumber} ]* غير موجود.` },
                { quoted: m }
            );
        }

        const targetCategory = `ق${categoryNumber}`;
        const { name: categoryLabel, emoji } = category;

        // ✅ أوامر من الملفات (يقبل الاسم العربي أو رقم القسم كـ category)
        const fileCommands = [...cmds.values()].filter(
            (cmd) => cmd.category === categoryLabel || cmd.category === targetCategory
        );

        // ✅ أوامر يدوية إضافية (إن وُجدت)
        const manualCommands = MANUAL_COMMANDS[categoryNumber] || [];

        const allCommands = [...fileCommands, ...manualCommands];

        // 📌 القسم فارغ
        if (allCommands.length === 0) {
            return sock.sendMessage(
                chatJid,
                { text: `> ⚠️ القسم *[ ${targetCategory} ]* فارغ حالياً.` },
                { quoted: m }
            );
        }

        // 📌 عرض أوامر القسم
        const categoryText = buildCategoryMenu(
            categoryNumber,
            allCommands,
            emoji,
            categoryLabel
        );

        return sock.sendMessage(chatJid, { text: categoryText }, { quoted: m });
    },
};