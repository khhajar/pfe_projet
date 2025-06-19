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
import { Company } from 'src/app/models/company.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register-recruiter',
  templateUrl: './register-recruiter.component.html',
  styleUrls: ['./register-recruiter.component.css'],
})
export class RegisterRecruiterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  get formControls() {
    return this.registerForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private companyService: CompanyService,
    private loadingService: LoadingService
  ) {
    this.registerForm = this.fb.group(
      {
        role: ['recruiter'],
        companyName: ['', [Validators.required, Validators.minLength(3)]],
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

  async onSubmit() {
    if (this.registerForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = null;

    const { email, password, role, companyName } = this.registerForm.value;
    try {
      this.loadingService.start();
      const user = await this.authService.register(email, password, role);
      const today = new Date();
      const userId = user?.uid;
      const company = {
        companyId: userId,
        name: companyName,
        logo: '',
        recruiterId: userId,
        city: '',
        speciality: '',
        founded: '',
        size: '',
        about: '',
        number: '',
        onlinePresence: {
          website: '',
          linkedin: '',
        },
        jobIds: [],
        isCompletedProfile: false,
        createdAt: today,
        updatedAt: today,
      } as Company;

      await this.companyService.addCompany(company);

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
