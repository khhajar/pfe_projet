import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  resetPasswordForm: FormGroup;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  // Submit form
  onSubmit(): void {
    if (!this.resetPasswordForm.valid) {
      this.toastr.warning('Please fill in the form correctly.');
      return;
    }
    const email = this.email?.value;
    console.log(email);
    this.authService.resetPassword(email).then((result) => {
      if (result.success) {
        this.resetPasswordForm.reset({
          email: '',
        });
        this.toastr.success('Password Reset Email Sent Check Your Email Box!');
      } else {
        this.toastr.error(`Error: ${result.error}`);
      }
    });
  }
  // Navigate back to login page
  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
