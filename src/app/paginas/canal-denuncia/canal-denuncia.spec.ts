import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalDenuncia } from './canal-denuncia';

describe('CanalDenuncia', () => {
  let component: CanalDenuncia;
  let fixture: ComponentFixture<CanalDenuncia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanalDenuncia],
    }).compileComponents();

    fixture = TestBed.createComponent(CanalDenuncia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
