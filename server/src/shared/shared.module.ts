import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { StudyModule } from '../study/study.module';
import { DatasetModule } from '../dataset/dataset.module';
import { UserPipe } from './pipes/user.pipe';
import { StudyPipe } from './pipes/study.pipe';
import { DatasetPipe } from './pipes/dataset.pipe';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => StudyModule),
    forwardRef(() => DatasetModule),
  ],
  providers: [UserPipe, StudyPipe, DatasetPipe],
  exports: [UserPipe, StudyPipe, DatasetPipe],
})
export class SharedModule {}
