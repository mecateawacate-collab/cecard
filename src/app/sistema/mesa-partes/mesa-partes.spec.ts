import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaPartes } from './mesa-partes';

describe('MesaPartes', () => {
  let component: MesaPartes;
  let fixture: ComponentFixture<MesaPartes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesaPartes],
    }).compileComponents();

    fixture = TestBed.createComponent(MesaPartes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
