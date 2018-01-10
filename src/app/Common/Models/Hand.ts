import { GameService } from '../../shared/game.service';
import { Card } from './card';
import { RankType } from './enums';


export interface IHand {
    handId: number;
    playerId: number;
    cards: Card[];
    rank: RankType;
    rankDescription: string;
}

export class Hand implements IHand {
    handId: number;
    playerId: number;
    cards: Card[];
    rank: RankType;
    rankDescription: string;
    topCards: Card[];

    constructor(private gameService: GameService, id: number, playerNumber: number) {
        this.cards = [];
        this.topCards = [];
        this.rank = RankType.None;
        this.handId = id;
        this.playerId = playerNumber;
        this.rankDescription = '';
    }

    public calculateRank() {
        const rankHand = this.gameService.checkRank(this.cards);
        this.rank = rankHand.Rank;
        this.topCards = rankHand.Cards;
        this.rankDescription = RankType[this.rank];
        this.rankDescription = this.rankDescription.replace(/_/g, ' ');
    }
}
