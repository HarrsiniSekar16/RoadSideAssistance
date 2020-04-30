import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVendorComponent } from './request-vendor.component';

describe('RequestVendorComponent', () => {
  let component: RequestVendorComponent;
  let fixture: ComponentFixture<RequestVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
