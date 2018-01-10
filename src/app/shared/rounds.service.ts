import { Injectable } from '@angular/core';

import { Round } from '../Common/Models/card';
import { Rounds } from '../Common/Models/card';

@Injectable()
export class RoundsService {

    constructor() { }

    // the name of the browser session store that holds the rounds as a json string
    private roundsStoreName = 'rounds';

    // get all rounds held in the browser session store
    public getRounds(): Round[] {
        let rounds: Rounds = [];
        const roundsJson: any = window.sessionStorage.getItem(this.roundsStoreName);
        if (roundsJson || rounds.length > 0) {
            rounds = JSON.parse(roundsJson);
        }

        return rounds;
    }

    // add a new round to the rounds held in the session store
    public addRound(round: Round): void {

        // sanity checks
        if (!round) {
            throw new RangeError('Unable to add a round because the round data passed in is incomplete');
        }

        // get the existing rounds and add the new round to them
        const updatedRounds: Round[] = this.getRounds().concat(round);

        // save the updated rounds
        window.sessionStorage.setItem(this.roundsStoreName, JSON.stringify(updatedRounds));
    }

}
