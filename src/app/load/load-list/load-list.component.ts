import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadService, Load, FilterItem, EditLoadInfoRequest } from '../load.service';
import { CustomerService, Customer } from '../../customer/customer.service';
import { CarrierService, Carrier } from '../../carrier/carrier.service';

@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.css']
})
export class LoadListComponent implements OnInit {

  loads: Load[] = [];
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalPages = 0;
  totalElements = 0;

  // Search & Multiple Filters (0 <= filters <= 3)
  searchTerm: string = '';
  filters: FilterItem[] = [];
  readonly maxFilters = 3;

  availableFilterFields = [
    { value: 'customer', label: 'Customer' },
    { value: 'carrier', label: 'Carrier' },
    { value: 'status', label: 'Status' },
    { value: 'paymentStatus', label: 'Payment Status' },
    { value: 'loadNumber', label: 'Load Number' }
  ];

  // Options for filter dropdowns
  statusOptions: string[] = [
    'CREATED',
    'TENDERED',
    'ACCEPTED',
    'REJECTED',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED'
  ];

  paymentStatusOptions: string[] = [
    'PAID',
    'UNPAID'
  ];

  loadToDelete: Load | null = null;
  message: string = '';
  errorMessage: string = '';

  // Edit Popup Modal State
  isEditModalOpen: boolean = false;
  editingLoad: Load | null = null;
  savingEdit: boolean = false;
  editModalError: string = '';

  customers: Customer[] = [];
  carriers: Carrier[] = [];

  editForm: EditLoadInfoRequest = {
    customerId: 0,
    carrierId: 0,
    bolNumber: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    deliveryDate: '',
    weight: 0,
    pieces: 0
  };

  constructor(
    private loadService: LoadService,
    private customerService: CustomerService,
    private carrierService: CarrierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoads();
    this.loadCustomers();
    this.loadCarriers();
  }

  loadCustomers(): void {
    if (this.customers.length === 0) {
      this.customerService.getCustomers().subscribe({
        next: (data) => {
          this.customers = data || [];
        },
        error: (err) => {
          console.error('Failed to load customers for edit dropdown:', err);
        }
      });
    }
  }

  loadCarriers(): void {
    if (this.carriers.length === 0) {
      this.carrierService.getCarriers().subscribe({
        next: (data) => {
          this.carriers = data || [];
        },
        error: (err) => {
          console.error('Failed to load carriers for edit dropdown:', err);
        }
      });
    }
  }

  loadLoads(): void {
    this.loadService
      .getLoads(
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.filters
      )
      .subscribe({
        next: (response) => {
          this.loads = response.content || [];
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.error('Failed to load loads:', error);
          this.errorMessage = 'Failed to load loads';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadLoads();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadLoads();
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
    this.loadLoads();
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
    this.loadLoads();
  }

  resetSearchAndFilter(): void {
    this.searchTerm = '';
    this.filters = [];
    this.currentPage = 0;
    this.loadLoads();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadLoads();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadLoads();
    }
  }

  // Edit Icon clicked -> Open Modal (only for CREATED loads)
  openEditModal(load: Load): void {
    if (load.status !== 'CREATED') {
      return;
    }

    this.editModalError = '';
    this.editingLoad = load;

    this.editForm = {
      customerId: load.customer_id || 0,
      carrierId: load.carrier_id || 0,
      bolNumber: load.bol_number || '',
      pickupLocation: load.pickup_location || '',
      deliveryLocation: load.delivery_location || '',
      pickupDate: load.pickup_date || '',
      deliveryDate: load.delivery_date || '',
      weight: load.weight || 0,
      pieces: load.pieces != null ? load.pieces : 0
    };

    this.loadCustomers();
    this.loadCarriers();
    this.isEditModalOpen = true;

    // Fetch fresh single load details to ensure exact IDs
    this.loadService.getLoadById(load.id).subscribe({
      next: (fullLoad) => {
        if (fullLoad && this.isEditModalOpen && this.editingLoad?.id === fullLoad.id) {
          this.editingLoad = fullLoad;
          if (fullLoad.customer_id) {
            this.editForm.customerId = fullLoad.customer_id;
          }
          if (fullLoad.carrier_id) {
            this.editForm.carrierId = fullLoad.carrier_id;
          }
          this.editForm.bolNumber = fullLoad.bol_number || '';
          this.editForm.pickupLocation = fullLoad.pickup_location || '';
          this.editForm.deliveryLocation = fullLoad.delivery_location || '';
          this.editForm.pickupDate = fullLoad.pickup_date || '';
          this.editForm.deliveryDate = fullLoad.delivery_date || '';
          this.editForm.weight = fullLoad.weight || 0;
          this.editForm.pieces = fullLoad.pieces != null ? fullLoad.pieces : 0;
        }
      }
    });
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingLoad = null;
    this.editModalError = '';
    this.savingEdit = false;
  }

  saveLoadInfo(): void {
    if (!this.editingLoad) {
      return;
    }

    if (!this.editForm.customerId || this.editForm.customerId === 0) {
      this.editModalError = 'Please select a Customer';
      return;
    }
    if (!this.editForm.carrierId || this.editForm.carrierId === 0) {
      this.editModalError = 'Please select a Carrier';
      return;
    }
    if (!this.editForm.pickupLocation || !this.editForm.pickupLocation.trim()) {
      this.editModalError = 'Pickup Location is required';
      return;
    }
    if (!this.editForm.deliveryLocation || !this.editForm.deliveryLocation.trim()) {
      this.editModalError = 'Delivery Location is required';
      return;
    }

    this.savingEdit = true;
    this.editModalError = '';

    this.loadService.updateLoadInfo(this.editingLoad.id, this.editForm).subscribe({
      next: () => {
        this.message = 'Load updated successfully';
        this.closeEditModal();
        this.loadLoads();
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to update load:', error);
        this.editModalError = error?.error || 'Failed to update load. Please try again.';
        this.savingEdit = false;
      }
    });
  }

  // Click on Status or Payment Status -> Navigate to /loads/edit/{id}
  goToDetails(loadId: number): void {
    this.router.navigate(['/loads/edit', loadId]);
  }

  deleteLoad(load: Load): void {
    this.loadToDelete = load;
  }

  cancelDelete(): void {
    this.loadToDelete = null;
  }

  confirmDelete(): void {
    if (!this.loadToDelete) {
      return;
    }

    const loadId = this.loadToDelete.id;

    this.loadService.deleteLoad(loadId).subscribe({
      next: (response) => {
        this.message = 'Load deleted successfully';
        setTimeout(() => {
          this.message = '';
        }, 3000);

        this.loadToDelete = null;

        if (this.loads.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }

        this.loadLoads();
      },
      error: (error) => {
        console.error('Failed to delete load:', error);
        this.errorMessage = 'Failed to delete load';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        this.loadToDelete = null;
      }
    });
  }
}