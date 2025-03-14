
// exercise.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiBody({ description: 'Create a new exercise', type: CreateExerciseDto })
  @ApiResponse({ status: 201, description: 'Exercise created successfully.' })
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.create(createExerciseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all exercises' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiResponse({ status: 200, description: 'List of exercises retrieved successfully.' })
  findAll(@Query() query: GetExerciseDto) {
    return this.exerciseService.getAll(query);
  }

  @Get('podcast/:podcastId')
  @ApiOperation({ summary: 'Retrieve all exercises for a specific podcast' })
  @ApiParam({ name: 'podcastId', description: 'The ID of the podcast to get exercises for' })
  @ApiResponse({ status: 200, description: 'List of exercises retrieved successfully.' })
  findByPodcastId(@Param('podcastId') podcastId: number, @Query() query: GetExerciseDto) {
    return this.exerciseService.getByPodcastId(podcastId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single exercise' })
  @ApiParam({ name: 'id', description: 'The ID of the exercise to retrieve' })
  @ApiResponse({ status: 200, description: 'Exercise retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  findOne(@Param('id') id: number, @Query() query: GetExerciseDto) {
    return this.exerciseService.getById(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise' })
  @ApiParam({ name: 'id', description: 'The ID of the exercise to update' })
  @ApiBody({ type: UpdateExerciseDto, description: 'The exercise data to update' })
  @ApiResponse({ status: 200, description: 'Exercise updated successfully.' })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  update(@Param('id') id: number, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exercise' })
  @ApiParam({ name: 'id', description: 'The ID of the exercise to delete' })
  @ApiResponse({ status: 200, description: 'Exercise deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  remove(@Param('id') id: number) {
    return this.exerciseService.delete(id);
  }
}
