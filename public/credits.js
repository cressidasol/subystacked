// Credits without a backend: Gumroad stores each license key's use count.
// shortcut: checks run in the browser, so a determined user can bypass them; add a server check if abuse shows up.
export const CONFIG = {
  productId: '',                       // Gumroad product ID (Product > Content > License key). Empty = tool stays free.
  buyUrl: 'https://gumroad.com/l/suby', // your Gumroad product link
  perPack: 20,                         // videos per $5 pack
  free: 3,                             // free videos per browser
};

export function judge(res, perPack = CONFIG.perPack) {
  if (!res?.success) return { ok: false, left: 0, reason: 'That license key is not valid.' };
  const p = res.purchase || {};
  if (p.refunded || p.chargebacked || p.disputed) return { ok: false, left: 0, reason: 'This purchase was refunded.' };
  const left = Math.max(0, perPack - res.uses);
  return left > 0 ? { ok: true, left } : { ok: false, left: 0, reason: 'This pack is used up. Buy another one to keep going.' };
}

// spend=false only checks the balance; spend=true uses one credit.
export async function checkKey(key, spend = false) {
  const body = new URLSearchParams({ product_id: CONFIG.productId, license_key: key.trim(), increment_uses_count: String(spend) });
  const r = await fetch('https://api.gumroad.com/v2/licenses/verify', { method: 'POST', body });
  const res = await r.json().catch(() => ({}));
  return judge(res); // after a spend, .left is the balance that remains
}
