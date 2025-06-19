import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Certification } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.css'],
})
export class CertificationComponent {
  certificationForm: FormGroup;
  certifications: Certification[] = [];
  userId: string = '';
  isLoading: boolean = true;
  certificateId: string = '';
  @ViewChild('deleteModal') deleteModal: ModalComponent;

  constructor(
    private fb: FormBuilder,
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private loadingService: LoadingService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getCandidate();
  }

  initializeForm() {
    this.certificationForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  getCandidate() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate) => {
          if (candidate) {
            this.certifications = candidate.certifications ?? [];
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    }
  }

  async addCertification() {
    if (this.certificationForm.valid) {
      const { name, date } = this.certificationForm.value;
      const certification: Certification = { id: uuidv4(), name, date };
      this.certifications.push(certification);
      this.certificationForm.reset();
      await this.updateCertifications();
    }
  }

  async removeCertification() {
    const index = this.certifications.findIndex(
      (a) => a.id === this.certificateId
    );
    if (index !== -1) {
      this.certifications.splice(index, 1);
      this.deleteModal.hide();
      await this.updateCertifications();
    }
  }

  onDelete(id: string) {
    this.certificateId = id;
    this.deleteModal.show();
  }

  onClose() {
    this.certificateId = '';
    this.deleteModal.hide();
  }

  async updateCertifications() {
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        certifications: this.certifications,
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.certificateId = '';
        this.loadingService.stop();
        this.toastr.success('saved certification successfully!', 'Success');
      }, 500);
    } catch (errors: any) {
      this.toastr.error(errors, 'Error saved certification');
    }
  }
}
