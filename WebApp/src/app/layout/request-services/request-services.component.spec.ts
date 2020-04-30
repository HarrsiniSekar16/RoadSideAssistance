import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestServicesComponent } from './request-services.component';

describe('RequestServicesComponent', () => {
  let component: RequestServicesComponent;
  let fixture: ComponentFixture<RequestServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
