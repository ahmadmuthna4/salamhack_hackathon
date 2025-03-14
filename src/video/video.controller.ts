
// video.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { GetVideoDto } from './dto/get-video.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiBody({ description: 'Create a new video', type: CreateVideoDto })
  @ApiResponse({ status: 201, description: 'Video created successfully.' })
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all videos' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiResponse({ status: 200, description: 'List of videos retrieved successfully.' })
  findAll(@Query() query: GetVideoDto) {
    return this.videoService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single video' })
  @ApiParam({ name: 'id', description: 'The ID of the video to retrieve' })
  @ApiResponse({ status: 200, description: 'Video retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  findOne(@Param('id') id: string, @Query() query: GetVideoDto) {
    return this.videoService.getById(+id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a video' })
  @ApiParam({ name: 'id', description: 'The ID of the video to update' })
  @ApiBody({ type: UpdateVideoDto, description: 'The video data to update' })
  @ApiResponse({ status: 200, description: 'Video updated successfully.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video' })
  @ApiParam({ name: 'id', description: 'The ID of the video to delete' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  remove(@Param('id') id: string) {
    return this.videoService.delete(+id);
  }
}