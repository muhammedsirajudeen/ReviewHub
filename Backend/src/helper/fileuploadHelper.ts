import multer from "multer";
import path from "path";



function UploadHandler(pathName:string){
  const uploadDir = path.join(__dirname, "../public/",pathName);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      // Define the file name
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
  });
  return upload
}

export default UploadHandler;
