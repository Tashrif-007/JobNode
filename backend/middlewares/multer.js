import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Configure Multer

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads')
    cb(null, uploadPath); // Folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
