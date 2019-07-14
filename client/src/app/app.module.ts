import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { StoreModule } from '@ngrx/store'
import { REDUCERS, metaReducers, EFFECTS } from './store'
import { EffectsModule } from '@ngrx/effects'
import { COMPONENTS } from './components'
import { LoginComponent } from './auth/login'
import { AngularFireModule } from '@angular/fire'
import { environment } from 'src/environments/environment'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { TokenInterceptor } from './auth/token.interceptor'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot(EFFECTS),
    AngularFireModule.initializeApp(environment.firebaseConfig, 'jmkac-autofocus'),
    AngularFireAuthModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
