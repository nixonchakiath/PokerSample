import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { Card, Round } from '../Common/Models/card';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css'],
  animations: [
    trigger('cardsanimation', [
      transition('*=>*', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'transalteY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'transalteY(30px)', offset: .3 }),
            style({ opacity: 1, transform: 'transalteY(0)', offset: 1 }),
          ]))]), { optional: true }),
        query(':leave', stagger('300ms', [
          animate('.6s ease-out', keyframes([
            style({ opacity: 1, transform: 'transalteY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'transalteY(35px)', offset: .3 }),
            style({ opacity: 0, transform: 'transalteY(-75%)', offset: 1 }),
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class DealerComponent implements OnInit {

  @Input() round: Round;
  @Input() flops: Card[];
  @Input() turn: Card;
  @Input() river: Card;
  constructor() { }

  ngOnInit() {
  }

}
