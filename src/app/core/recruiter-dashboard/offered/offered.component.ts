import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppliedJob, Candidate } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-offered',
  templateUrl: './offered.component.html',
  styleUrls: ['./offered.component.css'],
})
export class OfferedComponent {
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
          .getAllCandidatesByJobAndStatus(this.jobId, 'Offered')
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
