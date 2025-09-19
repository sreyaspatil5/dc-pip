import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToPipComponent } from './add-to-pip.component';

describe('AddToPipComponent', () => {
  let component: AddToPipComponent;
  let fixture: ComponentFixture<AddToPipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToPipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToPipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
