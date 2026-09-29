import { Component, OnInit } from '@angular/core';
import { RbacService, Role, Functionality } from '../rbac.service';
import { PermissionService } from '../../auth/permission.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {

  roles: Role[] = [];
  selectedRoleId: number | null = null;
  functionalities: Functionality[] = [];

  isLoadingRoles: boolean = false;
  isLoadingFunctionalities: boolean = false;
  isSaving: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private rbacService: RbacService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoadingRoles = true;
    this.rbacService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoadingRoles = false;
        if (this.roles.length > 0) {
          // Default to first role or DISPATCHER if available
          const dispatcher = this.roles.find(r => r.roleCode === 'DISPATCHER');
          this.selectedRoleId = dispatcher ? dispatcher.id : this.roles[0].id;
          this.onRoleChange();
        }
      },
      error: (err) => {
        this.isLoadingRoles = false;
        this.errorMessage = 'Failed to load roles.';
      }
    });
  }

  onRoleChange(): void {
    if (!this.selectedRoleId) return;

    this.isLoadingFunctionalities = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.rbacService.getRoleFunctionalities(this.selectedRoleId).subscribe({
      next: (funcs) => {
        this.functionalities = funcs;
        this.isLoadingFunctionalities = false;
      },
      error: (err) => {
        this.isLoadingFunctionalities = false;
        this.errorMessage = 'Failed to load functionalities for selected role.';
      }
    });
  }

  toggleFunctionality(func: Functionality): void {
    func.assigned = !func.assigned;
  }

  selectAll(): void {
    this.functionalities.forEach(f => f.assigned = true);
  }

  deselectAll(): void {
    this.functionalities.forEach(f => f.assigned = false);
  }

  getSelectedCount(): number {
    return this.functionalities.filter(f => f.assigned).length;
  }

  savePermissions(): void {
    if (!this.selectedRoleId) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const selectedIds = this.functionalities
      .filter(f => f.assigned)
      .map(f => f.id);

    this.rbacService.updateRoleFunctionalities(this.selectedRoleId, selectedIds).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = 'Permissions saved successfully!';
        // Refresh active permissions in case current user's role changed
        this.permissionService.loadPermissions().subscribe();

        setTimeout(() => {
          this.successMessage = '';
        }, 3500);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to update permissions.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
}
