import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDirComponent } from './employee-dir.component';

describe('EmployeeDirComponent', () => {
  let component: EmployeeDirComponent;
  let fixture: ComponentFixture<EmployeeDirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
