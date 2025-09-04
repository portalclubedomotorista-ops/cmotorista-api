// api/payment-status.js
import { setCORS, handleOPTIONS } from "./_cors";

const HARDCODED_TEST_TOKEN = "TEST-8870825135355480-111814-a47ab5c7cfa920279413aa8e0353b445-192220003";
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || HARDCODED_TEST_TOKEN;
const TEST_MODE = (MP_TOKEN || "").startsWith("TEST-");

export default async function handler(req, res) {
  if (handleOPTIONS(req, res)) return;
  setCORS(req, res);

  const payment_id = (req.query && req.query.payment_id) || (req.body && req.body.payment_id);
  if (!payment_id) return res.status(400).json({ error: "payment_id obrigatório" });

  if (TEST_MODE) return res.status(200).json({ status: "approved", test: true });

  const r = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
  });
  const data = await r.json();
  if (!r.ok) return res.status(400).json({ error: data });

  res.status(200).json({ status: data.status });
}
