import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ResponseService } from './services/response.service';
import { BackendService } from './services/backend.service';
import { StudyService } from './services/study.service';
import { UserService } from './services/user.service';
import { SignLabHttpClient } from './services/http.service';
import { AdminAuthGuard, AuthenticatedGuard } from './guards/auth.guard';

/**
 * Configuration values which are needed to setup the core services
 */
interface CoreConfig {
  baseUrl: string;
}

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
})
export class CoreModule {
  static forRoot(coreConfig: CoreConfig): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        AuthService,
        ResponseService,
        BackendService,
        StudyService,
        UserService,
        AuthenticatedGuard,
        AdminAuthGuard,
        {
          provide: SignLabHttpClient,
          useFactory: (http: HttpClient) =>
            new SignLabHttpClient(http, coreConfig.baseUrl),
          deps: [HttpClient],
        },
      ],
    };
  }
}