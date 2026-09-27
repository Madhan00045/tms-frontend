import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarrierService } from '../carrier.service';

@Component({
  selector: 'app-carrier-create',
  templateUrl: './carrier-create.component.html',
  styleUrls: ['./carrier-create.component.css']
})
export class CarrierCreateComponent implements OnInit {

  carrierForm!: FormGroup;
  message: string = '';
  errorMessage: string = '';
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private carrierService: CarrierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrierForm = this.fb.group({
      carrierCode: ['', [Validators.required, Validators.maxLength(50)]],
      carrierName: ['', [Validators.required, Validators.maxLength(150)]],
      contactName: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(30)]],
      email: ['', [Validators.email, Validators.maxLength(150)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.carrierForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.carrierForm.invalid) {
      this.carrierForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.carrierService.createCarrier(this.carrierForm.value).subscribe({
      next: () => {
        this.message = 'Carrier created successfully';
        setTimeout(() => {
          this.router.navigate(['/carriers']);
        }, 1500);
      },
      error: (error) => {
        console.error('Failed to create carrier:', error);
        this.errorMessage = error.error || 'Failed to create carrier';
        this.submitting = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/carriers']);
  }
}
