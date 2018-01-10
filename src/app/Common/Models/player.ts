import { Hand } from './Hand';

export class Player {

    Id: number;
    Name: string;
    Icon: string;
    Chips: number;
    GamesPlayed: number;
    PotsWon: number;
    CurrentHand: Hand;
    IsBot: boolean;
    IsCurrentHandWinner: boolean;

    constructor(playerId: number, playerName: string) {
        this.Id = playerId;
        this.Name = playerName;
        this.PotsWon = 0;
        this.GamesPlayed = 0;
        this.Chips = 10000;
        this.CurrentHand = null;
        this.IsBot = true;
        this.IsCurrentHandWinner = false;
    }
}
