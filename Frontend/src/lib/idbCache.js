/**
 * Lightweight IndexedDB cache for ClinGene public articles and data.
 * Zero external dependencies. Works in all modern browsers.
 */

const DB_NAME = "clingene_cache_v2";
const STORE_NAME = "articles";

function openDb() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

export async function getIdbItem(key) {
  try {
    const db = await openDb();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  } catch (_) {
    return null;
  }
}

export async function setIdbItem(key, val) {
  try {
    const db = await openDb();
    if (!db) return;
    new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(val, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  } catch (_) {}
}
