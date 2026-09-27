import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {

  customerForm!: FormGroup;
  message: string = '';
  errorMessage: string = '';
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      customerCode: ['', [Validators.required, Validators.maxLength(50)]],
      companyName: ['', [Validators.required, Validators.maxLength(150)]],
      contactName: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(30)]],
      email: ['', [Validators.email, Validators.maxLength(150)]]
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
    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: () => {
        this.message = 'Customer created successfully';
        setTimeout(() => {
          this.router.navigate(['/customers']);
        }, 1500);
      },
      error: (error) => {
        console.error('Failed to create customer:', error);
        this.errorMessage = error.error || 'Failed to create customer';
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
