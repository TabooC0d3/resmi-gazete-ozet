/*
 * Özet RG web sitesi. Özetler, uygulamanın da okuduğu GitHub deposundan (raw.githubusercontent.com)
 * canlı okunur; site yalnızca bu dosyalardan oluşur, sunucu ya da veritabanı yoktur. Görünüm
 * uygulamanın stil dosyasıyla (app.css = uygulamadaki page.css) aynıdır; sitenin kendi parçaları site.css'te.
 */
"use strict";

const RAW = "https://raw.githubusercontent.com/birolabanuzoglu/resmi-gazete-ozet/main/";
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
// Arşivin hedef aralığı (uygulamadaki ARCHIVE_FIRST / ARCHIVE_LAST ile aynı)
const ARSIV_BAS = Date.UTC(2020, 0, 1), ARSIV_SON = Date.UTC(2026, 10, 10);
const ATAMA_ACIK = 12;

// Material Icons (Apache 2.0) yolları
const P = {
  doc: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  list: "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z",
  bulb: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
  pie: "M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z",
  spark: "M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",
  bank: "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z",
  arrow: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
  expand: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
  chev: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  book: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z",
  rule: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  gavel: "M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.83 2.83-5.654-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z",
  megaphone: "M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z",
  label: "M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z",
  person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  group: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  cal: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
  history: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",
  search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  vol: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
  stop: "M6 6h12v12H6z",
  moon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
  sun: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z",
  auto: "M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z",
  share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z",
  attach: "M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z",
  warn: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  archive: "M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;

const KIND_COLOR = {
  kanun: ["#B71C1C", "#FF8A80"], yon: ["#1A56C4", "#8AB4F8"], teb: ["#0F766E", "#5FD3C3"], karar: ["#6D28D9", "#C4A7FF"],
  ata: ["#C2410C", "#FFB27A"], gen: ["#3949AB", "#9FA8F0"], yargi: ["#795548", "#D7B9A8"], ilan: ["#546E7A", "#AEBCC4"],
  diger: ["#455A64", "#AEBCC4"],
};
const KIND_ICON = { kanun: "book", yon: "rule", teb: "megaphone", karar: "label", ata: "person", gen: "doc", yargi: "gavel", ilan: "list", diger: "doc" };

// ------------------------------------------------------------------ yardımcılar

const $app = document.getElementById("app");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const low = s => String(s).toLocaleLowerCase("tr");
const up = s => String(s).toLocaleUpperCase("tr");
const tag = el => el.tagName.toLowerCase();
const isDark = () => document.documentElement.classList.contains("dark");
const sayi = n => n.toLocaleString("tr-TR");

/** "20261118" → UTC zaman damgası */
const tsOf = k => Date.UTC(+k.slice(0, 4), +k.slice(4, 6) - 1, +k.slice(6, 8));
const keyOf = ts => new Date(ts).toISOString().slice(0, 10).replace(/-/g, "");
const isoOf = k => `${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6, 8)}`;
const dayOf = k => +k.slice(6, 8);
const monOf = k => AYLAR[+k.slice(4, 6) - 1];
const wdOf = k => GUNLER[new Date(tsOf(k)).getUTCDay()];
const longOf = k => `${dayOf(k)} ${monOf(k)} ${k.slice(0, 4)}`;
const shortOf = k => `${dayOf(k)} ${monOf(k).slice(0, 3)}`;
const mon3 = k => up(monOf(k).slice(0, 3));
/** Adres parametresindeki tarih: "2026-11-18" ya da "20261118" */
const normKey = s => { const d = String(s || "").replace(/\D/g, ""); return d.length === 8 ? d : ""; };
const dayUrl = (k, q) => `?gun=${isoOf(k)}` + (q ? `&ara=${encodeURIComponent(q)}` : "");

/** Özetteki satır içi biçimi güvenli biçimde yeniden yazar: yalnızca bilinen etiketler, bağlantılar http(s). */
function inl(el) {
  let s = "";
  for (const n of el.childNodes) {
    if (n.nodeType === 3) { s += esc(n.nodeValue); continue; }
    if (n.nodeType !== 1) continue;
    const t = tag(n);
    if (t === "a") {
      const h = n.getAttribute("href") || "";
      s += /^https?:\/\//i.test(h) ? `<a href="${esc(h)}" target="_blank" rel="noopener">${inl(n)}</a>` : inl(n);
    } else if (t === "br") s += "<br>";
    else if (["b", "strong", "i", "em", "mark", "sub", "sup", "code", "u"].includes(t)) s += `<${t}>${inl(n)}</${t}>`;
    else s += inl(n);
  }
  return s;
}
/** Bir bloğu güvenli HTML olarak yazar (p, ul/ol, tablo); başlıklar ve bilinmeyenler paragraf olur. */
function block(el) {
  const t = tag(el);
  if (t === "ul" || t === "ol") return `<${t}>` + [...el.children].filter(c => tag(c) === "li").map(li => `<li>${inl(li)}</li>`).join("") + `</${t}>`;
  if (t === "table") return table(el);
  return `<p>${inl(el)}</p>`;
}
/** Paragraf kalın bir başlıkla mı başlıyor ("<b>Kurum:</b> …"): başlığın metni */
function boldLead(el) {
  const f = el.firstChild;
  const node = f && f.nodeType === 3 && !f.nodeValue.trim() ? f.nextSibling : f;
  return node && node.nodeType === 1 && ["b", "strong"].includes(tag(node)) ? node.textContent.trim() : "";
}
/** Kalın başlıktan sonraki kısmın güvenli HTML'i */
function afterLead(el) {
  const c = el.cloneNode(true);
  const b = c.querySelector("b,strong");
  if (b) b.remove();
  return inl(c).trim();
}

async function getText(path, fresh) {
  const r = await fetch(RAW + path, fresh ? { cache: "no-cache" } : {});
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.text();
}

// ------------------------------------------------------------------ veriler

let INDEX = null;
let PARTS = null;     // gün → {sayi, duzenleme, personel, onizleme, metin}
let partsLoading = null;
let KOK = 7;
const pages = new Map();

async function loadIndex() {
  if (!INDEX) INDEX = JSON.parse(await getText("index.json", true));
  return INDEX;
}
/** Aylık arama parçaları (her günün sayısı, önizlemesi ve arama kökleri) */
function loadParts() {
  if (PARTS) return Promise.resolve(PARTS);
  if (!partsLoading) {
    const months = Object.keys(INDEX.arama_parcalari || {});
    partsLoading = Promise.all(months.map(m => getText(`arama/${m}.json`).then(JSON.parse).catch(() => null))).then(list => {
      const all = {};
      for (const p of list) {
        if (!p) continue;
        if (p.kok) KOK = p.kok;
        Object.assign(all, p.gunler || {});
      }
      PARTS = all;
      return all;
    });
  }
  return partsLoading;
}
async function loadDay(k) {
  if (!pages.has(k)) pages.set(k, await getText(`ozetler/${k}.html`));
  return pages.get(k);
}
const isArchive = k => (INDEX.arsiv_gunleri || []).includes(k);

// ------------------------------------------------------------------ özetin çözümlenmesi

function kindOf(label) {
  const s = low(label);
  if (s.includes("kanun")) return "kanun";
  if (s.includes("yönetmelik")) return "yon";
  if (s.includes("tebliğ")) return "teb";
  if (s.includes("atama")) return "ata";
  if (s.includes("genelge")) return "gen";
  if (s.includes("ilan") || s.includes("ilân")) return "ilan";
  if (["yargı", "mahkeme", "danıştay", "sayıştay"].some(w => s.includes(w))) return "yargi";
  if (s.includes("karar")) return "karar";
  return "diger";
}
function secKind(title) {
  const s = low(title);
  if (s.includes("öne çıkan")) return "one";
  if (s.includes("atama")) return "ata";
  if (s.includes("madde")) return "mad";
  if (s.includes("yorum") || s.includes("değerlendirme")) return "yor";
  if (s.includes("özet")) return "ozet";
  return "dig";
}

function parse(html) {
  const body = new DOMParser().parseFromString(html, "text/html").body;
  const out = { title: "", issue: "", official: "", archive: "", sections: [] };
  let sec = null;
  for (const el of body.children) {
    const t = tag(el);
    if (t === "h1") {
      out.title = el.textContent.trim();
      const m = out.title.match(/(\d{3,6})\s+Sayılı/);
      if (m) out.issue = m[1];
      continue;
    }
    if (t === "h2") {
      sec = { title: el.textContent.trim(), kind: secKind(el.textContent), nodes: [] };
      out.sections.push(sec);
      continue;
    }
    if (!sec) {
      const txt = el.textContent.trim();
      const a = el.querySelector && el.querySelector("a[href]");
      if (/^Kapsam\s*:?\s*(Arşiv özeti|Personel arşivi)/i.test(txt)) out.archive = txt.replace(/^Kapsam\s*:?\s*/i, "");
      else if (a && txt === a.textContent.trim() && /^https?:\/\//.test(a.getAttribute("href"))) out.official = a.getAttribute("href");
      continue;
    }
    sec.nodes.push(el);
  }
  return out;
}

function isItemStart(el) {
  if (tag(el) !== "p" || el.children.length !== 1) return false;
  const a = el.firstElementChild;
  return tag(a) === "a" && el.textContent.trim() === a.textContent.trim() && a.textContent.trim().length > 0;
}
function groupsOf(nodes) {
  const groups = [];
  let g = null, item = null;
  const open = label => { g = { label, kind: kindOf(label), items: [], extra: [] }; groups.push(g); item = null; };
  for (const el of nodes) {
    if (tag(el) === "h3") { open(el.textContent.trim()); continue; }
    if (!g) open("Diğer");
    if (isItemStart(el)) {
      const a = el.firstElementChild;
      item = { title: a.textContent.trim(), href: a.getAttribute("href") || "", nodes: [] };
      g.items.push(item);
      continue;
    }
    (item ? item.nodes : g.extra).push(el);
  }
  return groups;
}
const groupCount = g => g.items.length || g.extra.reduce((n, el) => n + (["ul", "ol"].includes(tag(el)) ? el.children.length : 0), 0);

// ------------------------------------------------------------------ tablolar

/** Kelime düzeyinde fark: eski metinde çıkanlar kırmızı ve çizili, yenide eklenenler yeşil */
function wdiff(a, b) {
  const A = a.split(/\s+/).filter(Boolean), B = b.split(/\s+/).filter(Boolean);
  const n = A.length, m = B.length;
  const plain = [esc(a), esc(b)];
  if (!n || !m || n * m > 60000) return plain;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  // Metinler büsbütün farklıysa işaretleme gürültü olur
  if (dp[0][0] < Math.min(n, m) * 0.25) return plain;
  const oa = [], ob = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { oa.push(esc(A[i++])); ob.push(esc(B[j++])); }
    else if (dp[i + 1][j] >= dp[i][j + 1]) oa.push(`<del class="dw">${esc(A[i++])}</del>`);
    else ob.push(`<ins class="iw">${esc(B[j++])}</ins>`);
  }
  while (i < n) oa.push(`<del class="dw">${esc(A[i++])}</del>`);
  while (j < m) ob.push(`<ins class="iw">${esc(B[j++])}</ins>`);
  const join = (arr, t) => arr.join(" ").replace(new RegExp(`</${t}> <${t} class="${t === "del" ? "dw" : "iw"}">`, "g"), " ");
  return [join(oa, "del"), join(ob, "ins")];
}
function rowsOf(el) {
  return [...el.querySelectorAll("tr")].map(tr => [...tr.children]);
}
/** "Hüküm | Eski | Yeni" tablosu alt alta iki kutu; diğer tablolar yatay kaydırılır */
function table(el) {
  const rows = rowsOf(el);
  if (!rows.length) return "";
  const head = rows[0].map(c => low(c.textContent.trim()));
  const oldAt = head.findIndex(h => h.startsWith("eski") || h.startsWith("önceki"));
  const newAt = head.findIndex(h => h.startsWith("yeni"));
  if (oldAt >= 0 && newAt >= 0 && rows.length > 1) {
    const hAt = head.findIndex((h, i) => i !== oldAt && i !== newAt);
    let s = `<div class="cmp"><div class="cmp-title">Eski – yeni karşılaştırması<span class="cmp-leg"><del>çıkan</del><ins>eklenen</ins></span></div>`;
    for (const r of rows.slice(1)) {
      const o = (r[oldAt] || {}).textContent || "", nw = (r[newAt] || {}).textContent || "";
      const lo = low(o.trim());
      const noOld = !lo || lo === "—" || lo === "-" || lo.startsWith("önceki metne") || lo === "yok" || lo.startsWith("yok ");
      const [d1, d2] = noOld ? [esc(o.trim() || "—"), esc(nw.trim())] : wdiff(o.trim(), nw.trim());
      s += `<div class="cmp-row">` + (hAt >= 0 && r[hAt] ? `<div class="cmp-h">${inl(r[hAt])}</div>` : "") +
        `<div class="cmp-old"><span>Eski</span><div>${d1}</div></div><div class="cmp-new"><span>Yeni</span><div>${d2}</div></div></div>`;
    }
    return s + `</div>`;
  }
  let s = `<div class="tbl"><table>`;
  rows.forEach((r, i) => {
    s += "<tr>" + r.map(c => tag(c) === "th" ? `<th>${inl(c)}</th>` : `<td>${inl(c)}</td>`).join("") + "</tr>";
  });
  return s + `</table></div>`;
}

// ------------------------------------------------------------------ atamalar

const PROVINCIAL_DIRECTOR = /(^|\s)il\s+(\S+\s+)*müdür/;
/** Üst düzey görev mi (uygulamadaki isSeniorPosition ile aynı kural) */
function isSenior(position) {
  const s = low(position);
  const role = (s.includes(" · ") ? s.slice(s.lastIndexOf(" · ") + 3) : s).trim();
  if (["daire başkan", "şube müdür", "bölge müdür", "aday"].some(w => role.includes(w))) return false;
  if (role.includes("ilçe") && role.includes("müdür")) return false;
  if (role.includes("müdür yardımcı") && !role.includes("genel müdür")) return false;
  return ["bakan yardımcı", "genel müdür", "genel sekreter", "rektör", "büyükelçi", "daimi temsilci", "müsteşar",
    "hukuk müşaviri", "başkan yardımcı", "vali yardımcı", "kaymakam"].some(w => role.includes(w)) ||
    PROVINCIAL_DIRECTOR.test(role) || role === "başkan" || role.endsWith(" başkanı") || role === "vali" ||
    role.endsWith(" valisi") || role.endsWith("kurulu üyesi") || role.endsWith("kurul üyesi") || (role === "üye" && s.includes("kurul"));
}
function appointmentRows(nodes) {
  const out = [];
  for (const t of nodes.filter(el => tag(el) === "table")) {
    const rows = rowsOf(t);
    if (rows.length < 2) continue;
    const head = rows[0].map(c => low(c.textContent.trim()));
    const srcAt = head.findIndex(h => h.includes("kaynağ") || h.includes("kaynak"));
    const oldAt = head.findIndex((h, i) => i !== srcAt && (h.startsWith("eski") || h.startsWith("önceki") || h.startsWith("görevden")));
    const newAt = head.findIndex(h => h.startsWith("yeni") || h.startsWith("atanan"));
    if (oldAt < 0 || newAt < 0) continue;
    const posAt = head.findIndex((h, i) => i !== oldAt && i !== newAt && i !== srcAt);
    for (const r of rows.slice(1)) {
      const txt = i => (r[i] ? r[i].textContent.trim() : "");
      if (!txt(posAt) && !txt(oldAt) && !txt(newAt)) continue;
      out.push({ position: txt(posAt), old: txt(oldAt), nw: txt(newAt), src: srcAt >= 0 ? r[srcAt] : null });
    }
  }
  return out;
}
function sourceChip(cell) {
  if (!cell) return "";
  const text = cell.textContent.trim();
  if (!text || ["—", "-", "–"].includes(text)) return "";
  const a = cell.querySelector("a[href]");
  const href = a && /^https?:\/\//.test(a.getAttribute("href")) ? a.getAttribute("href") : "";
  const l = low(text);
  const [cls, icon] = href && href.includes("resmigazete.gov.tr") ? ["src-rg", "📜"] : href ? ["src-web", "🌐"]
    : l.startsWith("araştırıldı") ? ["src-none", "🔍"] : l.startsWith("araştırılmadı") || l.startsWith("araştırılamadı") ? ["src-none", "⏳"]
      : ["src-doc", "📄"];
  return href ? `<a class="ata-src ${cls}" href="${esc(href)}" target="_blank" rel="noopener">${icon} ${esc(text)}</a>`
    : `<span class="ata-src ${cls}">${icon} ${esc(text)}</span>`;
}
function appointee(label, text, cls, src) {
  const name = text.split("(")[0].trim();
  const note = text.includes("(") ? text.slice(text.indexOf("(") + 1, text.lastIndexOf(")") > 0 ? text.lastIndexOf(")") : undefined).trim() : "";
  const dash = !name || ["—", "-", "–"].includes(name);
  const unknown = low(name).startsWith("belirtilmem");
  return `<div class="${cls}${dash || unknown ? " none" : ""}"><span class="t">${label}</span><b>${esc(dash ? "—" : name)}</b>` +
    (note ? `<small>${esc(note)}</small>` : "") + sourceChip(src) + `</div>`;
}
function appointmentRow(r) {
  const parts = r.position.split(" · ").map(x => x.trim()).filter(Boolean);
  const role = parts.length ? parts[parts.length - 1] : r.position;
  const org = parts.length > 1 ? parts.slice(0, -1).join(" · ") : "";
  const top = isSenior(r.position);
  return `<div class="ata-row${top ? " top" : ""}"><div class="ata-pos">${ic("bank")}<span><b>${esc(role || "Görev belirtilmemiş")}</b>` +
    (top ? `<i class="ata-top">⭐ Üst düzey</i>` : "") + (org ? `<small>${esc(org)}</small>` : "") + `</span></div>` +
    `<div class="ata-swap">${appointee("Eski", r.old, "ata-old", r.src)}<span class="ata-ar">${ic("arrow")}</span>${appointee("Yeni", r.nw, "ata-new", null)}</div></div>`;
}
function appointments(sec) {
  const rows = appointmentRows(sec.nodes);
  const senior = rows.filter(r => isSenior(r.position)).length;
  let s = `<section id="sec-ata" class="card sec sec-ata"><h2><span class="ic">${ic("group")}</span>${esc(sec.title)}` +
    (rows.length ? `<span class="cnt">${rows.length}</span>` : "") + `</h2>`;
  for (const el of sec.nodes) if (tag(el) !== "table") s += block(el);
  if (senior && senior < rows.length) s += `<p class="ata-sum">⭐ ${senior} üst düzey atama</p>`;
  if (rows.length) {
    s += `<div class="ata-list">${rows.slice(0, ATAMA_ACIK).map(appointmentRow).join("")}</div>`;
    if (rows.length > ATAMA_ACIK) {
      s += `<details class="ata-more"><summary>Diğer ${rows.length - ATAMA_ACIK} atamayı göster</summary>` +
        `<div class="ata-list">${rows.slice(ATAMA_ACIK).map(appointmentRow).join("")}</div></details>`;
    }
  }
  return s + `<p class="ata-note">Adlar Resmî Gazete'de yayımlanan atama kararlarından aktarılmıştır; bağlayıcı olan kararın kendisidir.</p></section>`;
}

// ------------------------------------------------------------------ maddeler

const PERSONNEL_WORDS = ["personel", "görevde yükselme", "unvan değişikliği", "ünvan değişikliği", "memur", "sözleşmeli", "özlük", "kadro"];
const PERSONNEL_REG_WORDS = ["atama", "yer değiştirme", "uzman yardımcı", "müfettiş", "denetçi", "hizmet içi eğitim"];
function isPersonnelTitle(title) {
  const t = low(title);
  return PERSONNEL_WORDS.some(w => t.includes(w)) || (t.includes("yönetmeli") && PERSONNEL_REG_WORDS.some(w => t.includes(w)));
}
const isPersonnelMarker = el => tag(el) === "p" && /^personel mevzuatı[.:]?$/.test(low(el.textContent.trim())) && el.children.length === 1;

function itemParts(item) {
  const r = { kurum: "", yur: "", aud: [], ekler: [], trans: [], lead: [], details: [], pers: isPersonnelTitle(item.title) };
  for (const el of item.nodes) {
    const t = tag(el);
    const lead = t === "p" ? low(boldLead(el).replace(/:\s*$/, "")) : "";
    if (lead === "kurum" || lead === "yürürlük") {
      for (const part of el.textContent.split(" · ")) {
        const m = part.trim().match(/^(Kurum|Yürürlük)\s*:\s*(.+)$/i);
        if (m) r[low(m[1]) === "kurum" ? "kurum" : "yur"] = m[2].trim();
      }
      continue;
    }
    if (isPersonnelMarker(el)) { r.pers = true; continue; }
    if (lead === "ekler") {
      r.ekler = [...el.querySelectorAll("a[href]")].filter(a => /^https?:\/\//.test(a.getAttribute("href")))
        .map(a => ({ t: a.textContent.trim(), h: a.getAttribute("href") }));
      continue;
    }
    if (lead.startsWith("kimleri ilgilendiriyor")) {
      r.aud = el.textContent.replace(/^[^:]*:\s*/, "").split(/\s*,\s*/).map(x => x.trim()).filter(Boolean);
      continue;
    }
    if (lead.startsWith("geçiş hükmü")) { r.trans.push(afterLead(el)); continue; }
    if (t === "p" && !r.details.length) r.lead.push(el);
    else r.details.push(el);
  }
  return r;
}
/** Ayrıntı listesi: "Soru – …?" satırları soru-cevap kutusu olur */
function detailsHtml(nodes) {
  let s = "", faq = false, cmp = false;
  for (const el of nodes) {
    const t = tag(el);
    if (t === "ul" || t === "ol") {
      let lis = "", seen = false;
      for (const li of [...el.children].filter(c => tag(c) === "li")) {
        const b = boldLead(li);
        if (/^Soru\s*[–-]/.test(b)) {
          if (!seen) { lis += `<li class="faq-h">Sıkça sorulanlar</li>`; seen = true; }
          const c = li.cloneNode(true);
          const bb = c.querySelector("b,strong");
          bb.textContent = bb.textContent.replace(/^Soru\s*[–-]\s*/, "");
          lis += `<li class="faq">${inl(c)}</li>`;
          faq = true;
        } else lis += `<li>${inl(li)}</li>`;
      }
      s += `<${t}>${lis}</${t}>`;
    } else if (t === "table") {
      const h = table(el);
      if (h.startsWith(`<div class="cmp">`)) cmp = true;
      s += h;
    } else s += block(el);
  }
  const hint = [cmp ? "Karşılaştırma" : "", faq ? "Sıkça sorulanlar" : ""].filter(Boolean).join(", ");
  return { html: s, hint };
}
/** Mevzuat sitesinde düzenlemenin güncel hâlini arar (arşiv günlerinde) */
function currentQuery(title) {
  return title.replace(/\s*\([^)]*\)\s*$/, "").replace(/(?:nde|nda|de|da) Değişiklik Yapılmasına Dair.*$/i, "").trim();
}
/** Güncel hâli yalnızca kalıcı düzenlemeler için anlamlı (atama, ilan, tek seferlik kararlar değil) */
const hasCurrent = (g, title) => ["kanun", "yon", "teb", "gen"].includes(g.kind) ||
  (g.kind === "karar" && /yönetmelik|esas|usul|tarife|karar(?:name)?$/i.test(currentQuery(title)) && !/atama/i.test(title));
function itemHtml(item, g, n, archive) {
  const p = itemParts(item);
  const pers = p.pers || p.aud.length > 0;
  let chips = "";
  if (pers) chips += `<span class="tagp">${ic("person")}Personel</span>`;
  if (p.kurum) chips += `<span class="mchip m-kurum">${ic("bank")}${esc(p.kurum)}</span>`;
  if (p.yur) chips += /yayımı tarihinde/i.test(p.yur) ? `<span class="m-now">Yayımı tarihinde yürürlükte</span>`
    : `<span class="mchip m-yur">${ic("cal")}Yürürlük: ${esc(p.yur)}</span>`;
  for (const a of p.aud) chips += `<span class="mchip m-aud">${esc(a)}</span>`;
  let s = `<article class="card item${pers ? " pers" : ""}" id="m-${n}">` + (chips ? `<div class="meta-chips">${chips}</div>` : "") +
    `<h4>${esc(item.title)}</h4>`;
  for (const t of p.trans) s += `<div class="trans-box">${ic("warn")}<div><b class="h">Geçiş hükmü</b>${t}</div></div>`;
  if (p.lead.length) s += `<div class="body">${p.lead.map(block).join("")}</div>`;
  const ek = p.ekler.map(e => `<a class="ek" href="${esc(e.h)}" target="_blank" rel="noopener">${ic("attach")}${esc(e.t)}</a>`).join("");
  if (p.details.length) {
    const d = detailsHtml(p.details);
    s += `<details><summary><span class="sp"><span class="t"${d.hint ? ` data-ipucu="${esc(d.hint)}"` : ""}></span>${ic("expand")}</span>${ek}</summary>` +
      `<div class="body">${d.html}</div></details>`;
  } else if (ek) s += `<div class="ek-row">${ek}</div>`;
  const kind = /\.pdf(\?|$)/i.test(item.href) ? "PDF" : "HTM";
  s += `<div class="item-actions">` +
    (/^https?:\/\//.test(item.href) ? `<a class="src" href="${esc(item.href)}" target="_blank" rel="noopener"><span class="tag">${kind}</span>Tam metin</a>` : "<span></span>") +
    `<span class="acts">` +
    (archive && hasCurrent(g, item.title) ? `<a class="act cur" href="https://www.mevzuat.gov.tr/aramasonuc?AranacakMetin=${encodeURIComponent(currentQuery(item.title))}" target="_blank" rel="noopener">${ic("search")}Güncel hâli</a>` : "") +
    `</span></div></article>`;
  return s;
}
function maddeler(sec, groups, archive) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  let s = `<section id="sec-mad" class="sec sec-mad"><h2 class="free"><span class="ic">${ic("list")}</span>${esc(sec.title)}` +
    (total ? `<span class="cnt">${total}</span>` : "") + `</h2>`;
  if (groups.length > 1) {
    s += `<nav class="grp-strip">` + groups.map((g, i) =>
      `<a class="gs k-${g.kind}" href="#g-${i}">${ic(KIND_ICON[g.kind])}${esc(g.label.replace(/^\d+\. Mükerrer Sayı — /, "M · "))}<b>${groupCount(g)}</b></a>`).join("") + `</nav>`;
  }
  let n = 0;
  groups.forEach((g, i) => {
    s += `<div class="grp k-${g.kind}" id="g-${i}"><h3><span class="chip">${ic(KIND_ICON[g.kind])}${esc(g.label)}</span><span class="n">${groupCount(g)}</span></h3>`;
    for (const it of g.items) s += itemHtml(it, g, ++n, archive);
    if (g.extra.length) {
      const lists = g.extra.filter(el => ["ul", "ol"].includes(tag(el)));
      const others = g.extra.filter(el => !["ul", "ol"].includes(tag(el)));
      if (others.length) s += `<div class="card pad">${others.map(block).join("")}</div>`;
      for (const ul of lists) {
        s += `<div class="card"><ul class="plain">` + [...ul.children].map(li => {
          const a = li.querySelector("a[href]");
          return a && /^https?:\/\//.test(a.getAttribute("href"))
            ? `<li><a href="${esc(a.getAttribute("href"))}" target="_blank" rel="noopener">${esc(li.textContent.trim())}</a></li>`
            : `<li>${inl(li)}</li>`;
        }).join("") + `</ul></div>`;
      }
    }
    s += `</div>`;
  });
  return s + `</section>`;
}

// ------------------------------------------------------------------ gün sayfası

function donut(groups) {
  const parts = groups.map((g, i) => ({ g, i, n: groupCount(g) })).filter(x => x.n > 0);
  const total = parts.reduce((a, x) => a + x.n, 0);
  if (!total) return "";
  const dark = isDark() ? 1 : 0;
  let pos = 0, stops = [];
  for (const x of parts) {
    const c = KIND_COLOR[x.g.kind][dark];
    const a = (pos / total) * 100, b = ((pos + x.n) / total) * 100;
    stops.push(`${c} ${a.toFixed(2)}% ${(b - (parts.length > 1 ? 0.6 : 0)).toFixed(2)}%`);
    if (parts.length > 1) stops.push(`transparent ${(b - 0.6).toFixed(2)}% ${b.toFixed(2)}%`);
    pos += x.n;
  }
  return `<section id="sec-dag" class="card sec sec-dag"><h2><span class="ic">${ic("pie")}</span>Bu sayıda neler var?</h2>` +
    `<div class="dag"><div class="donut" style="background:conic-gradient(${stops.join(",")})"><div><b>${total}</b><span>başlık</span></div></div>` +
    `<ul class="leg">` + parts.map(x => `<li><a href="#g-${x.i}"><i style="background:${KIND_COLOR[x.g.kind][dark]}"></i><span>${esc(x.g.label)}</span><b>${x.n}</b></a></li>`).join("") +
    `</ul></div></section>`;
}

function stats(list) {
  const tiles = list.filter(x => x.n > 0).map(x => `<a class="stat ${x.c}" href="${x.h}"><b>${x.n}</b><span>${x.t}</span></a>`);
  if (!tiles.length) return "";
  let s = `<div class="stats">`;
  for (let i = 0; i < tiles.length; i += 2) s += `<div class="pair${tiles.length - i === 1 ? " one" : ""}">${tiles.slice(i, i + 2).join("")}</div>`;
  return s + `</div>`;
}

function neighbours(k) {
  const all = INDEX.tarihler; // yeniden eskiye
  let older = "", newer = "";
  for (const d of all) {
    if (d < k && (!older || d > older)) older = d;
    if (d > k && (!newer || d < newer)) newer = d;
  }
  return { older, newer };
}
function daynav(k) {
  const { older, newer } = neighbours(k);
  const side = (d, cls, label) => d
    ? `<a class="${cls}" href="${dayUrl(d)}" data-nav>${ic("arrow")}<span><b>${label}</b><small>${shortOf(d)}</small></span></a>` : `<span></span>`;
  return `<nav class="daynav">${side(older, "dn-prev", "Önceki gün")}` +
    `<a class="dn-hist" href="?gecmis" data-nav>${ic("history")}<span><b>Geçmiş</b><small>Tüm günler</small></span></a>` +
    `${side(newer, "dn-next", "Sonraki gün")}</nav>`;
}
function calBadge(k) {
  return `<a class="cal" href="?gecmis#tarih" data-nav title="Tarih seç"><span class="cal-m">${up(monOf(k))}</span>` +
    `<span class="cal-d">${dayOf(k)}</span><span class="cal-w">${up(wdOf(k).slice(0, 3))}</span><span class="cal-pick">${ic("cal")}</span></a>`;
}

function setMeta(title, desc, url) {
  document.title = title;
  const d = document.querySelector('meta[name="description"]');
  if (d && desc) d.setAttribute("content", desc);
  const c = document.querySelector('link[rel="canonical"]');
  if (c) c.setAttribute("href", new URL(url, location.href).href);
}

async function showDay(k, q) {
  if (!k) k = INDEX.guncel;
  if (!INDEX.tarihler.includes(k)) return showMissing(k);
  loading("Özet yükleniyor…");
  let html;
  try { html = await loadDay(k); } catch (e) { return showError(e, () => showDay(k, q)); }
  const d = parse(html);
  const archive = isArchive(k) || !!d.archive;
  const groups = [];
  const secs = d.sections.map(s => {
    if (s.kind === "mad") { s.groups = groupsOf(s.nodes); groups.push(...s.groups); }
    return s;
  });
  const items = groups.reduce((n, g) => n + g.items.length, 0);
  const one = secs.find(s => s.kind === "one");
  const hl = one ? one.nodes.filter(el => ["ul", "ol"].includes(tag(el))).reduce((n, el) => n + el.children.length, 0) : 0;
  const ata = secs.find(s => s.kind === "ata");
  const ataN = ata ? appointmentRows(ata.nodes).length : 0;
  const ozet = secs.find(s => s.kind === "ozet");

  let s = "";
  if (q) s += hitBar(k, q);
  s += `<section class="card hero"><div class="hero-top">${calBadge(k)}<div class="hero-txt">` +
    `<div class="kicker">RESMÎ GAZETE ÖZETİ</div><h1>${longOf(k)}</h1>` +
    `<div class="sub">${wdOf(k)}${d.issue ? `<span class="pill">Sayı ${esc(d.issue)}</span>` : ""}</div></div>` +
    `<button class="share" type="button" aria-label="Paylaş" title="Paylaş">${ic("share")}</button></div>` +
    daynav(k) +
    stats([
      { n: items, t: "düzenleme", c: "s1", h: "#sec-mad" }, { n: hl, t: "öne çıkan", c: "s2", h: "#sec-one" },
      { n: groups.length, t: "bölüm", c: "s3", h: "#sec-dag" }, { n: ataN, t: "atama", c: "s4", h: "#sec-ata" },
    ]);
  if (archive) {
    // "Arşiv özeti — bu özet …" → başlık ayrı yazıldığı için yalnızca açıklama
    let note = (d.archive || "").replace(/^(Arşiv özeti|Personel arşivi)\s*[—–-]?\s*/i, "").trim() ||
      "bu özet sayının yayımından sonra yazılmıştır; düzenlemeler bu tarihten sonra değiştirilmiş ya da yürürlükten kaldırılmış olabilir.";
    note = up(note.charAt(0)) + note.slice(1);
    s += `<div class="hero-arsiv">${ic("archive")}<div><b>Arşiv özeti</b>${esc(note)}</div></div>`;
  }
  if (ataN) s += `<a class="hero-ata" href="#sec-ata">${ic("group")}<span>${ataN} atama kararı · Atamalar'a git</span><span class="go">›</span></a>`;
  const official = d.official || `https://www.resmigazete.gov.tr/eskiler/${k.slice(0, 4)}/${k.slice(4, 6)}/${k}.htm`;
  s += `<a class="cta" href="${esc(official)}" target="_blank" rel="noopener"><span class="cta-ic">${ic("bank")}</span>` +
    `<span class="cta-tx"><b>Resmî Gazete'de aç</b><small>Sayının aslı · resmigazete.gov.tr</small></span><span class="cta-go">${ic("arrow")}</span></a></section>`;

  for (const sec of secs) {
    if (sec.kind === "ozet") {
      s += `<section id="sec-ozet" class="card sec sec-ozet"><h2><span class="ic">${ic("doc")}</span>${esc(sec.title)}` +
        ("speechSynthesis" in window ? `<button class="tts-btn" type="button">${ic("vol")}<span>Dinle</span></button>` : "") +
        `</h2>${sec.nodes.map(block).join("")}</section>`;
      s += donut(groups);
    } else if (sec.kind === "one") {
      s += `<section id="sec-one" class="sec sec-one"><h2 class="free"><span class="ic">${ic("star")}</span>${esc(sec.title)}` +
        (hl ? `<span class="cnt">${hl}</span>` : "") + `</h2>` +
        sec.nodes.map(el => ["ul", "ol"].includes(tag(el))
          ? `<ol class="hl">${[...el.children].map(li => `<li>${inl(li)}</li>`).join("")}</ol>` : `<div class="card pad">${block(el)}</div>`).join("") +
        `</section>`;
    } else if (sec.kind === "ata") {
      s += appointments(sec);
    } else if (sec.kind === "mad") {
      s += maddeler(sec, sec.groups, archive);
    } else if (sec.kind === "yor") {
      const body = sec.nodes.filter(el => !(tag(el) === "p" && el.children.length === 1 && tag(el.firstElementChild) === "i" &&
        el.textContent.trim() === el.firstElementChild.textContent.trim()));
      s += `<section id="sec-yor" class="card sec sec-yor"><h2><span class="ic">${ic("spark")}</span>${esc(sec.title)}` +
        `<span class="ai">${ic("spark")}Yapay zekâ yorumu</span></h2>${body.map(block).join("")}` +
        `<p class="note">Bu bölüm yapay zekâ yorumudur, hukuki danışmanlık değildir.</p></section>`;
    } else {
      s += `<section class="card sec sec-dig"><h2><span class="ic">${ic("doc")}</span>${esc(sec.title)}</h2>${sec.nodes.map(block).join("")}</section>`;
    }
  }
  s += `<p class="note src-note">Özetler yapay zekâ ile hazırlanır ve hata içerebilir; bağlayıcı olan Resmî Gazete'de yayımlanan metindir.</p>`;
  $app.innerHTML = s;

  const lead = ozet ? ozet.nodes.map(el => el.textContent.trim()).join(" ") : "";
  setMeta(`${longOf(k)} Resmî Gazete özeti${d.issue ? ` · Sayı ${d.issue}` : ""} | Özet RG`,
    lead ? lead.slice(0, 158) + (lead.length > 158 ? "…" : "") : `${longOf(k)} tarihli Resmî Gazete'nin özeti.`, dayUrl(k));

  wireDay(k, d, ozet);
  setupFilters();
  const ww = watchWords();
  if (ww.length) {
    let hits = 0;
    $app.querySelectorAll(".item").forEach(it => {
      const text = low(it.textContent);
      const m = ww.filter(w => text.includes(low(w)));
      if (!m.length) return;
      hits++;
      const chips = it.querySelector(".meta-chips") || it.insertAdjacentElement("afterbegin", Object.assign(document.createElement("div"), { className: "meta-chips" }));
      chips.insertAdjacentHTML("beforeend", `<span class="mchip m-radar">🎯 <b>${esc(m.join(", "))}</b></span>`);
    });
    if (hits) $app.querySelector(".hero").insertAdjacentHTML("beforeend", `<a class="hero-cal" href="#" data-radar>🎯 <span>Takip ettiğiniz kelime ${hits} maddede geçiyor</span></a>`);
    const jump = $app.querySelector("[data-radar]");
    if (jump) jump.addEventListener("click", e => { e.preventDefault(); const f = $app.querySelector(".item .m-radar"); if (f) f.closest(".item").scrollIntoView({ block: "center" }); });
  }
  if (q) highlight(q);
}

/** Gün sayfasındaki 🔎 SÜZGEÇ ve 🏛️ KURUM satırları (uygulamadakinin web hâli): tür, personel ve kuruma göre madde süzme. */
function setupFilters() {
  const sec = $app.querySelector("#sec-mad");
  const items = [...$app.querySelectorAll("#sec-mad .item")];
  if (!sec || items.length < 3) return;
  const info = items.map(el => ({
    el, grp: el.closest(".grp"), pers: el.classList.contains("pers"),
    kind: ((el.closest(".grp") || {}).className.match(/k-(\w+)/) || [])[1] || "diger",
    kurum: (el.querySelector(".m-kurum") || {}).textContent || "",
  }));
  const kinds = [...new Set(info.map(x => x.kind))];
  const kur = {};
  info.forEach(x => { if (x.kurum) kur[x.kurum] = (kur[x.kurum] || 0) + 1; });
  const kurList = Object.entries(kur).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const hasPers = info.some(x => x.pers);
  const st = { pers: pref("personel") === "1" && hasPers, kinds: new Set(), kurum: "" };
  const row = $app.querySelector("#sec-mad .grp-strip");
  const html = `<div class="tur-row site-flt"><span class="tur-k">🔎 SÜZGEÇ</span><button type="button" class="tur-c tur-all" data-f="all">Tümü</button>` +
    (hasPers ? `<button type="button" class="tur-c" data-f="pers">👤 Personel<b>${info.filter(x => x.pers).length}</b></button>` : "") +
    kinds.map(k => `<button type="button" class="tur-c" data-f="k:${k}">${esc(KIND_LABEL[k] || k)}<b>${info.filter(x => x.kind === k).length}</b></button>`).join("") + `</div>` +
    (kurList.length ? `<div class="kur-row site-flt"><span class="kur-k">🏛️ KURUM</span>` + kurList.map(([k, n]) => `<button type="button" class="kur-c" data-f="u:${esc(k)}">${esc(k)}<b>${n}</b></button>`).join("") + `</div>` : "") +
    `<div class="flt-end site-fend"><span></span><button type="button" data-f="all">Süzgeçleri kaldır</button></div>`;
  (row || sec.querySelector("h2")).insertAdjacentHTML("afterend", html);
  const apply = () => {
    let shown = 0;
    info.forEach(x => {
      const ok = (!st.pers || x.pers) && (!st.kinds.size || st.kinds.has(x.kind)) && (!st.kurum || x.kurum === st.kurum);
      x.el.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    $app.querySelectorAll("#sec-mad .grp").forEach(g => {
      const its = [...g.querySelectorAll(".item")];
      g.style.display = its.length && its.every(i => i.style.display === "none") ? "none" : "";
    });
    $app.querySelectorAll("#sec-mad .grp-strip .gs").forEach(a => {
      const g = $app.querySelector(a.getAttribute("href"));
      a.style.display = g && g.style.display === "none" ? "none" : "";
    });
    const any = st.pers || st.kinds.size || st.kurum;
    sec.querySelectorAll(".site-flt button").forEach(b => {
      const f = b.dataset.f;
      const on = f === "pers" ? st.pers : f.startsWith("k:") ? st.kinds.has(f.slice(2)) : f.startsWith("u:") ? st.kurum === f.slice(2) : false;
      b.classList.toggle("on", on);
      if (f === "all") b.classList.toggle("off", !!any);
    });
    const end = sec.querySelector(".site-fend");
    end.style.display = any ? "flex" : "none";
    end.querySelector("span").textContent = `${shown} / ${items.length} düzenleme gösteriliyor`;
  };
  sec.addEventListener("click", e => {
    const b = e.target.closest(".site-flt button, .site-fend button");
    if (!b) return;
    const f = b.dataset.f;
    if (f === "all") { st.pers = false; st.kinds.clear(); st.kurum = ""; }
    else if (f === "pers") st.pers = !st.pers;
    else if (f.startsWith("k:")) { const k = f.slice(2); st.kinds.has(k) ? st.kinds.delete(k) : st.kinds.add(k); }
    else if (f.startsWith("u:")) st.kurum = st.kurum === f.slice(2) ? "" : f.slice(2);
    apply();
  });
  apply();
}

function wireDay(k, d, ozet) {
  const tts = $app.querySelector(".tts-btn");
  if (tts && ozet) {
    const set = on => { tts.innerHTML = ic(on ? "stop" : "vol") + `<span>${on ? "Durdur" : "Dinle"}</span>`; };
    tts.addEventListener("click", () => {
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); set(false); return; }
      const u = new SpeechSynthesisUtterance(ozet.nodes.map(el => el.textContent.trim()).join(" "));
      u.lang = "tr-TR";
      const v = speechSynthesis.getVoices().find(x => low(x.lang || "").startsWith("tr"));
      if (v) u.voice = v;
      u.onend = u.onerror = () => set(false);
      speechSynthesis.speak(u);
      set(true);
    });
  }
  const share = $app.querySelector(".share");
  if (share) {
    share.addEventListener("click", async () => {
      const url = new URL(dayUrl(k), location.href).href;
      const title = `${longOf(k)} Resmî Gazete özeti`;
      if (navigator.share) { try { await navigator.share({ title, url }); } catch (e) { /* vazgeçildi */ } return; }
      try { await navigator.clipboard.writeText(url); toast("Bağlantı kopyalandı"); } catch (e) { prompt("Bağlantı:", url); }
    });
  }
}

/** Aranan kelimeler sayfada işaretlenir; kapalı ayrıntılardaki eşleşmeler açılır */
function trPattern(tok) {
  return [...tok].map(ch => {
    if (ch === "i" || ch === "İ") return "[iİ]";
    if (ch === "ı" || ch === "I") return "[ıI]";
    if (/[\p{L}]/u.test(ch)) return `[${ch}${up(ch)}]`;
    return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
}
function queryTokens(q) {
  return [...new Set((low(q).match(/[\p{L}\p{N}]+/gu) || []).map(w => w.slice(0, KOK)))];
}
function highlight(q) {
  const words = [...new Set(low(q).match(/[\p{L}\p{N}]+/gu) || [])];
  if (!words.length) return;
  const B = "(?<![\\p{L}\\p{N}])", E = "(?![\\p{L}\\p{N}])", W = "[\\p{L}\\p{N}]*";
  // Birden çok kelime varsa önce ifadenin kendisi aranır ("tek ders"); yoksa kelimeler tek tek. Kısa
  // kelimeler (3 harf ve altı) yalnızca kendisi olarak işaretlenir, "tek" "Teknik"i işaretlemesin.
  const phrase = words.length > 1 ? new RegExp(B + words.map(trPattern).join("[^\\p{L}\\p{N}]+") + W, "gu") : null;
  const each = new RegExp(B + "(?:" + words.map(w => w.length >= 4 ? trPattern(w.slice(0, KOK)) + W : trPattern(w) + E).join("|") + ")", "gu");
  const re = phrase && phrase.test($app.textContent) ? phrase : each;
  re.lastIndex = 0;
  const walker = document.createTreeWalker($app, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.parentElement.closest(".hero,.hitbar,svg,script,style") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let count = 0;
  for (const node of nodes) {
    const text = node.nodeValue;
    re.lastIndex = 0;
    if (!re.test(text)) continue;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = re.exec(text))) {
      frag.append(text.slice(last, m.index));
      const mk = document.createElement("mark");
      mk.className = "hit";
      mk.textContent = m[0];
      frag.append(mk);
      last = m.index + m[0].length;
      count++;
    }
    frag.append(text.slice(last));
    node.replaceWith(frag);
  }
  $app.querySelectorAll("mark.hit").forEach(m => { const det = m.closest("details"); if (det) det.open = true; });
  const n = $app.querySelector(".hitbar .hn");
  if (n) n.textContent = count ? `${count} eşleşme` : "bu sayfada geçmiyor";
  const first = $app.querySelector("mark.hit");
  if (first) setTimeout(() => first.scrollIntoView({ block: "center" }), 60);
}
function hitBar(k, q) {
  return `<div class="hitbar card">${ic("search")}<span><b>“${esc(q)}”</b><small class="hn"></small></span>` +
    `<a href="?ara=${encodeURIComponent(q)}" data-nav>Sonuçlar</a><a class="x" href="${dayUrl(k)}" data-nav aria-label="Aramayı kapat">${ic("close")}</a></div>`;
}

function showMissing(k) {
  const ok = k && k >= "20000101";
  $app.innerHTML = `<section class="card hero">` + (ok ? `<div class="hero-top">${calBadge(k)}<div class="hero-txt"><div class="kicker">RESMÎ GAZETE ÖZETİ</div>` +
    `<h1>${longOf(k)}</h1><div class="sub">${wdOf(k)}</div></div></div>` + daynav(k) : "") +
    `<div class="empty"><b>Bu günün özeti henüz yok</b><p>${k > (INDEX.guncel || "") ? "Bu sayı henüz yayımlanmadı ya da özeti hazırlanıyor." :
      "Arşiv 2020'ye doğru geriye dönük dolduruluyor; bu gün henüz yazılmadı. Sayının aslına Resmî Gazete'den bakabilirsiniz."}</p></div>` +
    (ok ? `<a class="cta" href="https://www.resmigazete.gov.tr/eskiler/${k.slice(0, 4)}/${k.slice(4, 6)}/${k}.htm" target="_blank" rel="noopener">` +
      `<span class="cta-ic">${ic("bank")}</span><span class="cta-tx"><b>Resmî Gazete'de aç</b><small>O günün fihristi · resmigazete.gov.tr</small></span>` +
      `<span class="cta-go">${ic("arrow")}</span></a>` : "") + `</section>`;
  setMeta("Özet bulunamadı | Özet RG", "", ok ? dayUrl(k) : "./");
}

// ------------------------------------------------------------------ geçmiş ve arama

async function showList(q, tur) {
  loading("Günler yükleniyor…");
  try { await loadParts(); } catch (e) { return showError(e, () => showList(q, tur)); }
  const all = INDEX.tarihler.slice().sort().reverse();
  const arch = new Set(INDEX.arsiv_gunleri || []);
  const total = Math.round((ARSIV_SON - ARSIV_BAS) / 864e5) + 1;
  const done = arch.size;
  const years = [...new Set(all.map(k => k.slice(0, 4)))];
  const today = keyOf(Date.now() + 3 * 3600e3);

  $app.innerHTML = `<section class="card lst"><h1>Geçmiş özetler</h1><p class="lst-sub">${sayi(all.length)} günün özeti · en yenisi ${longOf(INDEX.guncel)}</p>` +
    `<form class="srch" role="search">${ic("search")}<input type="search" name="ara" placeholder="Tüm özetlerde ara… (ör. ikamet izni, rektör)" value="${esc(q)}" autocomplete="off" enterkeyhint="search">` +
    `<button type="submit">Ara</button></form>` +
    `<div class="lst-chips">` +
    [["", "Tümü"], ["gunluk", "📰 Günlük"], ["arsiv", "🗄️ Arşiv"]].map(([v, t]) =>
      `<a class="fchip${tur === v ? " on" : ""}" href="?gecmis${v ? `&tur=${v}` : ""}${q ? `&ara=${encodeURIComponent(q)}` : ""}" data-nav data-keep>${t}</a>`).join("") +
    `<label class="fchip date" id="tarih">${ic("cal")}Tarih seç<input type="date" min="2000-01-01" max="${isoOf(today)}"></label></div>` +
    `<div class="arsiv-bar"><div><span>🗄️ <b>Arşiv</b> · 2020'den bu yana</span><span>${sayi(done)} / ${sayi(total)} gün</span></div>` +
    `<i><s style="width:${Math.max(1, (done / total) * 100).toFixed(2)}%"></s></i></div>` +
    (years.length > 1 ? `<div class="years">${years.map(y => `<a class="yr" href="#y-${y}">${y}</a>`).join("")}</div>` : "") +
    `</section><div id="days"></div>`;

  const form = $app.querySelector(".srch"), input = form.querySelector("input");
  let timer = 0;
  const apply = (push) => {
    const v = input.value.trim();
    const url = `?${v ? `ara=${encodeURIComponent(v)}` : "gecmis"}${tur ? `&tur=${tur}` : ""}`;
    history[push ? "pushState" : "replaceState"](null, "", url);
    lastSearch = location.search;
    renderDays(v, tur);
    $app.querySelectorAll(".fchip[data-keep]").forEach(a => {
      const u = new URL(a.getAttribute("href"), location.href);
      if (v) u.searchParams.set("ara", v); else u.searchParams.delete("ara");
      a.setAttribute("href", u.search);
    });
  };
  form.addEventListener("submit", e => { e.preventDefault(); clearTimeout(timer); apply(true); input.blur(); });
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => apply(false), 250); });
  const date = $app.querySelector('input[type="date"]');
  date.addEventListener("change", e => { if (e.target.value) go(dayUrl(normKey(e.target.value))); });
  // Masaüstü tarayıcılarda takvimi açmak için (dokunulan yer görünmez tarih kutusu)
  date.addEventListener("click", () => { try { date.showPicker(); } catch (e) { /* desteklenmiyor */ } });
  renderDays(q, tur);
  setMeta(q ? `“${q}” araması | Özet RG` : "Geçmiş özetler | Özet RG", "Resmî Gazete özetlerinin tamamı: günlere göre liste ve arama.", "?gecmis");
  if (new URLSearchParams(location.search).has("ara") && !q) input.focus();
  if (location.hash === "#tarih") $app.querySelector("#tarih").scrollIntoView({ block: "center" });
}

