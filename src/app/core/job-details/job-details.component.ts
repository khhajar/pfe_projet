import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppliedJob } from 'src/app/models/candidate.model';
import { Job } from 'src/app/models/job.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { JobService } from 'src/app/services/job.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DEFAULT_IMAGE } from 'src/app/shared/constants/constants';
import { formatPostDate } from 'src/app/shared/utils/formatPostDate.util';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
})
export class JobDetailsComponent implements OnInit {
  job?: Job;
  companyLogo: string = '';
  companyName: string = '';
  formatPostDate = formatPostDate;
  saved = false;
  applied = false;
  jobId: string = '';
  userId: string = '';
  role: string = '';
  isLoading: boolean = true;
  defaultImage: string = DEFAULT_IMAGE;
  appliedJobs: AppliedJob[] = [];
  savedJobs: string[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private jobService: JobService,
    private candidateService: CandidateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getItem('user');
    if (user) {
      this.userId = user.uid || '';
      this.role = user.role || '';
    }

    this.jobId = this.activeRoute.snapshot.paramMap.get('id') || '';

    if (this.jobId) {
      this.getCompany();
      this.getCandidate();
    } else {
      this.toastr.error('Invalid job ID');
      this.router.navigate(['/jobs']);
    }
  }

  getCompany(): void {
    this.jobService.getJobCompleteById(this.jobId).subscribe({
      next: (_job) => {
        this.job = _job;
        this.companyLogo = _job?.company?.logo || '';
        this.companyName = _job?.company?.name || '';
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      error: () => {
        setTimeout(() => {
          this.toastr.error('Failed to load job details');
          this.isLoading = false;
        }, 500);
      },
    });
  }

  getCandidate(): void {
    if (!this.userId) return;

    this.candidateService.getCandidateById(this.userId).subscribe({
      next: (candidate) => {
        this.appliedJobs = candidate?.appliedJobs || [];
        this.savedJobs = candidate?.savedJobs || [];
        this.applied = this.appliedJobs.some((job) => job.jobId == this.jobId);
        this.saved = this.savedJobs.includes(this.jobId);
      },
      error: () => {
        this.toastr.error('Failed to load candidate details');
      },
    });
  }

  async applyJob(): Promise<void> {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.role === 'candidate') {
      try {
        const applyJob = {
          jobId: this.jobId,
          status: 'Applied',
        } as AppliedJob;
        const isSaved = this.savedJobs.some((jobId) => jobId == this.jobId);
        let updateSavedJob: string[] = [];
        if (isSaved) {
          updateSavedJob = this.savedJobs.filter((id) => id !== this.jobId);
        }
        await this.candidateService.updateCandidate(this.userId, {
          appliedJobs: [...this.appliedJobs, applyJob],
          savedJobs: updateSavedJob,
          updatedAt: new Date(),
        });
        this.toastr.success('Job applied successfully!');
      } catch {
        this.toastr.error('Failed to apply for the job');
      }
    }
  }

  async toggleSavedJob(): Promise<void> {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.role === 'candidate') {
      const updatedJobs = this.saved
        ? this.savedJobs.filter((id) => id !== this.jobId)
        : [...this.savedJobs, this.jobId];

      try {
        await this.candidateService.updateCandidate(this.userId, {
          savedJobs: updatedJobs,
          updatedAt: new Date(),
        });
        this.toastr.success(
          `${this.saved ? 'Saved' : 'Unsaved'} job successfully!`
        );
      } catch {
        this.toastr.error('Failed to update saved jobs');
      }
    }
  }
}
