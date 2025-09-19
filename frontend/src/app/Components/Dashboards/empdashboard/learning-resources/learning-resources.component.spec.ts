import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningResourcesComponent } from './learning-resources.component';

describe('LearningResourcesComponent', () => {
  let component: LearningResourcesComponent;
  let fixture: ComponentFixture<LearningResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LearningResourcesComponent]
    });
    fixture = TestBed.createComponent(LearningResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter resources correctly', () => {
    component.selectedTopic = 'RxJS';
    expect(component.filteredResources.length).toBe(1);
  });
});
