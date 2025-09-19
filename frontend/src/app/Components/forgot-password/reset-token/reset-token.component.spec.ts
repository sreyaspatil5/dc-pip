import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetWithTokenComponent } from './reset-token.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';

describe('ResetTokenComponent', () => {
  let component: ResetWithTokenComponent;
  let fixture: ComponentFixture<ResetWithTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetWithTokenComponent, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: new Map([['token', 'abc123']]) } }
        },
        {
          provide: EmployeeService,
          useValue: { resetPasswordWithToken: () => of({}) }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetWithTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ResetTokenComponent', () => {
    expect(component).toBeTruthy();
  });
});
