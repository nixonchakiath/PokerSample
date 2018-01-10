import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { Card, Round } from '../Common/Models/card';
import { Player } from '../Common/Models/player';
import { GameService } from '../shared/game.service';
import { RankingService } from '../shared/ranking.service';
import { RoundsService } from '../shared/rounds.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
  animations: [
    trigger('players', [
      transition('*=>*', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'transalteY(-75%)', offset: 0 }),
            style({ opacity: .25, transform: 'transalteY(30px)', offset: .5 }),
            style({ opacity: 1, transform: 'transalteY(0)', offset: 1 }),
          ]))]), { optional: true })
      ])
    ])
  ]
})

export class GameBoardComponent implements OnInit {

  public isPlaying = false;
  public players: Player[] = [];
  public shuffledCards: Card[] = [];
  public flops: Card[] = [];
  public turn: Card;
  public river: Card;
  public roundFinished: boolean;
  public allCardsShown: boolean;
  public winnerPlayer: Player;
  public round: Round;

  constructor(private gameService: GameService, private roundsService: RoundsService, private rankingService: RankingService) { }

  ngOnInit() {
    this.players = this.gameService.getPlayers();
  }

  public resetRound(): void {
    this.winnerPlayer = null;
    this.roundFinished = false;
    this.isPlaying = true;
    this.flops = [];
    this.turn = null;
    this.river = null;
    this.players.forEach(player => {
      if (player.CurrentHand) {
        player.CurrentHand.cards = [];
      }

      player.IsCurrentHandWinner = false;
      player.CurrentHand = null;
    });
  }

  public playRound(): void {
    this.resetRound();
    // 1. Get a new card pack
    const cards: Card[] = this.gameService.createCardPack();

    // 2. Shuffle the deck
    this.shuffledCards = this.gameService.shuffleCardPack(cards, 5);

    // 3. Deal 2 cards for each player
    this.round = this.gameService.dealCards(this.shuffledCards, 2, this.players);
  }

  public finishRound(): void {
    this.checkAllRanks();
    // 4. Determine the winner of the round
    const winningPlayerNumber = this.rankingService.determineWinner(this.players);
    this.winnerPlayer = this.players.find(player => player.Id === winningPlayerNumber);
    this.winnerPlayer.Chips += this.round.potSize;
    this.round.winningPlayerNumber = winningPlayerNumber;

    // display the round and the winner
    this.isPlaying = false;
    this.roundFinished = true;

    // todo: Add the round to the rounds
    this.roundsService.addRound(this.round);
  }

  public showFlop(): void {
    this.flops = this.gameService.getFlop(this.shuffledCards);
  }

  public showTurn(): void {
    this.turn = this.gameService.getTurn(this.shuffledCards);
  }

  public showRiver(): void {
    this.river = this.gameService.getRiver(this.shuffledCards);
    this.allCardsShown = true;
  }

  public checkAllRanks(): void {
    this.players.forEach(player => {
      if (player.CurrentHand) {
        player.CurrentHand.calculateRank();
      }
    });
  }

  public testRun(): void {
    setTimeout(() => {
      this.playRound();
    }, 100);

    setTimeout(() => {
      this.showFlop();
    }, 500);

    setTimeout(() => {
      this.showTurn();
    }, 2000);

    setTimeout(() => {
      this.showRiver();
    }, 3000);

    setTimeout(() => {
      this.finishRound();
    }, 3000);
  }

  // just to check
  public recheckWinner(): void {
    this.checkAllRanks();
    const winnerId = this.rankingService.determineWinner(this.players);
    this.winnerPlayer = this.players.find(player => player.Id === winnerId);
  }

}
