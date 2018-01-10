import { Injectable } from '@angular/core';
import * as _ from 'underscore';

import { Card } from '../Common/Models/card';
import { CardType, RankType } from '../Common/Models/enums';
import { Player } from '../Common/Models/player';

@Injectable()
export class RankingLogicService {

  constructor() { }

  public getRank(cards: Card[]): RankType {
    let rank: RankType = RankType.High_Card;
    cards.sort(function (a, b) {
      return a.type - b.type;
    });

    if (this.checkForRoyalFlush(cards)) {
      rank = RankType.Royal_Flush;
    } else if (this.checkForStraightFlush(cards)) {
      rank = RankType.Straight_Flush;
    } else if (this.checkFourOfAKind(cards)) {
      rank = RankType.Four_Of_A_Kind;
    } else if (this.checkFullHouse(cards)) {
      rank = RankType.Full_House;
    } else if (this.checkForAFlush(cards)) {
      rank = RankType.Flush;
    } else if (this.checkForAStraight(cards)) {
      rank = RankType.Straight;
    } else if (this.checkThreeOfAKind(cards)) {
      rank = RankType.Three_Of_A_Kind;
    } else if (this.checkForTwoPairs(cards)) {
      rank = RankType.Two_Pair;
    } else if (this.checkForOnePair(cards)) {
      rank = RankType.Pair;
    }
    return rank;
  }

  public getWinner(players: Player[], rank: RankType): Player[] {
    const winners: Player[] = [];
    let winner: Player = null;

    switch (rank) {
      case RankType.High_Card: {
        winner = this.getWinnerWithSimilarHighCard(players);
        winners.push(winner);
        break;
      }
      case RankType.Pair:
      case RankType.Two_Pair:
        {
          winner = this.getWinnerWithSimilarPairs(players, 2);
          winners.push(winner);
          break;
        }
      case RankType.Three_Of_A_Kind:
        {
          winner = this.getWinnerWithSimilarPairs(players, 3);
          winners.push(winner);
          break;
        }

      default:
        winners.push(players[0]);
        break;
    }

    return winners;
  }

  private getWinnerWithSimilarHighCard(players: Player[]): Player {
    let cardType: CardType = CardType.none;
    let topCardType = CardType.two;
    let winner: Player = null;

    players.forEach(player => {
      const playerCards: Card[] = player.CurrentHand.cards.sort(function (a, b) {
        return a.type - b.type;
      });

      cardType = topCardType;
      while (cardType < CardType.ace) {
        if (_.any(playerCards, function (card) { return card.type > topCardType; })) {
          winner = player;
          topCardType = playerCards[1].type;
        }
        cardType++;
      }
    });
    return winner;
  }

  private getWinnerWithSimilarPairs(players: Player[], totalSameCardRequired): Player {
    let cardType: CardType = CardType.none;
    let winner: Player = null;
    // In case of one pair find the highest pair
    players.forEach(player => {
      const playerCards: Card[] = player.CurrentHand.topCards;
      const groupedCards = _.groupBy(playerCards, function (card) { return card.type; });
      // tslint:disable-next-line:forin
      for (const key in groupedCards) {
        const value = groupedCards[key];
        if (value.length === totalSameCardRequired) {
          // current player's pair card type is higher than all previous player's card type
          // then assign that as the top card type
          const currentPlayerCardType: CardType = value[0].type;
          if (currentPlayerCardType > cardType) {
            cardType = currentPlayerCardType;
            winner = player;
          }
        }
      }
    });

    return winner;
  }

  private checkForRoyalFlush(cards: Card[]): boolean {
    // Check all 5 cards are above 9 and of same suit
    const firstCard = _.first(cards);
    const status: boolean =
      cards.length === 5 &&
      cards.every(card => card.suit === firstCard.suit) &&
      cards.every(card => card.type > 9) &&
      this.isContinuousCards(cards);
    return status;
  }

  private checkForStraightFlush(cards: Card[]): boolean {
    // Check all 5 cards continuous and of same suit
    const firstCard = _.first(cards);
    let status: boolean = cards.length === 5 && cards.every(card => card.suit === firstCard.suit);
    if (status) {
      status = this.isContinuousCards(cards);
    }
    return status;
  }

  private checkFourOfAKind(cards: Card[]): boolean {
    let status = false;
    const groupedCards = _.groupBy(cards, function (card) { return card.type; });

    // tslint:disable-next-line:forin
    for (const key in groupedCards) {
      const value = groupedCards[key];
      if (value.length > 3) {
        // found four of a kind
        status = true;
      }
    }
    return status;
  }

  private checkForAFlush(cards: Card[]): boolean {
    // Check all 5 cards are above 9 and of same suit
    const firstCard = _.first(cards);
    const status: boolean =
      cards.length === 5 &&
      cards.every(card => card.suit === firstCard.suit);
    return status;
  }

  private checkForAStraight(cards: Card[]): boolean {
    // Check all 5 cards continuous
    const status: boolean = this.isContinuousCards(cards);
    return status;
  }

  private checkFullHouse(cards: Card[]): boolean {
    let status = false;
    const groupedCards = _.groupBy(cards, function (card) { return card.type; });
    let threeSameCards = false;
    let twoSameCards = false;

    // tslint:disable-next-line:forin
    for (const key in groupedCards) {
      const value = groupedCards[key];
      if (value.length === 3) {
        threeSameCards = true;
      } else if (value.length === 2) {
        twoSameCards = true;
      }
    }

    // Set of 3 same cards and 2 same cards
    if (threeSameCards && twoSameCards) {
      status = true;
    }

    return status;
  }

  private checkThreeOfAKind(cards: Card[]): boolean {
    let status = false;
    const groupedCards = _.groupBy(cards, function (card) { return card.type; });

    // tslint:disable-next-line:forin
    for (const key in groupedCards) {
      const value = groupedCards[key];
      if (value.length > 2) {
        // found three of a kind
        status = true;
      }
    }
    return status;
  }

  private checkForTwoPairs(cards: Card[]): boolean {
    let status = false;
    const groupedCards = _.groupBy(cards, function (card) { return card.type; });
    let totalPairs = 0;

    // tslint:disable-next-line:forin
    for (const key in groupedCards) {
      const value = groupedCards[key];
      if (value.length === 2) {
        totalPairs++;
      }
    }

    if (totalPairs === 2) {
      status = true;
    }
    return status;
  }

  private checkForOnePair(cards: Card[]): boolean {
    let status = false;
    const groupedCards = _.groupBy(cards, function (card) { return card.type; });
    let totalPairs = 0;

    // tslint:disable-next-line:forin
    for (const key in groupedCards) {
      const value = groupedCards[key];
      if (value.length === 2) {
        totalPairs++;
      }
    }

    if (totalPairs === 1) {
      status = true;
    }
    return status;
  }

  private isContinuousCards(cards: Card[]): boolean {
    let status = true;
    const firstCard = _.first(cards);
    let lastCard = _.last(cards);
    let cardType = firstCard.type;

    for (let index = 1; index < cards.length; index++) {
      cardType++;
      if (cardType !== cards[index].type) {
        status = false;
        break;
      }
    }

    // In case 'A', need to check the other pair 'A', '2...,'5'
    if (!status && lastCard.type === 14) {
      cards = cards.slice(3, 1);
      lastCard = _.last(cards);
      status = cards.length === 4 && this.isContinuousCards(cards);
    }

    return status;
  }

}
