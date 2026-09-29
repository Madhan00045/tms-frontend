import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { AuthService } from '../auth.service';
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

          const role = this.authService.getUserRole();
          if (role === 'CUSTOMER') {
            this.router.navigate(['/loads/create']);
          } else {
            this.router.navigate(['/dashboard']);
          }
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