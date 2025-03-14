
// audio-file.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AudioFileService } from './audio-file.service';
import { CreateAudioFileDto } from './dto/create-audio-file.dto';
import { UpdateAudioFileDto } from './dto/update-audio-file.dto';
import { GetAudioFileDto } from './dto/get-audio-file.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('audio-files')
@Controller('audio-files')
export class AudioFileController {
  constructor(private readonly audioFileService: AudioFileService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new audio file' })
  @ApiBody({ description: 'Create a new audio file', type: CreateAudioFileDto })
  @ApiResponse({ status: 201, description: 'Audio file created successfully.' })
  create(@Body() createAudioFileDto: CreateAudioFileDto) {
    return this.audioFileService.create(createAudioFileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all audio files' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiResponse({ status: 200, description: 'List of audio files retrieved successfully.' })
  findAll(@Query() query: GetAudioFileDto) {
    return this.audioFileService.getAll(query);
  }

  @Get('podcast/:podcastId')
  @ApiOperation({ summary: 'Retrieve all audio files for a specific podcast' })
  @ApiParam({ name: 'podcastId', description: 'The ID of the podcast to get audio files for' })
  @ApiResponse({ status: 200, description: 'List of audio files retrieved successfully.' })
  findByPodcastId(@Param('podcastId') podcastId: number, @Query() query: GetAudioFileDto) {
    return this.audioFileService.getByPodcastId(podcastId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single audio file' })
  @ApiParam({ name: 'id', description: 'The ID of the audio file to retrieve' })
  @ApiResponse({ status: 200, description: 'Audio file retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Audio file not found.' })
  findOne(@Param('id') id: number, @Query() query: GetAudioFileDto) {
    return this.audioFileService.getById(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an audio file' })
  @ApiParam({ name: 'id', description: 'The ID of the audio file to update' })
  @ApiBody({ type: UpdateAudioFileDto, description: 'The audio file data to update' })
  @ApiResponse({ status: 200, description: 'Audio file updated successfully.' })
  @ApiResponse({ status: 404, description: 'Audio file not found.' })
  update(@Param('id') id: number, @Body() updateAudioFileDto: UpdateAudioFileDto) {
    return this.audioFileService.update(id, updateAudioFileDto);
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