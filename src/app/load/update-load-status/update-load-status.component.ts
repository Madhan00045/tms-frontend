import { Component, OnInit } from '@angular/core';
import { LoadService, Load } from '../load.service';

@Component({
  selector: 'app-update-load-status',
  templateUrl: './update-load-status.component.html',
  styleUrls: ['./update-load-status.component.css']
})
export class UpdateLoadStatusComponent implements OnInit {

  loads: Load[] = [];
  selectedLoadId: number | null = null;
  selectedStatus: string = '';
  message: string = '';

  constructor(private loadService: LoadService) { }

  ngOnInit(): void {
    this.loadLoads();
  }

  loadLoads(): void {
    this.loadService.getLoads(0, 1000).subscribe({
      next: (data) => {
        this.loads = data;
      },
      error: (error) => {
        console.error('Failed to load loads', error);
      }
    });
  }
updateStatus(): void {

  if (!this.selectedLoadId || !this.selectedStatus) {
    return;
  }

  this.loadService
    .updateLoadStatus(
      this.selectedLoadId,
      this.selectedStatus
    )
    .subscribe({

      next: (response) => {

        console.log('Status updated:', response);

        this.message = 'Load status updated successfully';
        setTimeout(() => {
          this.message = '';
        }, 3000);

        this.loadLoads();

        this.selectedLoadId = null;
        this.selectedStatus = '';
      },

      error: (error) => {

        console.error(
          'Failed to update load status:',
          error
        );

        this.message = 'Failed to update load status';
        setTimeout(() => {
          this.message = '';
        }, 3000);
      }

    });
}
}