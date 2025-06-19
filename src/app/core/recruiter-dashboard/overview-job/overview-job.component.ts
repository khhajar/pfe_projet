import { Component, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Job } from 'src/app/models/job.model';
import { CompanyService } from 'src/app/services/company.service';
import { JobService } from 'src/app/services/job.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import {
  CAREER_LEVELS,
  DEFAULT_IMAGE,
  EXPERIENCE_YEARS,
  JOB_CATEGORIES,
  JOB_TYPES,
  SKILLS,
  WORKPLACE_TYPES,
} from 'src/app/shared/constants/constants';
import { formatPostDate } from 'src/app/shared/utils/formatPostDate.util';

@Component({
  selector: 'app-overview-job',
  templateUrl: './overview-job.component.html',
  styleUrls: ['./overview-job.component.css'],
})
export class OverviewJobComponent {
  defaultImage: string = DEFAULT_IMAGE;
  isLoading: boolean = true;
  logoUrl: string = '';
  city: string = '';
  jobId: string = '';
  job!: Job;
  userId: string = '';
  formatPostDate = formatPostDate;
  selectedJobType: string | null = null;
  jobTypes = JOB_TYPES;
  jobCategories = JOB_CATEGORIES;
  skills: string[] = SKILLS;
  workplaceOptions = WORKPLACE_TYPES;
  careerLevels = CAREER_LEVELS;
  experienceYears = EXPERIENCE_YEARS;
  filteredSkills: string[] = [];
  searchSkill: string = '';
  jobForm: FormGroup;
  isClosed: boolean;
  @ViewChild('editJobModal') editJobModal: ModalComponent;

  /* get & set */
  get descriptions(): FormArray<FormControl<string | null>> {
    return this.jobForm.get('descriptions') as FormArray<
      FormControl<string | null>
    >;
  }

  get requirements(): FormArray<FormControl<string | null>> {
    return this.jobForm.get('requirements') as FormArray<
      FormControl<string | null>
    >;
  }
  /*  close modal */
  @ViewChild('closeModal') closeModalComponent: ModalComponent;

  /* create component */
  constructor(
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private localStorageService: LocalStorageService,
    private jobService: JobService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getJob();
    this.initializeJob();
  }

  getJob() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    this.activatedRoute.paramMap?.subscribe((params) => {
      this.isLoading = true;
      this.jobId = params.get('jobId') || '';
      this.isClosed = false;
      if (this.jobId.length <= 0) {
        this.isLoading = false;
      }

      this.companyService
        .getCompanyByRecruiter(this.userId)
        .subscribe((company) => {
          if (company) {
            this.logoUrl = company.logo;
            this.city = company.city;
          }
        });

      this.jobService.getJobById(this.jobId).subscribe((job) => {
        if (job) {
          this.job = job || ({} as Job);
          this.isClosed = this.job.isClosed || false;
          this.initializeEditData();
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
    });
  }
  initializeJob() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      jobType: ['', Validators.required],
      workplace: ['', Validators.required],
      careerLevel: ['', Validators.required],
      experience: ['', Validators.required],
      descriptions: this.fb.array([]),
      requirements: this.fb.array([]),
      skills: [[], Validators.required],
    });
    this.filteredSkills = [...this.skills];
  }

  initializeEditData() {
    this.jobForm.patchValue({
      title: this.job?.title,
      category: this.job?.category,
      jobType: this.job?.jobType,
      workplace: this.job?.workplace,
      careerLevel: this.job?.careerLevel,
      experience: this.job?.experience,
      descriptions: this.job?.descriptions || [],
      requirements: this.job?.requirements || [],
      skills: this.job?.skills || [],
    });

    const descriptionsArray =
      this.job.descriptions?.map((desc) => this.fb.control(desc)) || [];
    this.jobForm.setControl('descriptions', this.fb.array(descriptionsArray));

    const requirementsArray =
      this.job.requirements?.map((req) => this.fb.control(req)) || [];
    this.jobForm.setControl('requirements', this.fb.array(requirementsArray));
  }
  /* edit job */

  filterSkills() {
    this.filteredSkills = this.skills.filter((skill) =>
      skill.toLowerCase().includes(this.searchSkill.toLowerCase())
    );
  }

  openEditModal() {
    this.initializeEditData();
    this.editJobModal.show();
  }

  onEditModalClose() {
    this.editJobModal.hide();
  }

  async editJob() {
    if (this.jobForm.valid) {
      this.loadingService.start();
      const today = new Date();
      const jobData: Job = {
        recruiterId: this.userId,
        title: this.jobForm.value.title,
        jobType: this.jobForm.value.jobType,
        category: this.jobForm.value.category,
        workplace: this.jobForm.value.workplace,
        careerLevel: this.jobForm.value.careerLevel,
        experience: this.jobForm.value.experience,
        descriptions: this.jobForm.value.descriptions,
        requirements: this.jobForm.value.requirements,
        skills: this.jobForm.value.skills,
        updateDate: today,
      };
      try {
        await this.jobService.updateJob(this.job.jobId || '', jobData);
        setTimeout(() => {
          this.loadingService.stop();
          this.toastr.success('Job Updated Successfully!');
        }, 500);
        this.onEditModalClose();
      } catch (error: any) {
        setTimeout(() => {
          this.loadingService.stop();
          this.toastr.error('Error Updated job:', error);
        }, 500);
      }
    } else {
      this.toastr.warning('Forms Not Valid!');
    }
  }

  /* close job */
  // confirmation close
  onCloseModal() {
    this.closeModalComponent.hide();
  }

  openCloseModal() {
    this.closeModalComponent.show();
  }

  /*  close event */
  async onCloseJob() {
    this.loadingService.start();
    try {
      await this.jobService.updateJob(this.job.jobId || '', { isClosed: true });
      setTimeout(() => {
        this.loadingService.stop();
        this.toastr.success('Job Closed Successfully!');
      }, 500);
      this.onCloseModal();
    } catch (error: any) {
      setTimeout(() => {
        this.loadingService.stop();
        this.toastr.error('Error Closed job:', error);
      }, 500);
    }
  }
}
