import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { StudyModule } from '../study/study.module';
import { UserPipe } from './pipes/user.pipe';
import { StudyPipe } from './pipes/study.pipe';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => StudyModule)],
  providers: [UserPipe, StudyPipe],
  exports: [UserPipe, StudyPipe],
})
export class SharedModule {}
