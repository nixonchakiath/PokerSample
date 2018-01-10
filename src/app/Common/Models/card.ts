import { CardType, SuitType } from './enums';
import { Hand } from './Hand';

export class Card {
    type: CardType;
    suit: SuitType;
    isSelected: boolean;
}

export interface IRound {
    roundDate: Date;
    numberOfPlayers: number;
    hands: Hand[];
    winningPlayerNumber: number;
    potSize: number;
}

export class Round implements IRound {
    roundDate: Date;
    numberOfPlayers: number;
    hands: Hand[];
    winningPlayerNumber: number;
    potSize: number;
}

export class Rounds extends Array<IRound> {
}
