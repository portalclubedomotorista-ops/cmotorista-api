// api/create-payment.js
import { setCORS, handleOPTIONS } from "./_cors";

const HARDCODED_TEST_TOKEN = "TEST-8870825135355480-111814-a47ab5c7cfa920279413aa8e0353b445-192220003";
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || HARDCODED_TEST_TOKEN;
const TEST_MODE = (MP_TOKEN || "").startsWith("TEST-");

export default async function handler(req, res) {
  if (handleOPTIONS(req, res)) return;
  setCORS(req, res);

  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ ok: true, needs: "POST" });
  }

  try {
    const { amount = 4.90, description = "Currículo Motorista PDF" } = req.body || {};

    if (TEST_MODE) {
      const payment_id = "MP_TESTE_" + Math.random().toString(36).slice(2, 10);
      return res.status(200).json({
        payment_id,
        qr_code: "000201010212***FAKE_QR_PIX***",
        qr_code_base64: "",
        mode: "test"
      });
    }

    const r = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_amount: Number(amount),
        description,
        payment_method_id: "pix",
        payer: { email: "cliente@exemplo.com" }
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(400).json({ error: data });

    const payment_id = data.id;
    const qr_code_base64 = data?.point_of_interaction?.transaction_data?.qr_code_base64 || "";
    const qr_code = data?.point_of_interaction?.transaction_data?.qr_code || "";

    return res.status(200).json({ payment_id, qr_code_base64, qr_code, mode: "prod" });
  } catch (e) {
    res.status(500).json({ error: "Falha interna", detail: String(e) });
  }
}
