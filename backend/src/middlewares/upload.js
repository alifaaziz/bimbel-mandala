import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = path.resolve('public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `temp-${timestamp}${ext}`);
  }
});

export const upload = multer({ storage });