import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {SharedModule} from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { DatasetController } from './dataset.controller';
import {DatasetResolver} from './dataset.resolver';
import { Dataset, DatasetSchema } from './dataset.schema';
import { DatasetService } from './dataset.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => SharedModule),
  ],
  controllers: [DatasetController],
  providers: [DatasetService, DatasetResolver],
  exports: [DatasetService],
})
export class DatasetModule {}
