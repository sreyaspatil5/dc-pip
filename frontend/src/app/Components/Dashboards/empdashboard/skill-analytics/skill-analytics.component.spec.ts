import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillAnalyticsComponent } from './skill-analytics.component';

describe('SkillAnalyticsComponent', () => {
  let component: SkillAnalyticsComponent;
  let fixture: ComponentFixture<SkillAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
