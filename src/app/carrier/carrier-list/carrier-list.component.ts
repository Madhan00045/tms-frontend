import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrierService, Carrier, FilterItem } from '../carrier.service';

@Component({
  selector: 'app-carrier-list',
  templateUrl: './carrier-list.component.html',
  styleUrls: ['./carrier-list.component.css']
})
export class CarrierListComponent implements OnInit {

  carriers: Carrier[] = [];
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  totalPages = 0;
  totalElements = 0;

  searchTerm: string = '';
  filters: FilterItem[] = [];
  readonly maxFilters = 3;

  availableFilterFields = [
    { value: 'carrierName', label: 'Carrier Name' },
    { value: 'carrierCode', label: 'Carrier Code' },
    { value: 'contactName', label: 'Contact Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ];

  carrierToDelete: Carrier | null = null;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private carrierService: CarrierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCarriers();
  }

  loadCarriers(): void {
    this.carrierService
      .getCarriersPaginated(
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.filters
      )
      .subscribe({
        next: (response) => {
          this.carriers = response.content || [];
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.error('Failed to load carriers:', error);
          this.errorMessage = 'Failed to load carriers';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCarriers();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadCarriers();
  }

  addFilter(): void {
    if (this.filters.length >= this.maxFilters) {
      return;
    }
    const available = this.availableFilterFields.find(
      opt => !this.filters.some(f => f.field === opt.value)
    );
    this.filters.push({
      field: available ? available.value : '',
      value: ''
    });
  }

  removeFilter(index: number): void {
    this.filters.splice(index, 1);
    this.currentPage = 0;
    this.loadCarriers();
  }

  onFilterFieldChange(filter: FilterItem): void {
    filter.value = '';
  }

  isFieldDisabled(fieldValue: string, currentIndex: number): boolean {
    return this.filters.some((f, idx) => idx !== currentIndex && f.field === fieldValue);
  }

  getFieldLabel(field: string): string {
    const match = this.availableFilterFields.find(f => f.value === field);
    return match ? match.label : 'Value';
  }

  onPageSizeChange(): void {
    this.pageSize = Number(this.pageSize);
    this.currentPage = 0;
    this.loadCarriers();
  }

  resetSearchAndFilter(): void {
    this.searchTerm = '';
    this.filters = [];
    this.currentPage = 0;
    this.loadCarriers();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCarriers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCarriers();
    }
  }

  createCarrier(): void {
    this.router.navigate(['/carriers/create']);
  }

  editCarrier(carrier: Carrier): void {
    this.router.navigate(['/carriers/edit', carrier.id]);
  }

  deleteCarrier(carrier: Carrier): void {
    this.carrierToDelete = carrier;
  }

  cancelDelete(): void {
    this.carrierToDelete = null;
  }

  confirmDelete(): void {
    if (!this.carrierToDelete) {
      return;
    }

    const carrierId = this.carrierToDelete.id;

    this.carrierService.deleteCarrier(carrierId).subscribe({
      next: () => {
        this.message = 'Carrier deleted successfully';
        setTimeout(() => {
          this.message = '';
        }, 3000);

        this.carrierToDelete = null;

        if (this.carriers.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }

        this.loadCarriers();
      },
      error: (error) => {
        console.error('Failed to delete carrier:', error);
        this.errorMessage = 'Failed to delete carrier';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        this.carrierToDelete = null;
      }
    });
  }
}
