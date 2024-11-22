import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDataComponent } from './invoice-data.component';

describe('InvoiceDataComponent', () => {
  let component: InvoiceDataComponent;
  let fixture: ComponentFixture<InvoiceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
