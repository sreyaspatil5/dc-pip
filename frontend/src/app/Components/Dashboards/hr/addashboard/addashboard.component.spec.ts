import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddashboardComponent } from './addashboard.component';

describe('AddashboardComponent', () => {
  let component: AddashboardComponent;
  let fixture: ComponentFixture<AddashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
