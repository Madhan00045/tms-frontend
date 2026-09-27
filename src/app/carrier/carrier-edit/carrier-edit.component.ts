import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrierService, Carrier } from '../carrier.service';

@Component({
  selector: 'app-carrier-edit',
  templateUrl: './carrier-edit.component.html',
  styleUrls: ['./carrier-edit.component.css']
})
export class CarrierEditComponent implements OnInit {

  carrierId!: number;
  carrier: Carrier | null = null;
  carrierForm!: FormGroup;
  loading: boolean = true;
  submitting: boolean = false;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carrierService: CarrierService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'Invalid carrier ID';
      this.loading = false;
      return;
    }

    this.carrierId = Number(idParam);

    this.carrierForm = this.fb.group({
      carrierCode: ['', [Validators.required, Validators.maxLength(50)]],
      carrierName: ['', [Validators.required, Validators.maxLength(150)]],
      contactName: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(30)]],
      email: ['', [Validators.email, Validators.maxLength(150)]]
    });

    this.loadCarrierDetails();
  }

  loadCarrierDetails(): void {
    this.loading = true;
    this.carrierService.getCarrierById(this.carrierId).subscribe({
      next: (carrier) => {
        this.carrier = carrier;
        this.carrierForm.patchValue({
          carrierCode: carrier.carrierCode,
          carrierName: carrier.carrierName,
          contactName: carrier.contactName || '',
          phone: carrier.phone || '',
          email: carrier.email || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load carrier:', error);
        this.errorMessage = 'Carrier not found or failed to load';
        this.loading = false;
      }
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
    this.carrierService.updateCarrier(this.carrierId, this.carrierForm.value).subscribe({
      next: () => {
        this.message = 'Carrier updated successfully';
        setTimeout(() => {
          this.router.navigate(['/carriers']);
        }, 1500);
      },
      error: (error) => {
        console.error('Failed to update carrier:', error);
        this.errorMessage = error.error || 'Failed to update carrier';
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
