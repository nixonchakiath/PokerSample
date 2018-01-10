import { Injectable } from '@angular/core';
import * as _ from 'underscore';

import { Card, Round } from '../Common/Models/card';
import { CardType, SuitType } from '../Common/Models/enums';
import { Hand } from '../Common/Models/Hand';
import { Player } from '../Common/Models/player';
import { HandRank } from '../Common/Models/topHand';
import { RankingService } from './ranking.service';

@Injectable()
export class GameService {
  flops: Card[] = [];
  turn: Card;
  river: Card;

  private players: Player[] = [];
  private manualPlayer: Player;

  constructor(private rankService: RankingService) {
    this.createCardPack();
    this.createPlayers();
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public checkRank(playerCards: Card[]): HandRank {
    let possibleHand: Card[] = playerCards;
    if (this.flops.length > 0) {
      possibleHand = _.union(playerCards, this.flops);
    }
    if (this.turn) {
      possibleHand.push(this.turn);
    }

    if (this.river) {
      possibleHand.push(this.river);
    }
    return this.rankService.determineRank(possibleHand);
  }

  public getFlop(cards: Card[]): Card[] {
    this.flops = this.getNextCardsFromDeck(cards, 3);
    return this.flops;
  }

  public getTurn(cards: Card[]): Card {
    this.turn = this.getNextCardsFromDeck(cards, 1)[0];
    return this.turn;
  }

  public getRiver(cards: Card[]): Card {
    this.river = this.getNextCardsFromDeck(cards, 1)[0];
    return this.river;
  }

  public shuffleCardPack(cards: Card[], shuffleTimes: number): Card[] {
    if ((!_.isArray(cards) || cards.length < 1)) {
      throw new RangeError('Unable to shuffle cards because the cards passed are invalid');
    }

    if (_.isNaN(shuffleTimes)) {
      throw new RangeError('Unable to shuffle cards because the card shuffle times is invalid');
    }

    let shuffle = 0;
    while (shuffle < shuffleTimes) {
      shuffle += 1;
      const shuffledCards: Card[] = _.shuffle(cards) as Card[];
      cards = shuffledCards;
    }
    return cards;
  }

  public dealCards(cards: Card[], numberOfCardsToDraw: number, players: Player[]): Round {

    if ((!_.isArray(players) || players.length < 1)) {
      throw new RangeError('Unable to deal cards because the Players passed are invalid');
    }

    if ((!_.isArray(cards) || cards.length < 1)) {
      throw new RangeError('Unable to deal cards because the cards passed are invalid');
    }

    if (_.isNaN(numberOfCardsToDraw)) {
      throw new RangeError('Unable to draw cards because the number of cards to draw passed is invalid');
    }

    const numberOfPlayers: number = players.length;
    if (_.isNaN(numberOfPlayers) || numberOfPlayers < 2 || numberOfPlayers > 6) {
      throw new RangeError('Unable to draw cards because the number of players passed is invalid');
    }

    const round: any = {
      numberOfPlayers: numberOfPlayers,
      hands: [],
      roundDate: new Date(),
      winningPlayerNumber: null,
      potSize: 0
    };

    let drawNumber = 0;
    let playerNumber = 0;
    let handNumber = 0;
    let hand: Hand;

    while (playerNumber < numberOfPlayers) {
      playerNumber += 1;
      handNumber += 1;
      hand = new Hand(this, handNumber, playerNumber);

      while (drawNumber < numberOfCardsToDraw && cards.length > 0) {
        drawNumber += 1;
        const drawCard: Card = cards.splice(Math.floor(Math.random() * numberOfCardsToDraw), 1)[0] || null;
        if (!drawCard) {
          throw new RangeError('Unable to deal cards because no cards left to draw');
        }
        hand.cards.push(drawCard);
      }

      const currentPlayer = players.find(player => player.Id === playerNumber);
      currentPlayer.CurrentHand = hand;
      currentPlayer.Chips -= 100;
      round.potSize += 100;
      round.hands.push(hand);
      drawNumber = 0;

    }
    return round;
  }

  public getNextCardsFromDeck(cards: Card[], numberOfCardsToDraw: number): Card[] {
    let cardIndex = 0;
    const selectedCards: Card[] = [];
    while (cardIndex < numberOfCardsToDraw) {
      const drawCard: Card = cards.splice(1, 1)[0] || null;
      selectedCards.push(drawCard);
      cardIndex++;
    }

    return selectedCards;
  }

  private createPlayers() {
    const player1 = new Player(1, 'Phil Ivy');
    player1.Icon = '../assets/images/phil.jpeg';

    const player2 = new Player(2, 'Abignale');
    player2.Icon = '../assets/images/abignale.jpg';

    this.manualPlayer = new Player(3, 'You');
    this.manualPlayer.IsBot = false;

    const player4 = new Player(4, 'Daniel');

    this.players.push(player1);
    this.players.push(player2);
    this.players.push(this.manualPlayer);
    this.players.push(player4);
  }

  public createCardPack(): Card[] {
    const clubs: Card[] = this.createCardsForSuit(SuitType.club);
    const hearts: Card[] = this.createCardsForSuit(SuitType.heart);
    const spades: Card[] = this.createCardsForSuit(SuitType.spade);
    const diamonds: Card[] = this.createCardsForSuit(SuitType.diamond);
    const cardPack: Card[] = _.union(clubs, hearts, spades, diamonds);
    return cardPack;
  }

  private createCardsForSuit(cardSuit: SuitType): Card[] {
    const cardPack: Card[] = [];
    cardPack.push({ type: CardType.ace, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.king, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.queen, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.jack, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.ten, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.nine, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.eight, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.seven, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.six, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.five, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.four, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.three, suit: cardSuit, isSelected: false });
    cardPack.push({ type: CardType.two, suit: cardSuit, isSelected: false });
    return cardPack;
  }

}
