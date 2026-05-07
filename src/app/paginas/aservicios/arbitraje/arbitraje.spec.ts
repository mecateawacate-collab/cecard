import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Arbitraje } from './arbitraje';

describe('Arbitraje', () => {
  let component: Arbitraje;
  let fixture: ComponentFixture<Arbitraje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Arbitraje],
    }).compileComponents();

    fixture = TestBed.createComponent(Arbitraje);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
