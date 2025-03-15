
// user-progress.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { CreateUserProgressDto } from './dto/create-user-progress.dto';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { GetUserProgressDto } from './dto/get-user-progress.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user-progress')
@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) { }

  @Post()
  @ApiOperation({ summary: 'Create or update user progress' })
  @ApiBody({ description: 'Create user progress', type: CreateUserProgressDto })
  @ApiResponse({ status: 201, description: 'User progress created successfully.' })
  create(@Body() createUserProgressDto: CreateUserProgressDto) {
    return this.userProgressService.create(createUserProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all user progress' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the results' })
  @ApiResponse({ status: 200, description: 'List of user progress retrieved successfully.' })
  findAll(@Query() query: GetUserProgressDto) {
    return this.userProgressService.getAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve progress for a specific user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to get progress for' })
  @ApiResponse({ status: 200, description: 'User progress retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User progress not found.' })
  findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: GetUserProgressDto
  ) {
    return this.userProgressService.getByUserId(userId, query);
  }

  @Patch('user/:userId')
  @ApiOperation({ summary: 'Update user progress' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to update progress for' })
  @ApiBody({ type: UpdateUserProgressDto, description: 'The progress data to update' })
  @ApiResponse({ status: 200, description: 'User progress updated successfully.' })
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserProgressDto: UpdateUserProgressDto
  ) {
    return this.userProgressService.update(userId, updateUserProgressDto);
  }

  @Patch('user/:userId/add-xp/:amount')
  @ApiOperation({ summary: 'Add XP points to user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to add XP for' })
  @ApiParam({ name: 'amount', description: 'The amount of XP points to add' })
  @ApiResponse({ status: 200, description: 'XP points added successfully.' })
  addXp(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('amount', ParseIntPipe) amount: number
  ) {
    return this.userProgressService.addXpPoints(userId, amount);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete user progress' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to delete progress for' })
  @ApiResponse({ status: 200, description: 'User progress deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User progress not found.' })
  remove(@Param('userId', ParseIntPipe) userId: number) {
    return this.userProgressService.delete(userId);
  }
}
