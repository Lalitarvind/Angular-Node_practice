import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleGridActionsComponent } from './role-grid-actions.component';

describe('RoleGridActionsComponent', () => {
  let component: RoleGridActionsComponent;
  let fixture: ComponentFixture<RoleGridActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleGridActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleGridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
