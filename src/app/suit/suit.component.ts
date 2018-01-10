import { Component, Input, OnInit } from '@angular/core';

import { SuitType } from '../Common/Models/enums';

@Component({
  selector: 'app-suit',
  templateUrl: './suit.component.html',
  styleUrls: ['./suit.component.css']
})
export class SuitComponent implements OnInit {

  @Input() suit: SuitType;
  constructor() { }

  ngOnInit() {
  }

}
