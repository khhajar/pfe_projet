import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from 'src/app/services/candidate.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Candidate } from 'src/app/models/candidate.model';
import { LoadingService } from 'src/app/services/loading.service';
import { CITIES } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css'],
})
export class GeneralInfoComponent implements OnInit {
  cities: string[] = CITIES;
  profileImage: string = '';
  userId: string = '';
  mainInfoForm!: FormGroup;
  isSaving: boolean = false;
  isLoading: boolean = true;

  constructor(
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private fb: FormBuilder,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getCandidate();
    this.initializeForm();
  }

  initializeForm() {
    this.mainInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')],
      ],
      jobTitle: ['', Validators.required],
    });
  }

  getCandidate() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate) => {
          if (candidate) {
            setTimeout(() => {
              this.mainInfoForm.patchValue(candidate);
              this.profileImage = candidate.profilePicture || '';
              this.isLoading = false;
            }, 500);
          } else {
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          }
        });
    }
  }

  onImageSelected(url: string): void {
    this.profileImage = url;
  }

  async updateCandidate() {
    if (this.mainInfoForm.invalid) {
      return;
    }

    this.loadingService.start();
    try {
      this.isSaving = true;
      const formData = this.mainInfoForm.value;
      const updatedCandidate: Candidate = {
        userId: this.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        city: formData.city,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        profilePicture: this.profileImage,
        isCompleteProfile: true,
        updatedAt: new Date(),
      };
      await this.candidateService.updateCandidate(
        this.userId,
        updatedCandidate
      );
      setTimeout(() => {
        this.loadingService.stop();
        this.toastr.success(
          'Profile candidate updated successfully!',
          'Success'
        );
        this.isSaving = false;
      }, 500);
    } catch (errors: any) {
      this.loadingService.stop();
      this.toastr.error(errors, 'Error updating company');
    }
  }
}
