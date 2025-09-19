import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGapFormComponent } from './skill-gap-form.component';

describe('SkillGapFormComponent', () => {
  let component: SkillGapFormComponent;
  let fixture: ComponentFixture<SkillGapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillGapFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillGapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
