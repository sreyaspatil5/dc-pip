import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPerformanceReviewComponent } from './submit-performance-review.component';

describe('SubmitPerformanceReviewComponent', () => {
  let component: SubmitPerformanceReviewComponent;
  let fixture: ComponentFixture<SubmitPerformanceReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitPerformanceReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitPerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