function renderDays(q, tur) {
  const box = document.getElementById("days");
  const arch = new Set(INDEX.arsiv_gunleri || []);
  let days = INDEX.tarihler.slice().sort().reverse();
  if (tur === "arsiv") days = days.filter(k => arch.has(k));
  else if (tur === "gunluk") days = days.filter(k => !arch.has(k));
  if (pref("personel") === "1") days = days.filter(k => PARTS[k] && PARTS[k].personel);
  const toks = q ? queryTokens(q) : [];
  if (toks.length) days = days.filter(k => PARTS[k] && toks.every(t => (PARTS[k].metin || "").includes(t)));
  const perMonth = {};
  for (const k of days) perMonth[k.slice(0, 6)] = (perMonth[k.slice(0, 6)] || 0) + 1;
  let s = pref("personel") === "1" ? `<a class="card web fltnote" href="?araclar" data-nav>${ic("person")}<span><b>Sadece Personel açık</b><small>Yalnızca kamu personeline ilişkin düzenleme olan günler · Araçlar'dan değiştir</small></span>${ic("chev")}</a>` : "";
  if (q) {
    s += `<p class="res">${days.length ? `<b>“${esc(q)}”</b> ${sayi(days.length)} günün özetinde geçiyor` : `<b>“${esc(q)}”</b> için özet bulunamadı`}</p>`;
    if (!days.length) {
      s += `<a class="card web" href="https://www.google.com/search?q=${encodeURIComponent(`"${q}" site:resmigazete.gov.tr`)}" target="_blank" rel="noopener">` +
        `${ic("search")}<span><b>Bütün Resmî Gazete arşivinde ara</b><small>resmigazete.gov.tr içinde web araması</small></span>${ic("chev")}</a>`;
    }
  } else if (!days.length) s += `<p class="res">Bu süzgece uyan gün yok.</p>`;
  let month = "", year = "";
  for (const k of days) {
    const m = k.slice(0, 6);
    if (m !== month) {
      if (month) s += `</div>`;
      month = m;
      const y = k.slice(0, 4);
      s += `<div class="mblk"><h3 class="mon"${y !== year ? ` id="y-${y}"` : ""}>${ic("cal")}${monOf(k)} ${y}<span>${perMonth[m]} gün</span></h3>`;
      year = y;
    }
    const p = PARTS[k] || {};
    const a = arch.has(k);
    const bits = [wdOf(k)];
    if (p.sayi) bits.push(`Sayı ${esc(p.sayi)}`);
    bits.push(a ? "🗄️ Arşiv özeti" : p.duzenleme ? `${p.duzenleme} düzenleme` : "");
    if (p.personel) bits.push("👤 Personel");
    if (watchWords().some(w => queryTokens(w).every(t => (p.metin || "").includes(t)))) bits.push("🎯 Takibinizde");
    s += `<a class="day card${a ? " arc" : ""}" href="${dayUrl(k, q)}" data-nav><span class="dcal"><i>${mon3(k)}</i><b>${dayOf(k)}</b></span>` +
      `<span class="dtx"><b>${longOf(k)}</b><small>${bits.filter(Boolean).join(" · ")}</small>` +
      (p.onizleme ? `<span class="pv">${esc(p.onizleme)}</span>` : "") + `</span>${ic("chev")}</a>`;
  }
  if (month) s += `</div>`;
  box.innerHTML = s;
}

