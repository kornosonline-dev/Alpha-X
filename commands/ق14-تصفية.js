import zarfData from '../src/zarf/ZARF.js';
import { addKicked } from '../lib/persist.js';

export default {
    name: 'تصفية',
    aliases: ['تنظيف', 'مسح'],
    description: 'تصفية المجموعة: تغيير الاسم والوصف، إرسال رسالة، طرد الكل عدا المطور والنخبة',
    category: 'ق14',
    group: true,
    botAdmin: true,
    owner: true,
    elite: true,

    async execute(sock, m, args, ctx) {
        const { decodeJid, cfg } = ctx;
        const chatJid = m.key.remoteJid;

        // جلب بيانات الزرف (نستخدم فقط الاسم والوصف والرسالة)
        const zarfConfig = zarfData.default || zarfData;
        if (!zarfConfig || !zarfConfig.zarf) {
            return await sock.sendMessage(chatJid, { text: '❌ ملف ZARF.js غير موجود أو غير صحيح.' }, { quoted: m });
        }
        const zarf = zarfConfig.zarf;

        // ─── 1. تغيير اسم الجروب ───
        if (zarf.newSubject?.enabled !== false && zarf.newSubject?.value) {
            try {
                await sock.groupUpdateSubject(chatJid, zarf.newSubject.value);
            } catch (e) {
                console.error('❌ خطأ في تغيير الاسم:', e);
                await sock.sendMessage(chatJid, { text: '❌ فشل تغيير اسم الجروب.' }, { quoted: m });
            }
        }

        // ─── 2. تغيير وصف الجروب ───
        if (zarf.newDescription?.enabled !== false && zarf.newDescription?.value) {
            try {
                await sock.groupUpdateDescription(chatJid, zarf.newDescription.value);
            } catch (e) {
                console.error('❌ خطأ في تغيير الوصف:', e);
                await sock.sendMessage(chatJid, { text: '❌ فشل تغيير وصف الجروب.' }, { quoted: m });
            }
        }

        // ─── 3. إرسال الرسالة النصية ───
        if (zarf.text?.enabled !== false && zarf.text?.value) {
            await sock.sendMessage(chatJid, { text: zarf.text.value }, { quoted: m });
        }

        // ─── 4. طرد جميع الأعضاء عدا المستثنيين ───
        let kickedList = [];

        try {
            const groupMetadata = await sock.groupMetadata(chatJid);
            const participants = groupMetadata.participants || [];

            // استخدام decodeJid من السياق (نفس طريقة main.js)
            const botJid = decodeJid(sock.user.id || sock.user?.jid || '');
            const ownerJid = decodeJid(cfg.ownerNumber);
            const eliteJids = (cfg.eliteNumbers || []).map(n => decodeJid(n));
            const exclude = new Set([botJid, ownerJid, ...eliteJids]);

            // تصفية المشاركين: استبعاد من رقمه المطابق للمستثنيين
            const toRemove = participants
                .filter(p => {
                    const pJid = decodeJid(p.id);
                    return !exclude.has(pJid);
                })
                .map(p => p.id);

            kickedList = toRemove;

            if (toRemove.length === 0) {
                await sock.sendMessage(chatJid, { text: '⚠️ لا يوجد أعضاء لطردهم (الكل مستثنى).' }, { quoted: m });
            } else {
                const batchSize = 5;
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

                for (let i = 0; i < toRemove.length; i += batchSize) {
                    const batch = toRemove.slice(i, i + batchSize);
                    try {
                        await sock.groupParticipantsUpdate(chatJid, batch, 'remove');
                    } catch (err) {
                        console.error('❌ خطأ في طرد مجموعة:', err);
                        await sock.sendMessage(chatJid, { text: `❌ فشل طرد بعض الأعضاء.` }, { quoted: m });
                    }
                    await delay(1000);
                }
            }
        } catch (e) {
            console.error('❌ خطأ في جلب بيانات المجموعة أو الطرد:', e);
            await sock.sendMessage(chatJid, { text: '❌ حدث خطأ أثناء عملية الطرد.' }, { quoted: m });
        }

        // حفظ المطرودين في قاعدة البيانات
        if (kickedList.length > 0) {
            try {
                addKicked(kickedList);
            } catch (err) {
                console.error('❌ خطأ في حفظ المطرودين:', err);
            }
        }

        // رسالة نهائية
        await sock.sendMessage(chatJid, { text: '✅ تمت تصفية المجموعة بنجاح.' }, { quoted: m });
    }
};