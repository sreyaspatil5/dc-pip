import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestTokenComponent } from './request-token.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('RequestTokenComponent', () => {
  let component: RequestTokenComponent;
  let fixture: ComponentFixture<RequestTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTokenComponent, ReactiveFormsModule],
      providers: [
        {
          provide: EmployeeService,
          useValue: { requestOtp: () => of({}) }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create RequestTokenComponent', () => {
    expect(component).toBeTruthy();
  });
});
