import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import  {MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerBoxComponent } from './player-box/player-box.component';
import { ConsumablesComponent } from './consumables/consumables.component';
import { RollInfoComponent } from './roll-info/roll-info.component';
import { ConsumablesService } from './services/consumables-service.service';
import { EnabledControlDirective } from './directives/enableControl';
import { NewCharacterComponent } from './new-character/new-character.component';
import { ChatLogComponent } from './chat-log/chat-log.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerBoxComponent,
    ConsumablesComponent,
    RollInfoComponent,
    EnabledControlDirective,
    NewCharacterComponent,
    ChatLogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatGridListModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent, PlayerBoxComponent],
  exports: [EnabledControlDirective]
})
export class AppModule { }
