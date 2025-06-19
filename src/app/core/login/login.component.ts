import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadingService.start();
    setTimeout(() => {
      this.loadingService.stop();
    }, 500);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  goForgetPassword() {
    this.router.navigate(['/forget-password']);
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingService.start();
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      this.authService.user$.subscribe((user) => {
        if (user) {
          if (user.role == 'candidate') {
            this.router.navigate(['/profile/candidate']);
          } else {
            this.router.navigate(['/profile/company']);
          }
        }
      });
      this.toastr.success('Success!', 'Login successfully');
    } catch (error: any) {
      if (error.code === 'auth/invalid-login-credentials') {
        this.errorMessage = 'Email or password is incorrect';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
      this.toastr.error('Error!', this.errorMessage);
    } finally {
      setTimeout(() => {
        this.loadingService.stop();
      }, 500);
    }
  }
}
