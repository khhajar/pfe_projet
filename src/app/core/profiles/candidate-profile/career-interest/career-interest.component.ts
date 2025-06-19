import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CareerInterest } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  CAREER_LEVELS,
  JOB_TYPES,
  WORKPLACE_TYPES,
} from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-career-interest',
  templateUrl: './career-interest.component.html',
  styleUrls: ['./career-interest.component.css'],
})
export class CareerInterestComponent {
  selectedCareerLevel: string | null = null;
  selectedJobType: string | null = null;
  selectedWorkplace: string | null = null;
  careerLevels: string[] = CAREER_LEVELS;
  jobTypes: string[] = JOB_TYPES;
  workplaces: string[] = WORKPLACE_TYPES;
  userId: string = '';
  isLoading: boolean = true;
  isSaving: boolean = false;

  constructor(
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {}
  ngOnInit() {
    this.getCandidate();
  }

  getCandidate() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate) => {
          if (candidate) {
            this.selectedCareerLevel =
              candidate.careerInterest?.careerLevel || null;
            this.selectedJobType = candidate.careerInterest?.jobType || null;
            this.selectedWorkplace =
              candidate.careerInterest?.workplacePreferred || null;
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    }
  }

  async onSave() {
    try {
      this.loadingService.start();
      const careerInterest = {
        careerLevel: this.selectedCareerLevel,
        jobType: this.selectedJobType,
        workplacePreferred: this.selectedWorkplace,
      } as CareerInterest;
      await this.candidateService.updateCandidate(this.userId, {
        careerInterest,
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.loadingService.stop();
        this.toastr.success('saved career interest successfully!', 'Success');
      }, 500);
    } catch (errors: any) {
      this.loadingService.stop();
      this.toastr.error(errors, 'Error updating career interest');
    }
  }
}
