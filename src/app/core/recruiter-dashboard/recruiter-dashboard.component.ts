import { Component, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Job } from 'src/app/models/job.model';
import { CompanyService } from 'src/app/services/company.service';
import { JobSelectionService } from 'src/app/services/job-selection.service';
import { JobService } from 'src/app/services/job.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import {
  CAREER_LEVELS,
  EXPERIENCE_YEARS,
  JOB_CATEGORIES,
  JOB_TYPES,
  SKILLS,
  WORKPLACE_TYPES,
} from 'src/app/shared/constants/constants';
import { formatPostDate } from 'src/app/shared/utils/formatPostDate.util';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css'],
})
export class RecruiterDashboardComponent {
  @ViewChild('addJobModal') addJobModal: ModalComponent;
  formatPostDate = formatPostDate;
  isCompleted: boolean = false;
  selectedJobType: string | null = null;
  jobTypes: string[] = JOB_TYPES;
  jobCategories = JOB_CATEGORIES;
  skills: string[] = SKILLS;
  filteredSkills: string[] = [];
  searchSkill: string = '';
  workplaceOptions = WORKPLACE_TYPES;
  careerLevels = CAREER_LEVELS;
  experienceYears = EXPERIENCE_YEARS;
  tabs = ['overview', 'applicants', 'invited', 'offered', 'rejected'];
  isLoading: boolean = true;
  selectedJobId: string | undefined = '';
  jobForm: FormGroup;
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  activeFilter: string = 'all';

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
  userId: string = '';
  private selectedJobIdSubscription: Subscription;
  /* start component */
  constructor(
    private localStorageService: LocalStorageService,
    private jobService: JobService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private jobSelectionService: JobSelectionService,
    private companyService: CompanyService
  ) {
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

  /* initiliaze component */
  ngOnInit(): void {
    this.jobSelectionService.setSelectedJobId('');
    const storedUser = this.localStorageService.getItem('user');
    this.userId = storedUser.uid;
    this.getCompany();
    this.getAllJobs();
    this.getJobSelected();
  }

  ngOnDestroy() {
    if (this.selectedJobIdSubscription) {
      this.selectedJobIdSubscription.unsubscribe();
    }
  }
  /* logic */

  getCompany() {
    this.companyService
      .getCompanyByRecruiter(this.userId)
      .subscribe((company) => {
        if (company) {
          this.isCompleted = company.isCompletedProfile || false;
        }
      });
  }
  getJobSelected() {
    this.jobSelectionService.selectedJobId$.subscribe((jobId) => {
      this.selectedJobId = jobId;
    });
  }
  getAllJobs() {
    this.jobService.getAllJobsByRecruiter(this.userId).subscribe((jobs) => {
      if (jobs && jobs.length > 0) {
        this.jobs = jobs;
        this.filteredJobs = [...this.jobs];
        if (this.selectedJobId == '') {
          this.jobSelectionService.setSelectedJobId(this.filteredJobs[0].jobId);
        }
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
  }

  filterJobs(filter: string) {
    this.activeFilter = filter;
    this.isLoading = true;
    if (filter === 'all') {
      this.filteredJobs = this.jobs;
    } else if (filter === 'closed') {
      this.filteredJobs = this.jobs.filter((job) => job.isClosed);
    } else {
      this.filteredJobs = this.jobs.filter((job) => !job.isClosed);
    }
    setTimeout(() => (this.isLoading = false), 500);
  }

  filterSkills() {
    this.filteredSkills = this.skills.filter((skill) =>
      skill.toLowerCase().includes(this.searchSkill.toLowerCase())
    );
  }

  selectJob(jobId: string | undefined): void {
    this.selectedJobId = jobId;
    this.jobSelectionService.setSelectedJobId(jobId);
  }
  openModal() {
    if (!this.isCompleted) {
      this.toastr.warning(
        'Please complete your profile before adding a new job.'
      );
      return;
    }
    this.addJobModal.show();
  }

  onModalClose() {
    this.jobForm.reset({
      title: '',
      category: '',
      jobType: '',
      workplace: '',
      careerLevel: '',
      experience: '',
      descriptions: this.fb.array([]),
      requirements: this.fb.array([]),
      skills: [],
    });
    this.addJobModal.hide();
  }

  async saveJob() {
    if (this.jobForm.valid) {
      this.loadingService.start();
      const today = new Date();
      const jobData: Job = {
        jobId: uuidv4(),
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
        createDate: today,
        updateDate: today,
      };
      try {
        await this.jobService.addJob(jobData);
        this.loadingService.stop();
        this.toastr.success('Job Added Successfully!');
        this.onModalClose();
      } catch (error: any) {
        this.toastr.error('Error saving job:', error);
      }
    } else {
      this.toastr.warning(
        'Please fill in all required fields correctly!',
        'Warning'
      );
    }
  }
}
