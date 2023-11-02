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
  getAll(@UserId() userId: number, @Query('type') fileType: FileTypes) {
    return this.filesService.findAll(userId, fileType);
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
  upload(
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
    console.log(userId);
    return this.filesService.upload(file, userId);
  }
}
