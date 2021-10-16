import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesSummaryComponent } from './cases-summary.component';

describe('CasesSummaryComponent', () => {
  let component: CasesSummaryComponent;
  let fixture: ComponentFixture<CasesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
