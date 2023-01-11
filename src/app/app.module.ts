import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { DockModule } from 'primeng/dock';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ChatComponent } from './components/chat/chat.component';
import { CharSelectComponent } from './components/char-select/char-select.component';
import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/websocket.service';
import { CharacterService } from './services/character.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ChatService } from './services/chat.service';
import { LocationService } from './services/location.service';
import { StateService } from './services/state.service';
import { MorphService } from './services/morph.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ChatComponent,
    CharSelectComponent,
    LoginComponent,
    GameComponent,
    ProgressBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    DividerModule,
    TooltipModule,
    DockModule,
  ],
  providers: [
    WebsocketService,
    AuthService,
    CharacterService,
    ChatService,
    LocationService,
    StateService,
    MorphService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
