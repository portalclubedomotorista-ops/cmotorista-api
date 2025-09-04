// api/ping.js
import { setCORS, handleOPTIONS } from "./_cors";

export default function handler(req, res) {
  if (handleOPTIONS(req, res)) return;
  setCORS(req, res);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({ ok: true, ts: Date.now() });
}
