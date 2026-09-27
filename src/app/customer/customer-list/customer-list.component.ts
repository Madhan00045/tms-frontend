import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService, Customer, FilterItem } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  totalPages = 0;
  totalElements = 0;

  searchTerm: string = '';
  filters: FilterItem[] = [];
  readonly maxFilters = 3;

  availableFilterFields = [
    { value: 'companyName', label: 'Company Name' },
    { value: 'customerCode', label: 'Customer Code' },
    { value: 'contactName', label: 'Contact Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ];

  customerToDelete: Customer | null = null;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService
      .getCustomersPaginated(
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.filters
      )
      .subscribe({
        next: (response) => {
          this.customers = response.content || [];
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.error('Failed to load customers:', error);
          this.errorMessage = 'Failed to load customers';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCustomers();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadCustomers();
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
    this.loadCustomers();
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
    this.loadCustomers();
  }

  resetSearchAndFilter(): void {
    this.searchTerm = '';
    this.filters = [];
    this.currentPage = 0;
    this.loadCustomers();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCustomers();
    }
  }

  createCustomer(): void {
    this.router.navigate(['/customers/create']);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers/edit', customer.id]);
  }

  deleteCustomer(customer: Customer): void {
    this.customerToDelete = customer;
  }

  cancelDelete(): void {
    this.customerToDelete = null;
  }

  confirmDelete(): void {
    if (!this.customerToDelete) {
      return;
    }

    const customerId = this.customerToDelete.id;

    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        this.message = 'Customer deleted successfully';
        setTimeout(() => {
          this.message = '';
        }, 3000);

        this.customerToDelete = null;

        if (this.customers.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }

        this.loadCustomers();
      },
      error: (error) => {
        console.error('Failed to delete customer:', error);
        this.errorMessage = 'Failed to delete customer';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        this.customerToDelete = null;
      }
    });
  }
}
