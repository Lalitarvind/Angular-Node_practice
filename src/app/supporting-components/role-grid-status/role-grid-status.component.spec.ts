import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleGridStatusComponent } from './role-grid-status.component';

describe('RoleGridStatusComponent', () => {
  let component: RoleGridStatusComponent;
  let fixture: ComponentFixture<RoleGridStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleGridStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleGridStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
