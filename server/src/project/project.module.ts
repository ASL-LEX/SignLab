import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Project, ProjectSchema } from './project.schema';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { SharedModule } from '../shared/shared.module';
import { ProjectChangePipe } from './project.dto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => SharedModule)
  ],
  providers: [ProjectService, ProjectResolver, ProjectChangePipe],
  exports: [ProjectService]
})
export class ProjectModule {}
