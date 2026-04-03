import { Module } from '@nestjs/common';
import { HelperService } from './helper/response-helper.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [HelperService,PrismaService],
  exports: [HelperService,PrismaService],
})
export class SharedModule {}
