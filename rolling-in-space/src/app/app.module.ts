import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerBoxComponent } from './player-box/player-box.component';
import { ConsumablesComponent } from './consumables/consumables.component';
import { RollInfoComponent } from './roll-info/roll-info.component';
import { ConsumablesService } from './consumables-service.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerBoxComponent,
    ConsumablesComponent,
    RollInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    HttpClientModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
