import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-applicant-job-post',
  templateUrl: './applicant-job-post.component.html',
  styleUrls: ['./applicant-job-post.component.css'],
})
export class ApplicantJobPostComponent {
  jobId: string = '';
  candidates: Candidate[] = [];
  scheduleForm: FormGroup;
  isLoading: boolean = true;
  selectedCandidateId: string = '';

  @ViewChild('scheduleModal') scheduleModal: ModalComponent;
  @ViewChild('rejectedModal') rejectedModal: ModalComponent;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private fb: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {
    this.scheduleForm = this.fb.group({
      date: [null, Validators.required],
      time: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['jobId']) {
        this.jobId = params['jobId'] || '';
        this.candidateService
          .getAllCandidatesByJobAndStatus(this.jobId, 'Applied')
          .subscribe((candidates: Candidate[]) => {
            this.candidates = candidates;
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          });
      }
    });
  }

  /* filter date */
  myFilterDate = (d: Date | null): boolean => {
    if (!d) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);
    threeMonthsLater.setHours(0, 0, 0, 0);

    return d >= today && d <= threeMonthsLater;
  };
  /* schedule */
  openScheduleModal(userId: string) {
    this.selectedCandidateId = userId;
    this.scheduleModal.show();
  }
  onCloseScheduleModal() {
    this.scheduleModal.hide();
    this.scheduleForm.reset();
  }

  async onScheduleInterview() {
    if (!this.scheduleForm.valid) {
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
    }
    await this.updateScheduleCandidate('Invited', 'Schedule Interview');
  }

  /* update schedule candidate */
  async updateScheduleCandidate(status: AppliedJob['status'], message: string) {
    const { date, time } = this.scheduleForm.value;
    this.onCloseScheduleModal();
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
          applyJob.scheduleDate = {
            date: date,
            time: time,
          } as ScheduleDate;
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
