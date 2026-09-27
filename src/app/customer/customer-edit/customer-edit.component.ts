import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService, Customer } from '../customer.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {

  customerId!: number;
  customer: Customer | null = null;
  customerForm!: FormGroup;
  loading: boolean = true;
  submitting: boolean = false;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'Invalid customer ID';
      this.loading = false;
      return;
    }

    this.customerId = Number(idParam);

    this.customerForm = this.fb.group({
      customerCode: ['', [Validators.required, Validators.maxLength(50)]],
      companyName: ['', [Validators.required, Validators.maxLength(150)]],
      contactName: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(30)]],
      email: ['', [Validators.email, Validators.maxLength(150)]]
    });

    this.loadCustomerDetails();
  }

  loadCustomerDetails(): void {
    this.loading = true;
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.customerForm.patchValue({
          customerCode: customer.customerCode,
          companyName: customer.companyName,
          contactName: customer.contactName || '',
          phone: customer.phone || '',
          email: customer.email || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load customer:', error);
        this.errorMessage = 'Customer not found or failed to load';
        this.loading = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.customerService.updateCustomer(this.customerId, this.customerForm.value).subscribe({
      next: () => {
        this.message = 'Customer updated successfully';
        setTimeout(() => {
          this.router.navigate(['/customers']);
        }, 1500);
      },
      error: (error) => {
        console.error('Failed to update customer:', error);
        this.errorMessage = error.error || 'Failed to update customer';
        this.submitting = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
