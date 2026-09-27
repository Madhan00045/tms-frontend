import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { LoadService, Load } from '../load.service';

@Component({
  selector: 'app-edit-load',
  templateUrl: './edit-load.component.html',
  styleUrls: ['./edit-load.component.css']
})
export class EditLoadComponent implements OnInit {

  loadId!: number;
  load: Load | null = null;
  loading: boolean = true;
  saving: boolean = false;
  message: string = '';
  errorMessage: string = '';

  initialStatus: string = '';
  initialPaymentStatus: string = '';

  status: string = '';
  paymentStatus: string = '';

  loadStatusOptions: string[] = [];

  paymentStatusOptions: string[] = [
    'PAID',
    'UNPAID'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadService: LoadService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.errorMessage = 'Invalid load ID';
      this.loading = false;
      return;
    }

    this.loadId = Number(idParam);
    this.fetchLoadDetails();
  }

  getAvailableStatusOptions(currentStatus: string): string[] {
    const transitions: { [key: string]: string[] } = {
      'CREATED': ['CREATED', 'TENDERED', 'CANCELLED'],
      'TENDERED': ['TENDERED', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      'ACCEPTED': ['ACCEPTED', 'IN_TRANSIT', 'CANCELLED'],
      'REJECTED': ['REJECTED'],
      'IN_TRANSIT': ['IN_TRANSIT', 'DELIVERED','UNDELIVERED'],
      'DELIVERED': ['DELIVERED'],
      'UNDELIVERED':['UNDELIVERED'],
      'CANCELLED': ['CANCELLED']
    };
    const key = (currentStatus || '').toUpperCase();
    return transitions[key] || [currentStatus];
  }

  fetchLoadDetails(): void {
    this.loading = true;
    this.loadService.getLoadById(this.loadId).subscribe({
      next: (data) => {
        this.load = data;
        this.initialStatus = data.status || 'CREATED';
        this.initialPaymentStatus = data.payment_status || (data as any).paymentStatus || 'UNPAID';

        this.status = this.initialStatus;
        this.paymentStatus = this.initialPaymentStatus;
        this.loadStatusOptions = this.getAvailableStatusOptions(this.initialStatus);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch load details:', error);
        this.errorMessage = 'Load not found or has been deleted';
        this.loading = false;
      }
    });
  }

  updateLoad(): void {
    if (!this.status || !this.paymentStatus) {
      this.errorMessage = 'Please select both Load Status and Payment Status';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }

    const statusChanged = this.status !== this.initialStatus;
    const paymentChanged = this.paymentStatus !== this.initialPaymentStatus;

    if (!statusChanged && !paymentChanged) {
      this.message = 'No changes made';
      setTimeout(() => {
        this.router.navigate(['/loads']);
      }, 1000);
      return;
    }

    const requests: Observable<any>[] = [];

    if (statusChanged) {
      requests.push(this.loadService.updateLoadStatus(this.loadId, this.status));
    }

    if (paymentChanged) {
      requests.push(this.loadService.updatePaymentStatus(this.loadId, this.paymentStatus));
    }

    this.saving = true;
    forkJoin(requests).subscribe({
      next: () => {
        this.message = 'Load updated successfully';
        this.saving = false;
        setTimeout(() => {
          this.router.navigate(['/loads']);
        }, 1200);
      },
      error: (error) => {
        console.error('Failed to update load:', error);
        this.errorMessage = error?.error || 'Failed to update load. Please try again.';
        this.saving = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3500);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/loads']);
  }
}
