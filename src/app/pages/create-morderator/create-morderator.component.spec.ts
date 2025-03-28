import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMorderatorComponent } from './create-morderator.component';

describe('CreateMorderatorComponent', () => {
  let component: CreateMorderatorComponent;
  let fixture: ComponentFixture<CreateMorderatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMorderatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMorderatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
