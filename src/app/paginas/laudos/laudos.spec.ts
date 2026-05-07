import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Laudos } from './laudos';

describe('Laudos', () => {
  let component: Laudos;
  let fixture: ComponentFixture<Laudos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Laudos],
    }).compileComponents();

    fixture = TestBed.createComponent(Laudos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
