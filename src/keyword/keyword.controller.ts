
// keyword.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { GetKeywordDto } from './dto/get-keyword.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('keywords')
@Controller('keywords')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new keyword' })
  @ApiBody({ description: 'Create a new keyword', type: CreateKeywordDto })
  @ApiResponse({ status: 201, description: 'Keyword created successfully.' })
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordService.create(createKeywordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all keywords' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiQuery({ name: 'user_level', required: false, description: 'Filter by user level (1: beginner, 2: intermediate, 3: advanced)' })
  @ApiResponse({ status: 200, description: 'List of keywords retrieved successfully.' })
  findAll(@Query() query: GetKeywordDto) {
    return this.keywordService.getAll(query);
  }

  @Get('transcript/:transcriptId')
  @ApiOperation({ summary: 'Retrieve all keywords for a specific transcript' })
  @ApiParam({ name: 'transcriptId', description: 'The ID of the transcript to get keywords for' })
  @ApiQuery({ name: 'user_level', required: false, description: 'Filter by user level (1: beginner, 2: intermediate, 3: advanced)' })
  @ApiResponse({ status: 200, description: 'List of keywords retrieved successfully.' })
  findByTranscriptId(@Param('transcriptId') transcriptId: string, @Query() query: GetKeywordDto) {
    return this.keywordService.getByTranscriptId(transcriptId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single keyword' })
  @ApiParam({ name: 'id', description: 'The ID of the keyword to retrieve' })
  @ApiResponse({ status: 200, description: 'Keyword retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Keyword not found.' })
  findOne(@Param('id') id: number, @Query() query: GetKeywordDto) {
    return this.keywordService.getById(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a keyword' })
  @ApiParam({ name: 'id', description: 'The ID of the keyword to update' })
  @ApiBody({ type: UpdateKeywordDto, description: 'The keyword data to update' })
  @ApiResponse({ status: 200, description: 'Keyword updated successfully.' })
  @ApiResponse({ status: 404, description: 'Keyword not found.' })
  update(@Param('id') id: number, @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordService.update(id, updateKeywordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a keyword' })
  @ApiParam({ name: 'id', description: 'The ID of the keyword to delete' })
  @ApiResponse({ status: 200, description: 'Keyword deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Keyword not found.' })
  remove(@Param('id') id: number) {
    return this.keywordService.delete(id);
  }
}