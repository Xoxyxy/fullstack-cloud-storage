import { diskStorage } from 'multer';
import * as uuid from 'uuid';

export const fileStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const fileName = `${uuid.v4()}.${file.originalname.split('.').pop()}`;
    callback(null, fileName);
  },
});
