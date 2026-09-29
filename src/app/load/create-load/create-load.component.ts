import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadService } from '../load.service';
import { CustomerService, Customer } from '../../customer/customer.service';
import { CarrierService, Carrier } from '../../carrier/carrier.service';

@Component({
  selector: 'app-create-load',
  templateUrl: './create-load.component.html',
  styleUrls: ['./create-load.component.css']
})
export class CreateLoadComponent implements OnInit {

  loadForm!: FormGroup;
  customers: Customer[] = [];
  carriers: Carrier[] = [];

  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private loadService: LoadService,
    private customerService: CustomerService,
    private carrierService: CarrierService
  ) {}

  ngOnInit(): void {

    this.loadForm = this.formBuilder.group({
      customerId: ['', Validators.required],
      carrierId: ['', Validators.required],
      bolNumber: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      deliveryLocation: ['', Validators.required],
      pickupDate: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      weight: ['', Validators.required],
      pieces: ['', Validators.required],
      status: ['CREATED', Validators.required]
    });
    this.loadCustomers();
    this.loadCarriers();
  }

  createLoad(): void {

    if (this.loadForm.invalid) {
      this.loadForm.markAllAsTouched();
      return;
    }

    this.loadService
      .createLoad(this.loadForm.value)
      .subscribe({

        next: (response: any) => {
          console.log('Load created:', response);

          if (response && response.loadNumber) {
            this.message = `Load created successfully with Load Number: ${response.loadNumber}`;
          } else if (response && response.message) {
            this.message = response.message;
          } else {
            this.message = 'Load created successfully';
          }

          setTimeout(() => {
            this.message = '';
          }, 4000);

          this.loadForm.reset({
            status: 'CREATED'
          });
        },

        error: (error) => {

          console.error('Load creation failed:', error);

          this.message = 'Failed to create load';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      });
  }
  loadCustomers(): void {
  this.customerService.getCustomersLookup().subscribe({
    next: (data) => {
      this.customers = data;
    },
    error: (error) => {
      console.error('Failed to load customers:', error);
    }
  });
}

loadCarriers(): void {
  this.carrierService.getCarrierLookup().subscribe({
    next: (data) => {
      this.carriers = data;
    },
    error: (error) => {
      console.error('Failed to load carriers:', error);
    }
  });
}

}