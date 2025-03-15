// audio-file.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  ParseIntPipe,
  UseInterceptors,
  DefaultValuePipe,
} from '@nestjs/common';
import { AudioFileService } from './audio-file.service';
import { CreateAudioFileDto } from './dto/create-audio-file.dto';
import { UpdateAudioFileDto } from './dto/update-audio-file.dto';
import { GetAudioFileDto } from './dto/get-audio-file.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('audio-files')
@Controller('audio-files')
export class AudioFileController {
  constructor(private readonly audioFileService: AudioFileService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new audio file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Audio file uploaded successfully.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/podcasts',
        filename: (req, file, callback) => {
          // Create a unique file name
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `audio-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Accept only audio files
        if (!file.mimetype.includes('audio')) {
          return callback(new Error('Only audio files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('podcast_id', ParseIntPipe) podcast_id: number,
  ) {
    // File path is now available in file.path
    return this.audioFileService.create({
      file_path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes
      podcast_id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all audio files' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of results',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset the results',
  })
  @ApiResponse({
    status: 200,
    description: 'List of audio files retrieved successfully.',
  })
  findAll(@Query() query: GetAudioFileDto) {
    return this.audioFileService.getAll(query);
  }

  @Get('podcast/:podcastId')
  @ApiOperation({ summary: 'Retrieve all audio files for a specific podcast' })
  @ApiParam({
    name: 'podcastId',
    description: 'The ID of the podcast to get audio files for',
  })
  @ApiResponse({
    status: 200,
    description: 'List of audio files retrieved successfully.',
  })
  findByPodcastId(
    @Param('podcastId') podcastId: number,
    @Query() query: GetAudioFileDto,
  ) {
    return this.audioFileService.getByPodcastId(podcastId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single audio file' })
  @ApiParam({ name: 'id', description: 'The ID of the audio file to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Audio file retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Audio file not found.' })
  findOne(@Param('id') id: number, @Query() query: GetAudioFileDto) {
    return this.audioFileService.getById(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an audio file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Audio file updated successfully.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/podcasts',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `audio-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.includes('audio')) {
          return callback(new Error('Only audio files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
    @Body('podcast_id', new DefaultValuePipe(null), ParseIntPipe)
    podcast_id?: number,
  ) {
    const updateData: any = {};

    // Only update file_path if a new file was uploaded
    if (file) {
      updateData.file_path = file.path.replace(/\\/g, '/');
    }

    // Only update podcast_id if it was provided
    if (podcast_id !== null) {
      updateData.podcast_id = podcast_id;
    }

    return this.audioFileService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an audio file' })
  @ApiParam({ name: 'id', description: 'The ID of the audio file to delete' })
  @ApiResponse({ status: 200, description: 'Audio file deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Audio file not found.' })
  remove(@Param('id') id: number) {
    return this.audioFileService.delete(id);
  }
}
