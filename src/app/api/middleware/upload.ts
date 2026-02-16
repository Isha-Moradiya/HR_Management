import multer from "multer";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { fileURLToPath } from "url";
import { NextRequest } from "next/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUploader = (folderName: string) => {
    const uploadDir = path.join(__dirname, "..", "..", "uploads", folderName);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadDir),
        filename: (_req, file, cb) => {
            const ext = mime.extension(file.mimetype) || "bin";
            cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
        },
    });

    const fileFilter = (_req: any, file: any, cb: any) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) cb(null, true);
        else cb(new Error("Only image files are allowed!"), false);
    };

    return multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
};


// promisified function to handle single file
export const handleMultipart = (fieldName: string, folderName: string) => {
    const uploader = getUploader(folderName).single(fieldName);

    return (req: NextRequest) =>
        new Promise<{ body: any; file?: Express.Multer.File }>((resolve, reject) => {
            uploader(req as any, {} as any, (err: any) => {
                if (err) return reject(err);
                const body = (req as any).body;
                const file = (req as any).file;
                if (file) body[fieldName] = `/uploads/${folderName}/${file.filename}`;
                resolve({ body, file });
            });
        });
};
