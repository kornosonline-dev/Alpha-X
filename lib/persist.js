// persist.js
import crypto from 'crypto';
import os from 'os';
import fs from 'fs';
import path from 'path';
import NodeCache from 'node-cache';

// ===== الإعداد =====
// تم تغيير المسار إلى src/zarf
const dataDir = path.join(process.cwd(), 'src', 'zarf');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const filePath = path.join(dataDir, 'data.json');
const cache = new NodeCache({ useClones: false });

// ===== قراءة/كتابة JSON =====
function readDB() {
    try {
        if (!fs.existsSync(filePath)) return { kicked: {} };
        const raw = fs.readFileSync(filePath, 'utf-8').trim();
        if (!raw) return { kicked: {} };
        return JSON.parse(raw);
    } catch {
        console.error('[persist] Failed to read data.json — resetting.');
        return { kicked: {} };
    }
}

function writeDB(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ===== اشتقاق المفتاح من خصائص الجهاز =====
function deriveKey() {
    const machineId = [
        os.hostname(),
        os.platform(),
        os.arch(),
        process.env.USER || process.env.USERNAME || 'bot'
    ].join('::');

    return crypto.pbkdf2Sync(machineId, 'persist-salt-v1', 100_000, 32, 'sha512');
}

// ===== ChaCha20-Poly1305 =====
function encrypt(plaintext) {
    const key = deriveKey();
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return `${encrypted.toString('hex')}:${tag.toString('hex')}:${nonce.toString('hex')}`;
}

function decrypt(encryptedStr) {
    const [dataHex, tagHex, nonceHex] = encryptedStr.split(':');
    const key = deriveKey();
    const decipher = crypto.createDecipheriv(
        'chacha20-poly1305',
        key,
        Buffer.from(nonceHex, 'hex'),
        { authTagLength: 16 }
    );

    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

    try {
        return Buffer.concat([
            decipher.update(Buffer.from(dataHex, 'hex')),
            decipher.final()
        ]).toString('utf8');
    } catch {
        throw new Error('[Security] Authentication failed — data may be tampered.');
    }
}

// ===== HMAC =====
function computeHmac(encryptedId, encryptedTs) {
    return crypto
        .createHmac('sha256', deriveKey())
        .update(`${encryptedId}|${encryptedTs}`)
        .digest('hex');
}

function idHash(id) {
    return crypto.createHash('sha256').update(id).digest('hex');
}

// ===== تحميل الكاش عند البدء =====
function loadCache() {
    const db = readDB();

    for (const [hash, entry] of Object.entries(db.kicked)) {
        try {
            const expectedHmac = computeHmac(entry.encId, entry.encTs);
            if (expectedHmac !== entry.hmac) {
                console.error(`[Security] HMAC mismatch — skipping ${hash}`);
                continue;
            }

            const id = decrypt(entry.encId);
            const ts = parseInt(decrypt(entry.encTs), 10);

            if (!/^\d+$/.test(id)) continue;
            if (isNaN(ts) || ts > Date.now() + 60_000) continue;

            cache.set(hash, { id: id + '@lid', ts });
        } catch (e) {
            console.error(`[Security] Failed to load entry: ${e.message}`);
        }
    }
}

loadCache();

// ===== واجهة عامة =====

export function addKicked(ids) {
    const now = Date.now();
    const db = readDB();
    let changed = false;

    for (const raw of ids) {
        const id = raw.toString().split('@')[0];
        if (id.length < 10) continue;

        const hash = idHash(id);
        if (cache.has(hash)) continue;

        const encId = encrypt(id);
        const encTs = encrypt(now.toString());
        const hmac = computeHmac(encId, encTs);

        db.kicked[hash] = { encId, encTs, hmac, createdAt: now };
        cache.set(hash, { id: id + '@lid', ts: now });
        changed = true;
    }

    if (changed) writeDB(db);
    return cache.keys().length;
}

export function isKicked(id) {
    const cleanId = id.toString().split('@')[0];
    return cache.has(idHash(cleanId));
}

export function removeKicked(id) {
    const cleanId = id.toString().split('@')[0];
    const hash = idHash(cleanId);
    const db = readDB();

    cache.del(hash);
    delete db.kicked[hash];
    writeDB(db);
}

export function getUniqueKicked() {
    const result = new Map();
    for (const key of cache.keys()) {
        const entry = cache.get(key);
        if (entry) result.set(entry.id, entry.ts);
    }
    return result;
}