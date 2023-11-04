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

  async findAll(userId: number, fileType: FileTypes): Promise<FileEntity[]> {
    const qb = this.fileRepository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType === FileTypes.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE :type', { type: '%image%' });
    }
    if (fileType === FileTypes.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return await qb.getMany();
  }

  async upload(file: Express.Multer.File, userId: number): Promise<FileEntity> {
    return await this.fileRepository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }

  async remove(userId: number, ids: string) {
    console.log(userId, ids);
    const idArray = ids.split(',');
    const qb = this.fileRepository.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', {
      ids: idArray,
      userId,
    });

    return await qb.softDelete().execute();
  }
}
