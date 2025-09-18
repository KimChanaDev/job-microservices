export interface FileUploadResponseDto {
    message: string;
    filename: string;
    originalName: string;
    size: number;
    path: string;
    uploadedAt: Date;
}