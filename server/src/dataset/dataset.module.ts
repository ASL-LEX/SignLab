import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { DatasetController } from './dataset.controller';
import { Dataset, DatasetSchema } from './dataset.schema';
import { DatasetService } from './dataset.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [DatasetController],
  providers: [DatasetService],
  exports: [DatasetService],
})
export class DatasetModule {}
