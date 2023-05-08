import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { EntryService } from './services/entry.service';
import { StudyService } from './services/study.service';
import { UserService } from './services/user.service';
import { SignLabHttpClient } from './services/http.service';
import { AuthenticatedGuard } from './guards/auth.guard';
import { StudyGuard } from './guards/study.guard';
import { TokenService } from './services/token.service';
import { TagService } from './services/tag.service';
import { DatasetService } from './services/dataset.service';
import { VideoTagUploadService } from './services/video-tag-upload.service';
import { MaterialModule } from '../material.module';
import { ProjectService } from './services/project.service';
import { ProjectGuard } from './guards/project.guard';
import { ApolloModule } from 'apollo-angular';
import { OrganizationService } from './services/organization.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MaterialModule, ApolloModule]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        AuthService,
        EntryService,
        StudyService,
        UserService,
        AuthenticatedGuard,
        StudyGuard,
        TokenService,
        TagService,
        DatasetService,
        VideoTagUploadService,
        ProjectService,
        ProjectGuard,
        OrganizationService,
        {
          provide: SignLabHttpClient,
          useFactory: (http: HttpClient, tokenService: TokenService) => {
            return new SignLabHttpClient(http, tokenService);
          },
          deps: [HttpClient, TokenService]
        }
      ]
    };
  }
}
