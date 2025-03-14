
// keyword.module.ts
import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { KeywordRepository } from './keyword.repository';
import { TranscriptModule } from '../transcript/transcript.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), TranscriptModule],
  controllers: [KeywordController],
  providers: [KeywordService, KeywordRepository],
  exports: [KeywordService]
})
export class KeywordModule { }