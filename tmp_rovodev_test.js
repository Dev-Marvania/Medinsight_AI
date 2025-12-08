import fs from 'fs';
import http from 'http';

// 1x1 PNG (red)
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBgX9p1IQAAAAASUVORK5CYII=';
const payload = JSON.stringify({
  imageBase64: `data:image/png;base64,${pngBase64}`,
  mimeType: 'image/png',
  modality: 'xray'
});

const opts = {
  hostname: 'localhost',
  port: 3000,
  path: '/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(opts, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data.slice(0, 1000));
    process.exit(0);
  });
});

req.on('error', err => {
  console.error('Request error:', err);
  process.exit(1);
});

req.write(payload);
req.end();
