import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Candidate } from 'src/app/models/candidate.model';
import { AuthService } from 'src/app/services/auth.service';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private candidateService: CandidateService,
    private loadingService: LoadingService
  ) {
    this.registerForm = this.fb.group(
      {
        role: ['candidate'],
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  goBack() {
    this.router.navigate(['/choice-signup']);
  }

  get formControls() {
    return this.registerForm.controls;
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const { firstName, lastName, email, password, role } =
      this.registerForm.value;

    try {
      this.loadingService.start();
      const user = await this.authService.register(
        email.toLowerCase(),
        password,
        role
      );
      const today = new Date();
      const userId = user?.uid;
      const candidate = {
        userId: userId,
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        createdAt: today,
        updatedAt: today,
      } as Candidate;

      await this.candidateService.addCandidate(candidate);

      this.toastr.success('Success!', 'Registration successful!');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      setTimeout(() => {
        this.isSubmitting = false;
        this.loadingService.stop();
      }, 500);
    }
  }
}
