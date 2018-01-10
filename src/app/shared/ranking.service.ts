import { Injectable } from '@angular/core';
import * as _ from 'underscore';

import { Card } from '../Common/Models/card';
import { RankType } from '../Common/Models/enums';
import { Player } from '../Common/Models/player';
import { HandRank } from '../Common/Models/topHand';
import { RankingLogicService } from './ranking-logic.service';

@Injectable()
export class RankingService {

  constructor(private rankingLogicService: RankingLogicService) { }

  public determineWinner(players: Player[]): number {
    let winner = 0;
    let highestRank = RankType.None;

    if (!players || players.length === 0) {
      throw RangeError('Invalid number of players to determine winner');
    }

    players.forEach(player => {
      if (player.CurrentHand.rank < highestRank) {
        highestRank = player.CurrentHand.rank;
      }
    });

    let highestRankPlayers = _.filter(players, function (player) { return player.CurrentHand.rank === highestRank; });
    if (highestRankPlayers.length > 1) {
      // If there are 2 or more players with same rank find the player with highest kicker
      highestRankPlayers = this.rankingLogicService.getWinner(highestRankPlayers, highestRank);
    }

    // If there is only one player with top rank then treat that player as winner
    highestRankPlayers.forEach(player => {
      if (player) {
        winner = player.Id;
        player.PotsWon++;
        player.IsCurrentHandWinner = true;
        player.CurrentHand.topCards.forEach(card => {
          card.isSelected = true;
        });
      }
    });

    return winner;
  }

  /** This function returns all the combination of cards with their rank **/
  public determineRank(cards: Card[]): HandRank {
    if ((!_.isArray(cards) || cards.length < 2)) {
      throw new RangeError('Unable to find rank for cards');
    }

    if (cards.length > 7) {
      throw new RangeError('Unable to find rank for cards. Too many cards');
    }

    cards.sort(function (a, b) {
      return a.type - b.type;
    });

    let highestRankHand: HandRank;
    let topRank: RankType = RankType.None;
    const cardCombinations = this.getAllCombinations(cards, 5);
    cardCombinations.forEach(handRank => {
      if (handRank.Rank <= topRank) {
        topRank = handRank.Rank;
        highestRankHand = handRank;
      }
    });

    return highestRankHand;
  }

  /** This function returns all the combination of cards **/
  private getAllCombinations(cards: Card[], size: number): HandRank[] {
    if (size > cards.length) {
      size = cards.length;
    }

    const hands: HandRank[] = [];
    const results = [];
    let cardCombo, mask, i;
    const total = Math.pow(2, cards.length);
    for (mask = size; mask < total; mask++) {
      cardCombo = [];
      i = cards.length - 1;

      do {
        // tslint:disable-next-line:no-bitwise
        if ((mask & (1 << i)) !== 0) {
          cardCombo.push(cards[i]);
        }
      } while (i--);

      if (cardCombo.length === size) {
        const hand = new HandRank();
        hand.Cards = cardCombo;
        hand.Rank = this.rankingLogicService.getRank(cardCombo);
        hands.push(hand);
        results.push(cardCombo);
      }
    }

    return hands;
  }

}
