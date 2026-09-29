import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isProfilePopupOpen: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  toggleProfilePopup(event: MouseEvent): void {
    event.stopPropagation();
    this.isProfilePopupOpen = !this.isProfilePopupOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfilePopupOpen = false;
    }
  }

  getUserInitial(): string {
    const username = this.authService.getUsername();
    return username && username.trim().length > 0
      ? username.trim().charAt(0).toUpperCase()
      : 'U';
  }

  logout(): void {
    this.isProfilePopupOpen = false;
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }

}
