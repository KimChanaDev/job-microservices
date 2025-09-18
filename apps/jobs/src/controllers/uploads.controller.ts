import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UPLOAD_FILE_PATH } from "../consts/upload.const";
import { FileUploadResponseDto } from "../dtos/file-upload.dto";
import { UploadsService } from "../services/uploads.service";
import createError from 'http-errors';

@Controller("uploads")
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('file')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: UPLOAD_FILE_PATH,
                filename: (_req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = extname(file.originalname);
                    const filename = `file-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (_req, file, callback) => {
                const allowedTypes = /\.(json|xml)$/i;
                const isAllowed = allowedTypes.test(extname(file.originalname));

                if (isAllowed) {
                    callback(null, true);
                } else {
                    callback(createError(400, 'Only JSON files are allowed.'), false);
                }
            }
        })
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileUploadResponseDto> {
        const result = await this.uploadsService.saveFileInfo(file);
        return result;
    }
}