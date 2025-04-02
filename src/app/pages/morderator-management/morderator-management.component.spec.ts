import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorderatorManagementComponent } from './morderator-management.component';

describe('MorderatorManagementComponent', () => {
  let component: MorderatorManagementComponent;
  let fixture: ComponentFixture<MorderatorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorderatorManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorderatorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
