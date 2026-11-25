import "server-only";

// Prévient la coiffeuse d'une nouvelle demande. Fonctionne avec Twilio (WhatsApp ou SMS)
// si les variables d'environnement sont remplies ; sinon la demande reste visible dans l'admin.
export async function notifyOwner(text: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const owner = process.env.OWNER_PHONE;
  if (!sid || !token || !from || !owner) {
    console.info("[notification non envoyée, Twilio non configuré]", text);
    return;
  }
  const to = from.startsWith("whatsapp:") ? `whatsapp:${owner}` : owner;
  const site = process.env.SITE_URL ? `\n${process.env.SITE_URL.replace(/\/$/, "")}/admin` : "";
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: to, Body: text + site }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[notification] Twilio a répondu", res.status, await res.text());
  } catch (e) {
    console.error("[notification] échec", e);
  }
}
