import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { StudyModule } from '../study/study.module';
import { DatasetModule } from '../dataset/dataset.module';
import { UserPipe } from './pipes/user.pipe';
import { StudyPipe } from './pipes/study.pipe';
import { DatasetPipe } from './pipes/dataset.pipe';
import { ProjectPipe } from './pipes/project.pipe';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => StudyModule),
    forwardRef(() => DatasetModule),
    forwardRef(() => ProjectModule)
  ],
  providers: [UserPipe, StudyPipe, DatasetPipe, ProjectPipe],
  exports: [UserPipe, StudyPipe, DatasetPipe, ProjectPipe]
})
export class SharedModule {}