// ------------------------------------------------------------------ tercihler ve Araçlar (uygulamadaki Araçlar ve Ayarlar'ın web uyarlaması)

const pref = (k, d = "") => { try { const v = localStorage.getItem("ayar_" + k); return v === null ? d : v; } catch (e) { return d; } };
const setPref = (k, v) => { try { localStorage.setItem("ayar_" + k, v); } catch (e) { /* gizli sekme */ } };
const FONTS = [["0.92", "Küçük"], ["1", "Normal"], ["1.12", "Büyük"], ["1.26", "Çok büyük"]];
const watchWords = () => pref("takip", "").split("|").map(x => x.trim()).filter(Boolean);
const setWatch = list => setPref("takip", [...new Set(list.map(x => x.trim()).filter(Boolean))].join("|"));
function applyFont() { $app.style.zoom = pref("yazi", "1"); }

function showTools() {
  const t = theme(), f = pref("yazi", "1");
  const pers = pref("personel") === "1";
  $app.innerHTML = `<a class="back" href="./" data-nav>${ic("arrow")}Özete dön</a>` +
    `<div class="tl-head"><span class="ic">${ic("list")}</span><div><h1>Araçlar ve Ayarlar</h1><p>Görünüm, yazı boyutu ve süzgeçler</p></div></div>` +
    `<section class="card sec ab-theme"><h2><span class="ic">${ic("moon")}</span>Görünüm</h2><div class="seg">` +
    [["sistem", "🌓 Sistem"], ["acik", "☀️ Açık"], ["koyu", "🌙 Koyu"]].map(([k, l]) => `<a href="#" data-tema="${k}"${t === k ? ` class="on"` : ""}>${l}</a>`).join("") +
    `</div><p class="hint">Sistem: cihazınızın ayarını izler.</p></section>` +
    `<section class="card sec"><h2><span class="ic">${ic("doc")}</span>Yazı boyutu</h2><div class="seg site-fs">` +
    FONTS.map(([k, l]) => `<a href="#" data-yazi="${k}"${f === k ? ` class="on"` : ""} style="font-size:${13 * +k}px">${l}</a>`).join("") +
    `</div><p class="hint">Özet sayfaları bu boyutla gösterilir.</p></section>` +
    `<section class="card sec tl-filter"><h2><span class="ic">${ic("list")}</span><span class="t">Süzgeçler<small>Açıp kapatın; seçimler bu tarayıcıda saklanır</small></span></h2>` +
    `<div class="flt-grid"><a href="#" data-flt="personel" class="${pers ? "on" : ""}" style="--fc:#0B6B63"><span class="e">👤</span><span class="l">Sadece Personel<small>Geçmiş ve arama</small></span>${pers ? `<span class="ok">✓</span>` : ""}</a></div>` +
    `<p class="hint">Açıkken Geçmiş listesinde, aramada, Yürürlük Takvimi'nde ve gün sayfalarının açılışında yalnızca kamu personeline ilişkin düzenlemeler gösterilir.</p></section>` +
    `<section class="card sec"><h2><span class="ic">🎯</span><span class="t">Takip kelimeleri<small>Bildirim Radarı'nın web hâli</small></span></h2>` +
    `<form class="srch site-watch" autocomplete="off"><input type="text" name="k" placeholder="Takip etmek istediğiniz kelime (ör. ikamet izni)" maxlength="40"><button type="submit">Ekle</button></form>` +
    `<div class="tags site-wtags">${watchWords().map(w => `<span class="tg1">${esc(w)} <a href="#" data-wdel="${esc(w)}" aria-label="Kaldır">✕</a></span>`).join("") || `<span class="hint">Henüz kelime yok.</span>`}</div>` +
    `<p class="hint">Takip ettiğiniz kelime bir günün özetinde geçerse Geçmiş listesinde "🎯 Takibinizde" etiketi çıkar ve gün sayfasında ilgili madde işaretlenir. Kelimeler yalnızca bu tarayıcıda saklanır.</p></section>` +
    `<section class="card links"><a href="?takvim" data-nav><span class="e">📅</span><span class="l">Yürürlük Takvimi</span><span class="go">›</span></a><a href="?bulten=7" data-nav><span class="e">📊</span><span class="l">Haftalık ve Aylık Bülten</span><span class="go">›</span></a></section>`;
  $app.querySelectorAll("[data-tema]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); setTheme(a.dataset.tema);
    $app.querySelectorAll("[data-tema]").forEach(x => x.classList.toggle("on", x === a));
  }));
  $app.querySelectorAll("[data-yazi]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); setPref("yazi", a.dataset.yazi); applyFont();
    $app.querySelectorAll("[data-yazi]").forEach(x => x.classList.toggle("on", x === a));
  }));
  $app.querySelector("[data-flt=personel]").addEventListener("click", e => { e.preventDefault(); setPref("personel", pers ? "0" : "1"); showTools(); });
  $app.querySelector(".site-watch").addEventListener("submit", e => {
    e.preventDefault();
    const v = e.target.k.value.trim();
    if (v) { setWatch([...watchWords(), v]); showTools(); }
  });
  $app.querySelectorAll("[data-wdel]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); setWatch(watchWords().filter(w => w !== a.dataset.wdel)); showTools();
  }));
  setMeta("Araçlar ve Ayarlar | Özet RG", "Görünüm, yazı boyutu ve süzgeçler.", "?araclar");
}


