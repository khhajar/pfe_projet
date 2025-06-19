import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Activitie } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { v4 as uuidv4 } from 'uuid';
import { getFormattedDuration } from 'src/app/shared/utils/getFormattedDuration.util';
import { LoadingService } from 'src/app/services/loading.service';
import {
  EXPERIENCE_YEARS,
  JOB_TYPES,
} from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
})
export class ExperienceComponent implements OnInit {
  experienceOptions: string[] = EXPERIENCE_YEARS;
  experienceForm!: FormGroup;
  totalExperienceForm!: FormGroup;

  experienceTypes = JOB_TYPES;
  userId: string = '';
  isLoading: boolean = true;
  activities: Activitie[];
  isEdited: boolean = false;
  activityId: string = '';
  @ViewChild('experienceModal') experienceModal!: ModalComponent;
  @ViewChild('deleteModal') deleteModal: ModalComponent;
  formattedDuration = getFormattedDuration;
  constructor(
    private readonly fb: FormBuilder,
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCandidate();
  }

  private initializeForm() {
    this.totalExperienceForm = this.fb.group({
      totalExperience: ['', [Validators.required]],
    });

    this.experienceForm = this.fb.group({
      id: [''],
      experienceType: ['', [Validators.required]],
      jobTitle: ['', [Validators.required, Validators.minLength(2)]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(25),
          Validators.maxLength(500),
        ],
      ],
      startDate: ['', Validators.required],
      endDate: ['', this.endDateValidator.bind(this)],
      currentlyWorking: [false],
    });

    this.experienceForm
      .get('currentlyWorking')
      ?.valueChanges.subscribe((currentlyWorking) => {
        if (currentlyWorking) {
          this.experienceForm.get('endDate')?.disable();
        } else {
          this.experienceForm.get('endDate')?.enable();
        }
      });
  }

  endDateValidator(control: any) {
    if (
      this.experienceForm &&
      this.experienceForm.controls['startDate'].value &&
      control.value
    ) {
      return new Date(control.value) >=
        new Date(this.experienceForm.controls['startDate'].value)
        ? null
        : { invalidEndDate: true };
    }
    return null;
  }

  getCandidate() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate) => {
          if (candidate) {
            this.activities = candidate.experience?.activities || [];
            this.totalExperienceForm.patchValue({
              totalExperience: candidate.experience?.totalExperience || '',
            });
          }
          setTimeout(() => (this.isLoading = false), 500);
        });
    }
  }

  async saveTotalExperience() {
    if (this.totalExperienceForm.invalid) return;
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        experience: {
          totalExperience: this.totalExperienceForm.value.totalExperience,
          activities: this.activities,
        },
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.toastr.success('Experience updated successfully!', 'Success');
        this.loadingService.stop();
      }, 500);
    } catch (error: any) {
      this.toastr.error(error, 'Error updating experience');
      this.loadingService.stop();
    }
  }

  /* Modal Control */
  addActivitie() {
    this.isEdited = false;
    this.experienceModal.show();
    this.experienceForm.reset();
  }

  onModalClose() {
    this.experienceModal.hide();
  }

  async saveExperience() {
    if (!this.experienceForm.valid) {
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
    }
    if (this.isEdited) {
      const index = this.activities.findIndex(
        (a) => a.id === this.experienceForm.value.id
      );
      if (index !== -1) {
        this.activities[index] = {
          ...this.activities[index],
          ...this.experienceForm.value,
        };
      }
    } else {
      this.experienceForm.value.id = uuidv4();
      this.activities.push(this.experienceForm.value);
    }
    await this.updateExperience();
  }
  async updateExperience() {
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        experience: {
          totalExperience: this.totalExperienceForm.value.totalExperience,
          activities: this.activities,
        },
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.loadingService.stop();
        this.activityId = '';
        this.experienceForm.reset();
        this.onModalClose();
        this.toastr.success('Experience Saved successfully!', 'Success');
      }, 500);
    } catch (error: any) {
      this.loadingService.stop();
      this.toastr.error('Error saving experience', 'Error');
    }
  }
  editActivity(activitie: Activitie) {
    this.isEdited = true;
    this.experienceModal.show();
    this.experienceForm.patchValue(activitie);
  }

  onDeleteActivity(id: string) {
    this.deleteModal.show();
    this.activityId = id;
  }
  async deleteActivity(id: string) {
    const index = this.activities.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.activities.splice(index, 1);
      await this.updateExperience();
    }
  }

  onModalDeleteClose() {
    this.activityId = '';
    this.deleteModal.hide();
  }

  onConfirmDelete() {
    this.deleteActivity(this.activityId);
    this.deleteModal.hide();
  }
}
