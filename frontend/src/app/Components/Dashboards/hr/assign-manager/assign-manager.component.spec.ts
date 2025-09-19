import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignManagerComponent } from './assign-manager.component';

describe('AssignManagerComponent', () => {
  let component: AssignManagerComponent;
  let fixture: ComponentFixture<AssignManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