// ------------------------------------------------------------------ Yürürlük Takvimi

const TR_AY = Object.fromEntries(AYLAR.map((a, i) => [low(a), i + 1]));
/** "1 Ocak 2027" (ya da metin içinde geçen ilk tarih) → "20270101" */
function parseTrDate(txt) {
  const t = low(txt);
  const n = t.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (n) return `${n[3]}${n[2].padStart(2, "0")}${n[1].padStart(2, "0")}`;
  const m = t.match(/(\d{1,2})\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s+(\d{4})/);
  return m ? `${m[3]}${String(TR_AY[m[2]]).padStart(2, "0")}${m[1].padStart(2, "0")}` : "";
}
const todayKey = () => keyOf(Date.now() + 3 * 3600e3);
const daysBetween = (a, b) => Math.round((tsOf(b) - tsOf(a)) / 864e5);

function icsOf(title, k) {
  const d = n => keyOf(tsOf(k) + n * 864e5);
  const esc2 = t => t.replace(/[\;,]/g, m => "\\" + m);
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Özet RG//TR", "BEGIN:VEVENT",
    `UID:${k}-${Math.abs([...title].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))}@ozetrg`,
    `DTSTAMP:${todayKey()}T000000Z`, `DTSTART;VALUE=DATE:${k}`, `DTEND;VALUE=DATE:${d(1)}`,
    `SUMMARY:${esc2("Yürürlük: " + title)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}

async function showCalendar() {
  loading("Yürürlük tarihleri taranıyor…");
  try { await loadIndex(); } catch (e) { return showError(e, showCalendar); }
  const today = todayKey();
  const days = INDEX.tarihler.slice().sort().reverse().slice(0, 60);
  const found = [];
  await Promise.all(days.map(async k => {
    let html;
    try { html = await loadDay(k); } catch (e) { return; }
    const d = parse(html);
    for (const sec of d.sections) if (sec.kind === "mad") for (const g of groupsOf(sec.nodes)) for (const it of g.items) {
      const p = itemParts(it);
      const at = parseTrDate(p.yur);
      if (at && at >= today) found.push({ at, day: k, title: it.title, kind: g.kind, kurum: p.kurum, pers: p.pers || p.aud.length > 0, href: it.href });
    }
  }));
  found.sort((a, b) => a.at.localeCompare(b.at) || a.title.localeCompare(b.title, "tr"));
  const only = pref("personel") === "1";
  const list = only ? found.filter(x => x.pers) : found;
  let s = `<a class="back" href="./" data-nav>${ic("arrow")}Özete dön</a><section class="card hero cal-hero"><div class="kicker">YÜRÜRLÜK TAKVİMİ</div>` +
    `<h1>Yürürlüğe girecek düzenlemeler</h1><div class="sub">Son ${days.length} günün özetlerinde yürürlük tarihi ileride olanlar${only ? " · 👤 yalnızca personel" : ""}</div></section>`;
  if (!list.length) s += `<section class="card cal-empty"><div class="big">📅</div><p><b>Yaklaşan yürürlük tarihi yok</b></p><p>Son günlerin özetlerinde ileri tarihli yürürlük bulunmuyor${only ? " (Sadece Personel açık; Araçlar'dan kapatabilirsiniz)" : ""}.</p></section>`;
  let month = "";
  for (const x of list) {
    const m = x.at.slice(0, 6);
    if (m !== month) { month = m; s += `<div class="cal-month">${monOf(x.at)} ${x.at.slice(0, 4)}</div>`; }
    const left = daysBetween(today, x.at);
    const due = left === 0 ? `<span class="due now">Bugün</span>` : left === 1 ? `<span class="due now">Yarın</span>` : `<span class="due${left <= 7 ? " soon" : ""}">${left} gün kaldı</span>`;
    s += `<article class="card up k-${x.kind}${x.pers ? " pers" : ""}"><div class="up-date"><span>${mon3(x.at)}</span><b>${dayOf(x.at)}</b><small>${wdOf(x.at).slice(0, 3)}</small></div>` +
      `<div class="up-body"><div class="up-chips">${due}${x.pers ? `<span class="tagp">${ic("person")}Personel</span>` : ""}</div><h4>${esc(x.title)}</h4>` +
      `<div class="up-src">${x.kurum ? esc(x.kurum) + " · " : ""}${longOf(x.day)} sayısı</div><div class="up-acts">` +
      `<a href="${dayUrl(x.day)}" data-nav>${ic("arrow")}Özete git</a><a class="rem" href="#" data-ics="${esc(x.at + "|" + x.title)}">${ic("cal")}Takvime ekle</a></div></div></article>`;
  }
  $app.innerHTML = s;
  $app.querySelectorAll("[data-ics]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const [at, ...rest] = a.dataset.ics.split("|");
    const url = URL.createObjectURL(new Blob([icsOf(rest.join("|"), at)], { type: "text/calendar" }));
    const dl = document.createElement("a");
    dl.href = url; dl.download = `yururluk-${at}.ics`; document.body.append(dl); dl.click(); dl.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("Takvim dosyası indirildi");
  }));
  setMeta("Yürürlük Takvimi | Özet RG", "Yürürlüğe girecek düzenlemelerin takvimi.", "?takvim");
}

// ------------------------------------------------------------------ Haftalık ve Aylık Bülten

const KIND_LABEL = { kanun: "Kanunlar", yon: "Yönetmelikler", teb: "Tebliğler", karar: "Kararlar", ata: "Atamalar", gen: "Genelgeler", yargi: "Yargı", ilan: "İlanlar", diger: "Diğer" };

async function showBulletin(period) {
  const n = period === 30 ? 30 : 7;
  loading("Bülten hazırlanıyor…");
  try { await loadIndex(); } catch (e) { return showError(e, () => showBulletin(n)); }
  const today = todayKey();
  const from = keyOf(tsOf(today) - (n - 1) * 864e5);
  const days = INDEX.tarihler.filter(k => k >= from && k <= today).sort().reverse();
  const kinds = {}, agencies = {}, pers = [], top = [], highlights = [];
  let regs = 0, ataN = 0;
  await Promise.all(days.map(async k => {
    let html; try { html = await loadDay(k); } catch (e) { return; }
    const d = parse(html);
    for (const sec of d.sections) {
      if (sec.kind === "mad") for (const g of groupsOf(sec.nodes)) for (const it of g.items) {
        regs++; kinds[g.kind] = (kinds[g.kind] || 0) + 1;
        const p = itemParts(it);
        if (p.kurum) agencies[p.kurum] = (agencies[p.kurum] || 0) + 1;
        if (p.pers || p.aud.length) pers.push({ day: k, title: it.title, kurum: p.kurum, aud: p.aud });
      } else if (sec.kind === "one") {
        for (const ul of sec.nodes.filter(el => ["ul", "ol"].includes(tag(el)))) for (const li of ul.children) highlights.push({ day: k, html: inl(li) });
      } else if (sec.kind === "ata") {
        for (const r of appointmentRows(sec.nodes)) { ataN++; if (isSenior(r.position)) top.push({ day: k, position: r.position, nw: r.nw.split("(")[0].trim() }); }
      }
    }
  }));
  const sortByDay = (a, b) => b.day.localeCompare(a.day);
  pers.sort(sortByDay); top.sort(sortByDay); highlights.sort(sortByDay);
  const kList = Object.entries(kinds).sort((a, b) => b[1] - a[1]);
  const aList = Object.entries(agencies).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const dark = isDark() ? 1 : 0;
  const bar = (label, v, max, color) => `<div class="site-bar"><span>${esc(label)}</span><i><s style="width:${Math.max(4, v / max * 100).toFixed(1)}%;background:${color}"></s></i><b>${v}</b></div>`;
  let s = `<a class="back" href="./" data-nav>${ic("arrow")}Özete dön</a><section class="card hero"><div class="kicker">${n === 7 ? "HAFTALIK" : "AYLIK"} BÜLTEN</div>` +
    `<h1>Son ${n} gün</h1><div class="sub">${longOf(from)} – ${longOf(today)}</div>` +
    `<div class="lst-chips">${[7, 30].map(x => `<a class="fchip${x === n ? " on" : ""}" href="?bulten=${x}" data-nav>${x === 7 ? "📅 Haftalık" : "🗓️ Aylık"}</a>`).join("")}</div>` +
    stats([{ n: regs, t: "düzenleme", c: "s1", h: "#b-kur" }, { n: pers.length, t: "personel", c: "s4", h: "#b-per" }, { n: highlights.length, t: "öne çıkan", c: "s2", h: "#b-one" }, { n: top.length, t: "üst düzey atama", c: "s3", h: "#b-ata" }]) + `</section>`;
  if (!days.length) s += `<section class="card cal-empty"><div class="big">📰</div><p>Bu dönemde özet bulunamadı.</p></section>`;
  if (kList.length) s += `<section class="card sec"><h2><span class="ic">${ic("pie")}</span>Türlere göre</h2>${kList.map(([k, v]) => bar(KIND_LABEL[k] || k, v, kList[0][1], KIND_COLOR[k][dark])).join("")}</section>`;
  if (aList.length) s += `<section id="b-kur" class="card sec"><h2><span class="ic">${ic("bank")}</span>En çok düzenleme yayımlayan kurumlar</h2>${aList.map(([k, v]) => bar(k, v, aList[0][1], "#1A56C4")).join("")}</section>`;
  if (pers.length) s += `<section id="b-per" class="card sec"><h2><span class="ic">${ic("person")}</span>Kamu personeline ilişkin<span class="cnt">${pers.length}</span></h2><ul class="plain">` +
    pers.slice(0, 15).map(p => `<li><a href="${dayUrl(p.day)}" data-nav><span><b>${esc(p.title)}</b><br><small>${shortOf(p.day)} · ${esc(p.kurum || "")}${p.aud.length ? " · " + esc(p.aud.join(", ")) : ""}</small></span></a></li>`).join("") + `</ul></section>`;
  if (highlights.length) s += `<section id="b-one" class="sec sec-one"><h2 class="free"><span class="ic">${ic("star")}</span>Öne çıkanlar</h2><ol class="hl">` +
    highlights.slice(0, 10).map(h => `<li>${h.html}<a class="hl-go" href="${dayUrl(h.day)}" data-nav>${shortOf(h.day)} · özete git</a></li>`).join("") + `</ol></section>`;
  if (top.length) s += `<section id="b-ata" class="card sec sec-ata"><h2><span class="ic">${ic("group")}</span>Üst düzey atamalar<span class="cnt">${top.length}</span></h2><div class="ata-list">` +
    top.slice(0, 20).map(t => { const parts = t.position.split(" · "); return `<div class="ata-row top"><div class="ata-pos">${ic("bank")}<span><b>${esc(parts[parts.length - 1])}</b><i class="ata-top">⭐ Üst düzey</i><small>${esc(parts.slice(0, -1).join(" · "))} · ${shortOf(t.day)}</small></span></div><div class="ata-swap"><div class="ata-new"><span class="t">Yeni</span><b>${esc(t.nw || "—")}</b></div></div></div>`; }).join("") + `</div></section>`;
  s += `<button class="site-share" type="button">${ic("share")}Bülteni paylaş</button><p class="note src-note">${ataN} atama kararı satırı, ${days.length} günlük özetten derlendi.</p>`;
  $app.innerHTML = s;
  $app.querySelector(".site-share").addEventListener("click", async () => {
    const text = `📊 Özet RG ${n === 7 ? "Haftalık" : "Aylık"} Bülten (${longOf(from)} – ${longOf(today)})\n${regs} düzenleme · ${pers.length} personel · ${top.length} üst düzey atama\n` +
      aList.slice(0, 5).map(([k, v]) => `• ${k}: ${v}`).join("\n") + `\n${new URL("?bulten=" + n, location.href).href}`;
    if (navigator.share) { try { await navigator.share({ title: "Özet RG Bülten", text }); } catch (e) { /* vazgeçildi */ } return; }
    try { await navigator.clipboard.writeText(text); toast("Bülten kopyalandı"); } catch (e) { prompt("Bülten:", text); }
  });
  setMeta(`${n === 7 ? "Haftalık" : "Aylık"} Bülten | Özet RG`, "Son günlerin düzenleme, personel ve atama özeti.", `?bulten=${n}`);
}

// ------------------------------------------------------------------ hakkında (uygulamadaki Hakkında ile aynı)

function showAbout() {
  const t = theme();
  const link = (href, e, label, attrs = "") =>
    `<a href="${esc(href)}"${attrs}><span class="e">${e}</span><span class="l">${label}</span><span class="go">›</span></a>`;
  $app.innerHTML = `<a class="back" href="./" data-nav>${ic("arrow")}Özete dön</a>` +
    `<section class="card dev"><div class="avatar photo"><img src="gelistirici.jpg" alt="Birol ABANUZOĞLU" width="88" height="88"></div>` +
    `<h1>Birol ABANUZOĞLU</h1><p class="role">Ziraat Mühendisi · Özet RG'nin geliştiricisi</p><div class="tags">` +
    ["Kamu Yönetimi", "Mevzuat", "İnsan Kaynakları", "Tarım Ekonomisi", "Dijital Dönüşüm", "Ankara"]
      .map((x, i) => `<span class="${i % 2 ? "tg2" : "tg1"}">${x}</span>`).join("") + `</div></section>` +
    `<section class="why"><div class="why-k">NEDEN ÖZET RG?</div><blockquote>“Resmî Gazete’yi okumak işimin bir parçası. ` +
    `Özet RG’yi, aynı ihtiyacı duyan herkes için o sabah okumasını birkaç dakikaya indirmek üzere yaptım.”</blockquote></section>` +
    `<h2 class="free"><span class="ic how-ic">${ic("bulb")}</span>Nasıl çalışır?</h2><ol class="how">` +
    `<li>Resmî Gazete gece yarısından sonra yayımlanır; metinler <a href="https://www.resmigazete.gov.tr" target="_blank" rel="noopener">resmigazete.gov.tr</a> adresinden alınır.</li>` +
    `<li>Her başlık kısa ve sade bir özete dönüştürülür, konusuna göre etiketlenir; atamalar ve eski–yeni karşılaştırmaları ayrıca gösterilir.</li>` +
    `<li>Özet her gece bu siteye ve Özet RG Android uygulamasına gelir; asıl metne tek dokunuşla geçersiniz.</li></ol>` +
    `<div class="trans-box ab-warn">${ic("warn")}<div>Resmî bir kamu sitesi değildir. Özetler bilgilendirme amaçlıdır; ` +
    `bağlayıcı olan, Resmî Gazete'de yayımlanan asıl metindir.</div></div>` +
    `<section class="card sec ab-theme"><h2><span class="ic">${ic("moon")}</span>Görünüm</h2><div class="seg">` +
    [["sistem", "🌓 Sistem"], ["acik", "☀️ Açık"], ["koyu", "🌙 Koyu"]]
      .map(([k, l]) => `<a href="#" data-tema="${k}"${t === k ? ` class="on"` : ""}>${l}</a>`).join("") +
    `</div><p class="hint">Sistem: telefonunuzun ya da bilgisayarınızın ayarını izler.</p></section>` +
    `<section class="card links">` +
    link("#", "📤", "Siteyi arkadaşlarınla paylaş", ` data-paylas`) +
    link("https://www.linkedin.com/in/birolabanuzoglu", "💼", "LinkedIn: linkedin.com/in/birolabanuzoglu", ` target="_blank" rel="noopener"`) +
    link("mailto:birolabanuzoglu@gmail.com?subject=%C3%96zet%20RG%20Geri%20Bildirim", "✉️", "Bana yazın: birolabanuzoglu@gmail.com") +
    link("https://github.com/birolabanuzoglu/resmi-gazete-ozet/blob/main/GIZLILIK.md", "🛡️", "Gizlilik ve KVKK", ` target="_blank" rel="noopener"`) +
    link("https://github.com/birolabanuzoglu/resmi-gazete-ozet#telif-ve-kullan%C4%B1m", "©️", "Telif ve kullanım", ` target="_blank" rel="noopener"`) +
    `</section><p class="note ab-foot">Özet RG · Web sitesi · © 2026 · Simgeler: Material Icons (Apache 2.0)</p>`;
  $app.querySelectorAll("[data-tema]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    setTheme(a.dataset.tema);
    $app.querySelectorAll("[data-tema]").forEach(x => x.classList.toggle("on", x === a));
  }));
  $app.querySelector("[data-paylas]").addEventListener("click", async e => {
    e.preventDefault();
    const url = new URL("./", location.href).href;
    if (navigator.share) { try { await navigator.share({ title: "Özet RG · Resmî Gazete'nin günlük özeti", url }); } catch (x) { /* vazgeçildi */ } return; }
    try { await navigator.clipboard.writeText(url); toast("Bağlantı kopyalandı"); } catch (x) { prompt("Bağlantı:", url); }
  });
  setMeta("Hakkında | Özet RG", "Özet RG'yi kim, neden ve nasıl hazırlıyor.", "?hakkinda");
}

