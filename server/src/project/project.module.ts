import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectController } from './project.controller';
import { Project, ProjectSchema } from './project.schema';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectResolver],
  exports: [],
})
export class ProjectModule {}
