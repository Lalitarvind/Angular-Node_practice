import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDetailsFormComponent } from './role-details-form.component';

describe('RoleDetailsFormComponent', () => {
  let component: RoleDetailsFormComponent;
  let fixture: ComponentFixture<RoleDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
