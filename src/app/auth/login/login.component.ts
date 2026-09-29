import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { AuthService } from '../auth.service';
import { PermissionService } from '../permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.loginService
      .login(username, password)
      .subscribe({
        next: (response) => {

          console.log('JWT received:');
          console.log(response.token);

          localStorage.setItem(
              'jwtToken',
              response.token
          );

          this.message = 'Login successful';

          // Fetch user permissions and menu from database
          this.permissionService.loadPermissions().subscribe({
            next: () => {
              this.permissionService.loadMenu().subscribe();
              if (this.permissionService.has('DASHBOARD')) {
                this.router.navigate(['/dashboard']);
              } else if (this.permissionService.has('LOAD_LIST')) {
                this.router.navigate(['/loads']);
              } else if (this.permissionService.has('CREATE_LOAD')) {
                this.router.navigate(['/loads/create']);
              } else if (this.permissionService.has('TRACKING')) {
                this.router.navigate(['/tracking']);
              } else if (this.permissionService.has('CUSTOMERS')) {
                this.router.navigate(['/customers']);
              } else if (this.permissionService.has('CARRIERS')) {
                this.router.navigate(['/carriers']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            },
            error: () => {
              this.router.navigate(['/dashboard']);
            }
          });
        },

        error: (error) => {

          console.error('Login failed');
          console.error(error);
          if (error.status === 401) {
            this.message = 'Invalid username or password';
          } else {
            this.message = 'Login failed. Please try again.';
          }
            setTimeout(() => {
          this.message = '';
        }, 3000);

        }
      });
  }
}