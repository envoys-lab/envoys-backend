import { BadRequestException } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/vnd.rar',
  'application/zip',
  'application/x-7z-compressed',
]

export const multerOptions: MulterOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (whitelist.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new BadRequestException(`Unsupported file type!`), false)
    }
  },
}
