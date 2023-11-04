import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { fileStorage } from './storage';
import { FilesService } from './files.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { FileTypes } from './entities/file.entity';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all files' })
  @Get()
  async getAll(@UserId() userId: number, @Query('type') fileType: FileTypes) {
    return await this.filesService.findAll(userId, fileType);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return await this.filesService.upload(file, userId);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Remove files' })
  @Delete()
  async remove(@UserId() userId: number, @Query('id') ids: string) {
    return await this.filesService.remove(userId, ids);
  }
}
