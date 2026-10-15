type ApiRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};
type ApiResponse = { setHeader(name: string, value: string): void; status(code: number): ApiResponse; json(body: unknown): void };

const attempts = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_TRACKED_CLIENTS = 5000;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Metode tidak didukung." });
  }

  const body = request.body && typeof request.body === "object" ? request.body as Record<string, unknown> : {};
  if (clean(body.website, 200)) return response.status(200).json({ ok: true });

  const forwardedForHeader = request.headers["x-forwarded-for"];
  const forwardedFor = Array.isArray(forwardedForHeader) ? forwardedForHeader[0] : forwardedForHeader;
  // Proxies may append addresses to X-Forwarded-For; use the final entry to avoid trusting a client-supplied prefix.
  const forwardedParts = clean(forwardedFor, 300).split(",").map((part) => part.trim()).filter(Boolean);
  const forwardedIp = forwardedParts[forwardedParts.length - 1];
  const ip = forwardedIp || request.socket?.remoteAddress || "unknown";
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const prior = attempts.get(ip);
  if (prior && prior.expires > now && prior.count >= MAX_ATTEMPTS) {
    return response.status(429).json({ error: "Terlalu banyak percobaan. Coba lagi beberapa menit kemudian." });
  }
  if (!attempts.has(ip) && attempts.size >= MAX_TRACKED_CLIENTS) {
    const oldestIp = attempts.keys().next().value;
    if (oldestIp) attempts.delete(oldestIp);
  }
  attempts.set(ip, prior && prior.expires > now ? { count: prior.count + 1, expires: prior.expires } : { count: 1, expires: now + WINDOW_MS });

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const subject = clean(body.subject, 150) || "Pesan dari website";
  const message = clean(body.message, 5000);
  const consent = body.consent === true || body.consent === "on";
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || !consent) {
    return response.status(400).json({ error: "Periksa kembali nama, email, pesan, dan persetujuan Anda." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return response.status(503).json({ error: "Formulir belum dikonfigurasi. Silakan hubungi melalui email langsung." });

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Website] ${subject}`,
        text: `Nama: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return response.status(502).json({ error: "Pesan belum dapat dikirim. Silakan coba lagi atau gunakan email langsung." });
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ error: "Pesan belum dapat dikirim. Silakan coba lagi atau gunakan email langsung." });
  }
}
