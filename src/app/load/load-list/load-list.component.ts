import { Component, OnInit } from '@angular/core';
import { LoadService, Load } from '../load.service';

@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.css']
})
export class LoadListComponent implements OnInit {

  loads: Load[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  constructor(private loadService: LoadService) {}

ngOnInit(): void {
  this.loadLoads();
}

loadLoads(): void {

      this.loadService
        .getLoads(this.currentPage, this.pageSize)
        .subscribe({

          next: (response) => {

            this.loads = response.content;

            this.totalPages = response.totalPages;

          },

          error: (error) => {

            console.error(
              'Failed to load loads:',
              error
            );

          }

        });
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
}