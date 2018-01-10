import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTypeComponent } from './card-type.component';

describe('CardTypeComponent', () => {
  let component: CardTypeComponent;
  let fixture: ComponentFixture<CardTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
