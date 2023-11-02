import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity, FileTypes } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  findAll(userId: number, fileType: FileTypes): Promise<FileEntity[]> {
    const qb = this.fileRepository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType === FileTypes.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE = :type', { type: '%image%' });
    }
    if (fileType === FileTypes.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return qb.getMany();
  }

  upload(file: Express.Multer.File, userId: number) {
    return this.fileRepository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }
}
