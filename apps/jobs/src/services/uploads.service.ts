import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { UPLOAD_FILE_PATH } from '../consts/upload.const';
import { FileUploadResponseDto } from '../dtos/file-upload.dto';
import { InternalServerErrorException } from '@app/common';

@Injectable()
export class UploadsService {
    private readonly logger = new Logger(UploadsService.name);

    async saveFileInfo(file: Express.Multer.File): Promise<FileUploadResponseDto> {
        try {
            if (!fs.existsSync(UPLOAD_FILE_PATH)) {
                fs.mkdirSync(UPLOAD_FILE_PATH, { recursive: true });
            }

            const result = {
                message: 'File uploaded successfully',
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                path: file.path,
                uploadedAt: new Date(),
            };

            return result;
        } catch (error: unknown) {
            this.logger.error('Error in saveFileInfo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new InternalServerErrorException(errorMessage);
        }
    }
}