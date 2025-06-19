import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Degree } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { EDUCATION_LEVELS } from 'src/app/shared/constants/constants';
import { getFormattedDuration } from 'src/app/shared/utils/getFormattedDuration.util';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent {
  selectedEducation: string = '';
  educationOptions: string[] = EDUCATION_LEVELS;
  degreeForm!: FormGroup;
  userId: string = '';
  isLoading: boolean = true;
  degrees: Degree[] = [];
  isEdited: boolean = false;
  degreeId: string = '';
  formattedDuration = getFormattedDuration;
  @ViewChild('degreeModal') degreeModal: ModalComponent;
  @ViewChild('deleteModal') deleteModal: ModalComponent;

  constructor(
    private readonly fb: FormBuilder,
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.initializeForm();
    this.getCandidate();
  }

  private initializeForm() {
    this.degreeForm = this.fb.group({
      id: [''],
      level: ['', Validators.required],
      university: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, this.endDateValidator.bind(this)]],
    });
  }

  endDateValidator(control: any) {
    if (
      this.degreeForm &&
      this.degreeForm.controls['startDate'].value &&
      control.value
    ) {
      return new Date(control.value) >=
        new Date(this.degreeForm.controls['startDate'].value)
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
            this.selectedEducation = candidate.education?.level || '';
            this.degrees = candidate.education?.degrees || [];
          }
          setTimeout(() => (this.isLoading = false), 500);
        });
    }
  }

  async saveEducationLevel() {
    if (!this.selectedEducation || this.selectedEducation == '') return;
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        education: {
          level: this.selectedEducation,
          degrees: this.degrees,
        },
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.toastr.success('Education level updated successfully!', 'Success');
        this.loadingService.stop();
      }, 500);
    } catch (error: any) {
      this.loadingService.stop();
      this.toastr.error(error, 'Error updating eduction level!');
    }
  }

  openModal() {
    this.degreeForm.reset();
    this.degreeModal.show();
  }

  onModalClose() {
    this.degreeForm.reset();
    this.degreeModal.hide();
  }

  async onSaveDegree() {
    if (!this.degreeForm.valid) {
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
      ('');
    }
    if (this.isEdited) {
      const index = this.degrees.findIndex(
        (a) => a.id === this.degreeForm.value.id
      );
      if (index !== -1) {
        this.degrees[index] = {
          ...this.degrees[index],
          ...this.degreeForm.value,
        };
      }
    } else {
      this.degreeForm.value.id = uuidv4();
      this.degrees.push(this.degreeForm.value);
    }
    await this.updateDegree();
  }

  async updateDegree() {
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        education: {
          level: this.selectedEducation,
          degrees: this.degrees,
        },
        updatedAt: new Date(),
      });
      this.toastr.success('Education Saved successfully!', 'Success');
      this.degreeId = '';
      this.degreeForm.reset();
      setTimeout(() => {
        this.degreeId = '';
        this.loadingService.stop();
        this.onModalClose();
        this.degreeForm.reset();
      }, 500);
    } catch (error: any) {
      this.loadingService.stop();
      this.toastr.error('Error saving Education', 'Error');
    }
  }

  /*****/

  editDegree(degree: Degree) {
    this.degreeModal.show();
    this.isEdited = true;
    this.degreeForm.patchValue(degree);
  }

  onDeleteDegree(id: string) {
    this.deleteModal.show();
    this.degreeId = id;
  }
  async deleteDegree(id: string) {
    const index = this.degrees.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.degrees.splice(index, 1);
      await this.updateDegree();
    }
  }

  onModalDeleteClose() {
    this.degreeId = '';
    this.deleteModal.hide();
  }

  onConfirmDelete() {
    this.deleteDegree(this.degreeId);
    this.deleteModal.hide();
  }
}
