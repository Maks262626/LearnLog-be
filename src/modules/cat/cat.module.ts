import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cat, catProviders } from './entities/cat.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [CatController],
  providers: [CatService,...catProviders],
})
export class CatModule {}
