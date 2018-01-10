import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { CardTypeComponent } from './card-type/card-type.component';
import { CardComponent } from './card/card.component';
import { DealerComponent } from './dealer/dealer.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { PlayerComponent } from './player/player.component';
import { GameService } from './shared/game.service';
import { RankingLogicService } from './shared/ranking-logic.service';
import { RankingService } from './shared/ranking.service';
import { RoundsService } from './shared/rounds.service';
import { SuitComponent } from './suit/suit.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    PlayerComponent,
    DealerComponent,
    CardComponent,
    SuitComponent,
    CardTypeComponent
  ],
  imports: [AlertModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
  ],
  providers: [GameService, RoundsService, RankingService, RankingLogicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
