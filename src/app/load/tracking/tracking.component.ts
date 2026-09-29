import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  searchQuery: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  onTrack(): void {
    // Tracking search handler
  }
}
