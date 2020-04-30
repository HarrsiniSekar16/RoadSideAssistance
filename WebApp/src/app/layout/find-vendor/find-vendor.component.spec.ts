import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindVendorComponent } from './find-vendor.component';

describe('FindVendorComponent', () => {
  let component: FindVendorComponent;
  let fixture: ComponentFixture<FindVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