// ------------------------------------------------------------------ genel

function loading(text) {
  $app.innerHTML = `<div class="ld"><i></i>${esc(text)}</div>`;
}
function showError(e, retry) {
  $app.innerHTML = `<section class="card hero"><div class="empty"><b>Özetlere ulaşılamadı</b><p>İnternet bağlantınızı kontrol edip yeniden deneyin.</p>` +
    `<button class="retry" type="button">Yeniden dene</button><p class="err">${esc(e && e.message || e)}</p></div></section>`;
  $app.querySelector(".retry").addEventListener("click", retry);
}
let toastTimer = 0;
function toast(text) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.append(t); }
  t.textContent = text;
  t.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("on"), 2200);
}

let lastSearch = null;
async function route() {
  lastSearch = location.search;
  if (window.speechSynthesis) speechSynthesis.cancel();
  const q = new URLSearchParams(location.search);
  $app.classList.toggle("about", q.has("hakkinda") || q.has("araclar") || q.has("takvim") || q.has("bulten"));
  applyFont();
  if (q.has("hakkinda")) { showAbout(); return; }
  if (q.has("araclar")) { showTools(); return; }
  if (q.has("takvim")) { await showCalendar(); return; }
  if (q.has("bulten")) { await showBulletin(+q.get("bulten")); return; }
  try { await loadIndex(); } catch (e) { return showError(e, route); }
  if (q.has("gun")) await showDay(normKey(q.get("gun")), (q.get("ara") || "").trim());
  else if (q.has("gecmis") || q.has("ara") || q.has("tur")) await showList((q.get("ara") || "").trim(), q.get("tur") || "");
  else await showDay(INDEX.guncel, "");
  // Sayfa içi adresle açıldıysa (ör. …#sec-ata) içerik çizildikten sonra oraya kaydır
  const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
}
function go(url) {
  history.pushState(null, "", url);
  route().then(() => { if (!location.hash) window.scrollTo(0, 0); });
}
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-nav]");
  if (!a || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  go(a.getAttribute("href"));
});
// Sayfa içi bağlantılar (#g-1 gibi) da popstate üretir; aynı sayfaysa yeniden çizilmez
window.addEventListener("popstate", () => { if (location.search !== lastSearch) route(); });

// Tema: Sistem, Açık ya da Koyu (Hakkında'daki seçici; tercih yalnızca tarayıcıda saklanır)
function theme() {
  try { return localStorage.getItem("tema") || "sistem"; } catch (e) { return "sistem"; }
}
function applyTheme() {
  const t = theme();
  const dark = t === "koyu" || (t === "sistem" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", !dark);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#5E1012" : "#B71C1C");
}
function setTheme(t) {
  try { localStorage.setItem("tema", t); } catch (e) { /* gizli sekme */ }
  applyTheme();
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
applyTheme();
route();
