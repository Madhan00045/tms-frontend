import { Component, OnInit } from '@angular/core';
import { RbacService, Role, User } from '../rbac.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-role-mapping',
  templateUrl: './user-role-mapping.component.html',
  styleUrls: ['./user-role-mapping.component.css']
})
export class UserRoleMappingComponent implements OnInit {

  roles: Role[] = [];
  selectedRoleId: number | null = null;

  unmappedUsers: User[] = [];
  mappedUsers: User[] = [];

  selectedUnmappedUserIds: Set<number> = new Set();
  selectedMappedUserIds: Set<number> = new Set();

  searchUnmapped: string = '';
  searchMapped: string = '';

  isLoadingRoles: boolean = false;
  isLoadingUsers: boolean = false;
  isSaving: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private rbacService: RbacService) { }

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

    this.isLoadingUsers = true;
    this.selectedUnmappedUserIds.clear();
    this.selectedMappedUserIds.clear();
    this.successMessage = '';
    this.errorMessage = '';

    forkJoin({
      mapped: this.rbacService.getMappedUsers(this.selectedRoleId),
      unmapped: this.rbacService.getUnmappedUsers(this.selectedRoleId)
    }).subscribe({
      next: ({ mapped, unmapped }) => {
        this.mappedUsers = mapped;
        this.unmappedUsers = unmapped;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        this.isLoadingUsers = false;
        this.errorMessage = 'Failed to load users for the selected role.';
      }
    });
  }

  toggleUnmappedSelection(userId: number): void {
    if (this.selectedUnmappedUserIds.has(userId)) {
      this.selectedUnmappedUserIds.delete(userId);
    } else {
      this.selectedUnmappedUserIds.add(userId);
    }
  }

  toggleMappedSelection(userId: number): void {
    if (this.selectedMappedUserIds.has(userId)) {
      this.selectedMappedUserIds.delete(userId);
    } else {
      this.selectedMappedUserIds.add(userId);
    }
  }

  selectAllUnmapped(): void {
    this.filteredUnmappedUsers.forEach(u => this.selectedUnmappedUserIds.add(u.id));
  }

  deselectAllUnmapped(): void {
    this.selectedUnmappedUserIds.clear();
  }

  selectAllMapped(): void {
    this.filteredMappedUsers.forEach(u => this.selectedMappedUserIds.add(u.id));
  }

  deselectAllMapped(): void {
    this.selectedMappedUserIds.clear();
  }

  // Move selected unmapped users -> mapped
  moveToMapped(): void {
    if (this.selectedUnmappedUserIds.size === 0) return;

    const toMove = this.unmappedUsers.filter(u => this.selectedUnmappedUserIds.has(u.id));
    this.unmappedUsers = this.unmappedUsers.filter(u => !this.selectedUnmappedUserIds.has(u.id));
    this.mappedUsers = [...this.mappedUsers, ...toMove];

    this.selectedUnmappedUserIds.clear();
  }

  // Move selected mapped users -> unmapped
  moveToUnmapped(): void {
    if (this.selectedMappedUserIds.size === 0) return;

    const toMove = this.mappedUsers.filter(u => this.selectedMappedUserIds.has(u.id));
    this.mappedUsers = this.mappedUsers.filter(u => !this.selectedMappedUserIds.has(u.id));
    this.unmappedUsers = [...this.unmappedUsers, ...toMove];

    this.selectedMappedUserIds.clear();
  }

  get filteredUnmappedUsers(): User[] {
    if (!this.searchUnmapped.trim()) return this.unmappedUsers;
    const term = this.searchUnmapped.trim().toLowerCase();
    return this.unmappedUsers.filter(u => u.username.toLowerCase().includes(term));
  }

  get filteredMappedUsers(): User[] {
    if (!this.searchMapped.trim()) return this.mappedUsers;
    const term = this.searchMapped.trim().toLowerCase();
    return this.mappedUsers.filter(u => u.username.toLowerCase().includes(term));
  }

  saveMappings(): void {
    if (!this.selectedRoleId) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const roleId = this.selectedRoleId;

    // Fetch fresh database mappings to determine diff
    this.rbacService.getMappedUsers(roleId).subscribe({
      next: (currentDbMapped) => {
        const currentDbIds = new Set(currentDbMapped.map(u => u.id));
        const newMappedIds = new Set(this.mappedUsers.map(u => u.id));

        // Users to add
        const toAdd = Array.from(newMappedIds).filter(id => !currentDbIds.has(id));
        // Users to remove
        const toRemove = Array.from(currentDbIds).filter(id => !newMappedIds.has(id));

        const observables = [
          ...toAdd.map(userId => this.rbacService.assignUserToRole(roleId, userId)),
          ...toRemove.map(userId => this.rbacService.removeUserFromRole(roleId, userId))
        ];

        if (observables.length === 0) {
          this.isSaving = false;
          this.successMessage = 'No mapping changes detected.';
          setTimeout(() => this.successMessage = '', 3000);
          return;
        }

        forkJoin(observables).subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = `User role mappings updated successfully! (${toAdd.length} assigned, ${toRemove.length} removed)`;
            this.onRoleChange();
            setTimeout(() => this.successMessage = '', 4000);
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMessage = err.error?.message || 'Failed to save mappings.';
            setTimeout(() => this.errorMessage = '', 4000);
          }
        });
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Failed to verify existing database mappings.';
      }
    });
  }
}
