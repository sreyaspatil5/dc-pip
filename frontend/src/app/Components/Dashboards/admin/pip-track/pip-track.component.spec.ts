import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIPTrackComponent } from './pip-track.component';

describe('PIPTrackComponent', () => {
  let component: PIPTrackComponent;
  let fixture: ComponentFixture<PIPTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PIPTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PIPTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
