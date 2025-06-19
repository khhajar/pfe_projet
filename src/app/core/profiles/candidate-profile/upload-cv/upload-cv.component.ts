import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Candidate } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.component.html',
  styleUrls: ['./upload-cv.component.css'],
})
export class UploadCvComponent {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('deleteModal') deleteModal: ModalComponent;
  uploadedUrl: string = '';
  fileName: string = '';
  isUploading: boolean = false;
  isLoading: boolean = true;
  userId: string = '';

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private candidateService: CandidateService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate: Candidate | undefined) => {
          if (candidate?.resume) {
            this.uploadedUrl = candidate.resume?.url;
            this.fileName = candidate.resume?.name;
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    }
  }
  openModal() {
    this.deleteModal.show();
  }

  deleteCv() {
    this.deleteFile();
    this.deleteModal.hide();
  }
  onModalClose() {
    this.deleteModal.hide();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  async updateResume(fileName: string, url: string) {
    try {
      await this.candidateService.updateCandidate(this.userId, {
        resume: {
          name: fileName,
          url: url,
        },
        updatedAt: new Date(),
      });
      this.toastr.success('Successfully updated company');
    } catch (error: any) {
      this.toastr.error(error, 'Error updating Online Presence');
    } finally {
      this.isUploading = false;
      this.loadingService.stop();
    }
  }
  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.fileName = file.name;
      this.loadingService.start();
      this.isUploading = true;
      this.cloudinaryService
        .uploadPDF(file)
        .subscribe(async (response: any) => {
          this.uploadedUrl = response.secure_url;
          await this.updateResume(this.fileName, this.uploadedUrl);
        });
    }
  }

  downloadFile() {
    if (this.uploadedUrl) {
      const link = document.createElement('a');
      link.href = this.uploadedUrl;
      link.download = this.fileName;
      link.click();
    }
  }

  showDeleteConfirmation() {
    this.deleteModal.show();
  }

  async deleteFile() {
    this.uploadedUrl = '';
    this.fileName = '';
    this.loadingService.start();
    await this.updateResume(this.fileName, this.uploadedUrl);
    this.fileInput.nativeElement.value = '';
  }
}
