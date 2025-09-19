import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportviewComponent } from './reportview.component';

describe('ReportviewComponent', () => {
  let component: ReportviewComponent;
  let fixture: ComponentFixture<ReportviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
