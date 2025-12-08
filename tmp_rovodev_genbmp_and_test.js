import http from 'http';

function createSolidBMP(width, height, r, g, b) {
  const rowSize = Math.floor((24 * width + 31) / 32) * 4; // row aligned to 4 bytes
  const pixelArraySize = rowSize * height;
  const fileSize = 14 + 40 + pixelArraySize;

  const buf = Buffer.alloc(fileSize);

  // BITMAPFILEHEADER
  buf.write('BM', 0); // Signature
  buf.writeUInt32LE(fileSize, 2); // File size
  buf.writeUInt32LE(0, 6); // Reserved
  buf.writeUInt32LE(14 + 40, 10); // Pixel data offset

  // BITMAPINFOHEADER
  buf.writeUInt32LE(40, 14); // DIB header size
  buf.writeInt32LE(width, 18); // width
  buf.writeInt32LE(height, 22); // height (positive = bottom-up)
  buf.writeUInt16LE(1, 26); // planes
  buf.writeUInt16LE(24, 28); // bits per pixel
  buf.writeUInt32LE(0, 30); // compression (BI_RGB)
  buf.writeUInt32LE(pixelArraySize, 34); // image size
  buf.writeInt32LE(2835, 38); // X pixels per meter (72 DPI ~ 2835)
  buf.writeInt32LE(2835, 42); // Y pixels per meter
  buf.writeUInt32LE(0, 46); // colors in color table
  buf.writeUInt32LE(0, 50); // important color count

  // Pixel data (BGR order), each row padded to 4 bytes
  const padding = rowSize - width * 3;
  let offset = 14 + 40;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      buf[offset++] = b; // B
      buf[offset++] = g; // G
      buf[offset++] = r; // R
    }
    for (let p = 0; p < padding; p++) buf[offset++] = 0;
  }

  return buf;
}

const bmp = createSolidBMP(128, 128, 220, 20, 20); // reddish square
const base64 = bmp.toString('base64');
const payload = JSON.stringify({
  imageBase64: `data:image/bmp;base64,${base64}`,
  mimeType: 'image/bmp',
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
    console.log('Body:', data.slice(0, 1200));
    process.exit(0);
  });
});

req.on('error', err => {
  console.error('Request error:', err);
  process.exit(1);
});

req.write(payload);
req.end();
