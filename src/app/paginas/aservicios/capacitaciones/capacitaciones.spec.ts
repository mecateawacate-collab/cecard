import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Capacitaciones } from './capacitaciones';

describe('Capacitaciones', () => {
  let component: Capacitaciones;
  let fixture: ComponentFixture<Capacitaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capacitaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Capacitaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
