import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MenuItem, PermissionService } from '../../auth/permission.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isProfilePopupOpen: boolean = false;
  menuItems: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    public permissionService: PermissionService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.refreshMenu();
  }

  refreshMenu(): void {
    if (this.authService.getToken()) {
      const cached = this.permissionService.getMenu();
      if (cached && cached.length > 0) {
        this.menuItems = cached;
      }
      // Always fetch latest menu from database
      this.permissionService.loadMenu().subscribe({
        next: (items) => {
          this.menuItems = items;
        },
        error: (err) => console.error('Failed to load dynamic menu', err)
      });
    }
  }

  getIcon(item: MenuItem): string {
    if (item.icon && item.icon !== '?' && item.icon.trim().length > 0) {
      return item.icon;
    }
    switch (item.code) {
      case 'DASHBOARD':
      case 'MENU_DASHBOARD':
        return '⌂';
      case 'LOAD_LIST':
      case 'MENU_LOAD_LIST':
        return '▤';
      case 'CREATE_LOAD':
      case 'MENU_CREATE_LOAD':
        return '＋';
      case 'CUSTOMERS':
      case 'MENU_CUSTOMERS':
        return '♟';
      case 'CARRIERS':
      case 'MENU_CARRIERS':
        return '▰';
      case 'TRACKING':
      case 'MENU_TRACKING':
        return '⌖';
      case 'ROLE_MANAGEMENT':
      case 'MENU_ROLE_MGMT':
        return '⚙';
      case 'USER_ROLE_MAPPING':
      case 'MENU_USER_ROLE':
        return '👥';
      default:
        return '•';
    }
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
    this.permissionService.clearPermissions();
    this.menuItems = [];
    this.router.navigate(['/login']);
  }

}
