import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  AppliedJob,
  Candidate,
  ScheduleDate,
} from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-invited',
  templateUrl: './invited.component.html',
  styleUrls: ['./invited.component.css'],
})
export class InvitedComponent {
  jobId: string = '';
  candidates: Candidate[] = [];
  isLoading: boolean = true;
  selectedCandidateId: string = '';
  @ViewChild('acceptedModal') acceptedModal: ModalComponent;
  @ViewChild('rejectedModal') rejectedModal: ModalComponent;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private readonly toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['jobId']) {
        this.jobId = params['jobId'] || '';
        this.candidateService
          .getAllCandidatesByJobAndStatus(this.jobId, 'Invited')
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

  getCandidateSchedule(candidate: Candidate): ScheduleDate | undefined {
    const applyJob = candidate.appliedJobs?.find(
      (job) => job.jobId === this.jobId
    );
    return applyJob?.scheduleDate;
  }

  /* update status of appliedJobs */
  async updateScheduleCandidate(status: AppliedJob['status'], message: string) {
    this.loadingService.start();
    this.isLoading = true;
    try {
      if (!this.selectedCandidateId) return;
      const candidate = this.candidates.find(
        (candidate) => candidate.userId === this.selectedCandidateId
      );
      const updateAppliedJobs = candidate?.appliedJobs?.map((applyJob) => {
        if (applyJob.jobId == this.jobId) {
          applyJob.status = status;
        }
        return applyJob;
      });

      await this.candidateService.updateCandidate(this.selectedCandidateId, {
        appliedJobs: updateAppliedJobs,
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.toastr.success(`${message} successful!`, 'Success');
        this.loadingService.stop();
        this.isLoading = false;
      }, 500);
    } catch (error) {
      setTimeout(() => {
        this.toastr.error(`Failed to ${message}`, 'Error');
        this.loadingService.stop();
        this.isLoading = false;
      }, 500);
    }
    this.selectedCandidateId = '';
  }

  /* accepted modal */
  openAcceptedModal(userId: string) {
    this.selectedCandidateId = userId;
    this.acceptedModal.show();
  }

  onAcceptedModalClose() {
    this.selectedCandidateId = '';
    this.acceptedModal.hide();
  }
  async onConfirmAccepted() {
    this.acceptedModal.hide();
    await this.updateScheduleCandidate('Offered', 'Offered candidate');
  }

  /* reject modal */
  openRejectedModal(userId: string) {
    this.selectedCandidateId = userId;
    this.rejectedModal.show();
  }

  onRejectedModalClose() {
    this.selectedCandidateId = '';
    this.rejectedModal.hide();
  }
  async onConfirmRejected() {
    this.rejectedModal.hide();
    await this.updateScheduleCandidate('Rejected', 'Rejected candidate');
  }
}
