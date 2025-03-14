import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { GetPodcastDto } from './dto/get-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@ApiTags('podcasts')
@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new podcast' })
  @ApiBody({ description: 'Create a new podcast', type: CreatePodcastDto })
  @ApiResponse({ status: 201, description: 'Podcast created successfully.' })
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.create(createPodcastDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all podcasts' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiResponse({ status: 200, description: 'List of podcasts retrieved successfully.' })
  findAll(@Query() query: GetPodcastDto) {
    return this.podcastService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single podcast by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the podcast to retrieve' })
  @ApiResponse({ status: 200, description: 'Podcast retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Podcast not found.' })
  findOne(@Param('id') id: number, @Query() query: GetPodcastDto) {
    return this.podcastService.getById(id, query);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Retrieve podcast by video ID' })
  @ApiParam({ name: 'videoId', description: 'The video ID to retrieve podcast for' })
  @ApiResponse({ status: 200, description: 'Podcast retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Podcast not found for this video.' })
  findByVideoId(@Param('videoId') videoId: number, @Query() query: GetPodcastDto) {
    return this.podcastService.getByVideoId(videoId, query);
  }

  @Get('transcript/:transcriptId')
  @ApiOperation({ summary: 'Retrieve podcast by transcript ID' })
  @ApiParam({ name: 'transcriptId', description: 'The transcript ID to retrieve podcast for' })
  @ApiResponse({ status: 200, description: 'Podcast retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Podcast not found for this transcript.' })
  findByTranscriptId(@Param('transcriptId') transcriptId: number, @Query() query: GetPodcastDto) {
    return this.podcastService.getByTranscriptId(transcriptId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a podcast' })
  @ApiParam({ name: 'id', description: 'The ID of the podcast to update' })
  @ApiBody({ type: UpdatePodcastDto, description: 'The podcast data to update' })
  @ApiResponse({ status: 200, description: 'Podcast updated successfully.' })
  @ApiResponse({ status: 404, description: 'Podcast not found.' })
  update(@Param('id') id: number, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(id, updatePodcastDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a podcast' })
  @ApiParam({ name: 'id', description: 'The ID of the podcast to delete' })
  @ApiResponse({ status: 200, description: 'Podcast deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Podcast not found.' })
  remove(@Param('id') id: number) {
    return this.podcastService.delete(id);
  }
}
