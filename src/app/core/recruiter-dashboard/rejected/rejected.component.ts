import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate, AppliedJob } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';

@Component({
  selector: 'app-rejected',
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.css'],
})
export class RejectedComponent {
  jobId: string = '';
  candidates: Candidate[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['jobId']) {
        this.jobId = params['jobId'] || '';
        this.candidateService
          .getAllCandidatesByJobAndStatus(this.jobId, 'Rejected')
          .subscribe((candidates: Candidate[]) => {
            this.candidates = candidates;
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          });
      }
    });
  }

  /* get candidate infos */
  getCandidateApplicationStatus(
    candidate: Candidate
  ): AppliedJob['status'] | undefined {
    const applyJob = candidate.appliedJobs?.find(
      (job) => job.jobId === this.jobId
    );
    return applyJob?.status;
  }
}
