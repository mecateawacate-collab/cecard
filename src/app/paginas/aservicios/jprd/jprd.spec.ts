import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jprd } from './jprd';

describe('Jprd', () => {
  let component: Jprd;
  let fixture: ComponentFixture<Jprd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jprd],
    }).compileComponents();

    fixture = TestBed.createComponent(Jprd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
