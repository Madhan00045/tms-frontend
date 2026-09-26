import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLoadStatusComponent } from './update-load-status.component';

describe('UpdateLoadStatusComponent', () => {
  let component: UpdateLoadStatusComponent;
  let fixture: ComponentFixture<UpdateLoadStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLoadStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLoadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
