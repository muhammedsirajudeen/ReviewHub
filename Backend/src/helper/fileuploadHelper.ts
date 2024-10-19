import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import sharp from 'sharp';
import fs, { existsSync, mkdirSync } from 'fs';

function UploadHandler(pathName: string, type?: string) {
  const uploadDir = path.join(__dirname, '../public/', pathName);
  //adding an option to make the dir if it doesnt exist
  if(!existsSync(uploadDir)){
    mkdirSync(uploadDir,{recursive:true})
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      // Define the file name
      if (type === 'video') {
        // const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.originalname);
      } else {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
      }
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
  });
  return upload;
}

export const resizeMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next(); // If no file, move on
  const uploadDir = path.join(__dirname, '../public/', 'course');

  const filePath = path.join(uploadDir, req.file.filename);

  sharp(filePath)
    .resize(300, 300) // Resize the image to 300x300 pixels
    .toFile(
      filePath.replace(
        path.extname(req.file.filename),
        '-resized' + path.extname(req.file.filename)
      ),
      (err) => {
        if (err) {
          return next(err);
        }

        // Optional: Remove the original file if you only want to keep the resized one
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting the original file:', unlinkErr);
          }
          if (req.file?.filename) {
            const resizedFilePath = path.join(
              path.dirname(filePath),
              path.basename(filePath, path.extname(filePath)) +
                '-resized' +
                path.extname(filePath)
            );
            req.file.filename = path.basename(resizedFilePath);
          }
          next();
        });
      }
    );
};

export const resizeMiddlewareWrapper = (pathName: string) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.file) return next(); // If no file, move on
    const uploadDir = path.join(__dirname, '../public/', pathName);

    const filePath = path.join(uploadDir, req.file.filename);

    sharp(filePath)
      .resize(300, 300) // Resize the image to 300x300 pixels
      .toFile(
        filePath.replace(
          path.extname(req.file.filename),
          '-resized' + path.extname(req.file.filename)
        ),
        (err) => {
          if (err) {
            return next(err);
          }

          // Optional: Remove the original file if you only want to keep the resized one
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting the original file:', unlinkErr);
            }
            if (req.file?.filename) {
              const resizedFilePath = path.join(
                path.dirname(filePath),
                path.basename(filePath, path.extname(filePath)) +
                  '-resized' +
                  path.extname(filePath)
              );
              req.file.filename = path.basename(resizedFilePath);
            }
            next();
          });
        }
      );
  };
};

export default UploadHandler;
