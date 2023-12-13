import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemFormComponent } from './create-item-form.component';

describe('CreateDishFormComponent', () => {
  let component: CreateItemFormComponent;
  let fixture: ComponentFixture<CreateItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateItemFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
