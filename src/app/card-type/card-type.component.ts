import { Component, Input, OnInit } from '@angular/core';

import { CardType } from '../Common/Models/enums';

@Component({
  selector: 'app-card-type',
  templateUrl: './card-type.component.html',
  styleUrls: ['./card-type.component.css']
})
export class CardTypeComponent implements OnInit {

  @Input() type: CardType;

  constructor() { }

  ngOnInit() {
  }

}
