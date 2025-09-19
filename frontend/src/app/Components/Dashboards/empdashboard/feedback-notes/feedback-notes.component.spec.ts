import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackNotesComponent } from './feedback-notes.component';

describe('FeedbackNotesComponent', () => {
  let component: FeedbackNotesComponent;
  let fixture: ComponentFixture<FeedbackNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeedbackNotesComponent]
    });
    fixture = TestBed.createComponent(FeedbackNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render existing notes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const notes = compiled.querySelectorAll('p');
    expect(notes.length).toBe(component.notes.length);
  });
});
