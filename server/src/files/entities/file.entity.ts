import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum FileTypes {
  PHOTOS = 'photos',
  TRASH = 'trash',
}

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;

  @DeleteDateColumn()
  deletedAt?: Date;
}
