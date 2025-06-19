import { Component } from '@angular/core';
import { CandidateService } from 'src/app/services/candidate.service';
import { JobService } from 'src/app/services/job.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Job } from 'src/app/models/job.model';
import { AppliedJob, Candidate } from 'src/app/models/candidate.model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent {
  tabs = ['saved', 'applications'];
  selectedTab: string = 'saved';
  userId: string = '';
  isLoading: boolean = true;
  candidate!: Candidate;
  jobCards: Job[] = [];
  filteredJobs: Job[] = [];
  activeFilter: string = 'all';
  filterOptions: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Applied', value: 'applied' },
    { label: 'Invited', value: 'invited' },
    { label: 'Offered', value: 'offered' },
    { label: 'Rejected', value: 'rejected' },
  ];

  constructor(
    private localStorageService: LocalStorageService,
    private jobService: JobService,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    this.getJobs();
  }

  getJobs() {
    if (!this.userId) return;
    this.isLoading = true;
    this.candidateService
      .getCandidateById(this.userId)
      .subscribe((candidate) => {
        if (candidate) {
          this.candidate = candidate;
          const jobIds =
            this.selectedTab === 'saved'
              ? candidate.savedJobs || []
              : candidate.appliedJobs?.flatMap((a) => a.jobId) || [];
          this.fetchJobsDetails(jobIds);
        } else {
          this.isLoading = false;
        }
      });
  }

  fetchJobsDetails(jobIds: string[]) {
    this.jobCards = [];
    jobIds.forEach((id) => {
      this.jobService.getJobCompleteById(id).subscribe((job) => {
        if (job) {
          this.jobCards.push(job);
        }
      });
    });
    this.filteredJobs = this.jobCards;
    //this.fi
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
    this.getJobs();
  }

  getJobStatus(jobId: string = ''): AppliedJob['status'] | undefined {
    const applyJob = this.candidate.appliedJobs?.find(
      (job) => job.jobId === jobId
    );
    return applyJob?.status;
  }

  /* filter jobs */

  filterJobs(filter: string) {
    this.activeFilter = filter;
    this.isLoading = true;
    if (filter === 'all') {
      this.filteredJobs = this.jobCards;
    } else if (filter === 'applied') {
      this.filteredJobs = this.jobCards.filter(
        (job) => this.getJobStatus(job.jobId) == 'Applied'
      );
    } else if (filter === 'invited') {
      this.filteredJobs = this.jobCards.filter(
        (job) => this.getJobStatus(job.jobId) == 'Invited'
      );
    } else if (filter === 'offered') {
      this.filteredJobs = this.jobCards.filter(
        (job) => this.getJobStatus(job.jobId) == 'Offered'
      );
    } else {
      this.filteredJobs = this.jobCards.filter(
        (job) => this.getJobStatus(job.jobId) == 'Rejected'
      );
    }
    setTimeout(() => (this.isLoading = false), 500);
  }
}
