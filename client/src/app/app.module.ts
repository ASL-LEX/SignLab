// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { InMemoryCache } from '@apollo/client/core'
import { HttpLink } from 'apollo-angular/http'

import { FirstTimeSetupModule } from './first-time-setup/first-time-setup.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { NavigationModule } from './navigation/navigation.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

// Routing
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FirstTimeSetupModule,
    CoreModule.forRoot(),
    NavigationModule,
    ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000/graphql',
          }),
        };
      },
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
