
// user-progress.module.ts
import { Module } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { UserProgressController } from './user-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgress } from './entities/user-progress.entity';
import { UserProgressRepository } from './user-progress.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProgress]),
    UserModule
  ],
  controllers: [UserProgressController],
  providers: [UserProgressService, UserProgressRepository],
  exports: [UserProgressService]
})
export class UserProgressModule { }