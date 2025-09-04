// api/_cors.js
const allowedOrigins = [
  "https://curriculomotorista.com.br"
];

export function setCORS(req, res) {
  const origin = req.headers.origin;
  res.setHeader(
    "Access-Control-Allow-Origin",
    allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  );
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export function handleOPTIONS(req, res) {
  if (req.method === "OPTIONS") { setCORS(req, res); res.status(204).end(); return true; }
  return false;
}
