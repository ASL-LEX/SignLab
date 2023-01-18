// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FirstTimeSetupModule } from './first-time-setup/first-time-setup.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { NavigationModule } from './navigation/navigation.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

// Routing
import { RouterModule } from '@angular/router';
import { GraphQLModule } from './graphql.module';

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
    GraphQLModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
