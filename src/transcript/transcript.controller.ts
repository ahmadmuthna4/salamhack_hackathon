
// transcript.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TranscriptService } from './transcript.service';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { GetTranscriptDto } from './dto/get-transcript.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('transcripts')
@Controller('transcripts')
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new transcript' })
  @ApiBody({ description: 'Create a new transcript', type: CreateTranscriptDto })
  @ApiResponse({ status: 201, description: 'Transcript created successfully.' })
  create(@Body() createTranscriptDto: CreateTranscriptDto) {
    return this.transcriptService.create(createTranscriptDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all transcripts' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiResponse({ status: 200, description: 'List of transcripts retrieved successfully.' })
  findAll(@Query() query: GetTranscriptDto) {
    return this.transcriptService.getAll(query);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Retrieve all transcripts for a specific video' })
  @ApiParam({ name: 'videoId', description: 'The ID of the video to get transcripts for' })
  @ApiResponse({ status: 200, description: 'List of transcripts retrieved successfully.' })
  findByVideoId(@Param('videoId') videoId: string, @Query() query: GetTranscriptDto) {
    return this.transcriptService.getByVideoId(+videoId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single transcript' })
  @ApiParam({ name: 'id', description: 'The ID of the transcript to retrieve' })
  @ApiResponse({ status: 200, description: 'Transcript retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Transcript not found.' })
  findOne(@Param('id') id: string, @Query() query: GetTranscriptDto) {
    return this.transcriptService.getById(+id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transcript' })
  @ApiParam({ name: 'id', description: 'The ID of the transcript to update' })
  @ApiBody({ type: UpdateTranscriptDto, description: 'The transcript data to update' })
  @ApiResponse({ status: 200, description: 'Transcript updated successfully.' })
  @ApiResponse({ status: 404, description: 'Transcript not found.' })
  update(@Param('id') id: string, @Body() updateTranscriptDto: UpdateTranscriptDto) {
    return this.transcriptService.update(+id, updateTranscriptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transcript' })
  @ApiParam({ name: 'id', description: 'The ID of the transcript to delete' })
  @ApiResponse({ status: 200, description: 'Transcript deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Transcript not found.' })
  remove(@Param('id') id: string) {
    return this.transcriptService.delete(+id);
  }
}