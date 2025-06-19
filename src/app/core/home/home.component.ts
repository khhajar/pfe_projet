import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/models/job.model';
import { JobService } from 'src/app/services/job.service';
import { LoadingService } from 'src/app/services/loading.service';
import { formatPostDate } from 'src/app/shared/utils/formatPostDate.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoading: boolean = true;
  pathCompanyImages: string = '/assets/images/companies/';
  companies = [
    'alten.jpg',
    'atos.png',
    'oracle.jpg',
    'SQLI.jpg',
    'capgemini.jpg',
    'involys.jpg',
  ];

  lastJobs: Job[] = [];
  mockLastJobs: Job[] = [
    {
      title: 'Front End Developer',
      careerLevel: 'Junior',
      createDate: new Date(),
      skills: [],
    },
    {
      title: 'Back End Developer',
      careerLevel: 'Junior',
      createDate: new Date(),
      skills: [],
    },
    {
      title: 'Devops',
      careerLevel: 'Expert',
      createDate: new Date(),
      skills: [],
    },
    {
      title: 'Sharepoint Developer',
      careerLevel: 'Senior',
      createDate: new Date(),
      skills: [],
    },
  ];
  getFormatPostDate = formatPostDate;

  jobTypes: { image: string; name: string }[] = [
    { image: 'cybersecurity.jpg', name: 'Cybersecurity' },
    { image: 'developer.jpg', name: 'Software Developer' },
    { image: 'graphic-design.jpg', name: 'Graphic Designer' },
    { image: 'IT.jfif', name: 'IT Development' },
    { image: 'manager.jpg', name: 'IT Manager' },
  ];
  trackByIndex(index: number, _: any): number {
    return index;
  }

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadingService.start();
    this.jobService.getLast8CompleteJobs().subscribe((jobs) => {
      if (jobs && jobs.length > 0) {
        this.lastJobs = jobs;
      } else {
        this.lastJobs = [...this.mockLastJobs];
      }
      setTimeout(() => {
        this.loadingService.stop();
        this.isLoading = false;
      }, 500);
    });
  }

  goToRegistration() {
    this.router.navigate(['/choice-signup']);
  }
}
