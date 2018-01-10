import { Component, Input, OnInit } from '@angular/core';

import { Player } from '../Common/Models/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {

  @Input() player: Player;

  public currentRank: string;

  constructor() { }

  ngOnInit() {
  }
}
