import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { EntryService } from './services/entry.service';
import { BackendService } from './services/backend.service';
import { StudyService } from './services/study.service';
import { UserService } from './services/user.service';
import { SignLabHttpClient } from './services/http.service';
import {
  AdminAuthGuard,
  AuthenticatedGuard,
  OwnerAuthGuard,
} from './guards/auth.guard';
import { StudyGuard } from './guards/study.guard';
import { TokenService } from './services/token.service';
import { TagService } from './services/tag.service';
import { DatasetService } from './services/dataset.service';
import { VideoTagUploadService } from './services/video-tag-upload.service';
import { MaterialModule } from '../material.module';
import { ProjectService } from './services/project.service';
import { ProjectGuard } from './guards/project.guard';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MaterialModule],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        AuthService,
        EntryService,
        BackendService,
        StudyService,
        UserService,
        AuthenticatedGuard,
        AdminAuthGuard,
        OwnerAuthGuard,
        StudyGuard,
        TokenService,
        TagService,
        DatasetService,
        VideoTagUploadService,
        ProjectService,
        ProjectGuard,
        {
          provide: SignLabHttpClient,
          useFactory: (http: HttpClient, tokenService: TokenService) => {
            return new SignLabHttpClient(http, tokenService);
          },
          deps: [HttpClient, TokenService],
        },
      ],
    };
  }
}
