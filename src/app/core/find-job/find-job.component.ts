import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Job } from 'src/app/models/job.model';
import { JobService } from 'src/app/services/job.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.css'],
})
export class FindJobComponent {
  currentPage = 1;
  itemsPerPage = 3;
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchTerm: string = '';
  filters: { [key: string]: string[] } = {
    workplace: [],
    careerLevel: [],
    city: [],
  };
  isLoading: boolean = true;
  get pages() {
    return Array.from(
      { length: Math.ceil(this.filteredJobs.length / this.itemsPerPage) },
      (_, index) => index + 1
    );
  }

  constructor(
    private loadingService: LoadingService,
    private jobService: JobService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.jobService.getAllCompleteJobs().subscribe({
      next: (jobs: Job[]) => {
        //filter closed jobs
        //this.jobs = jobs.filter((job) => !job.isClosed);
        this.filteredJobs = [...jobs];
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      error: (error) => {
        this.toastr.error('Error fetching jobs:', error);
        this.loadingService.stop();
      },
    });
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm.trim().toLowerCase(); // Save search term
    this.applyFilters(); // Apply filters with the updated search term
  }

  onFilterJob(filters: { [key: string]: string[] }) {
    this.filters = filters; // Save selected filters
    this.applyFilters(); // Apply filters with the updated filter options
  }

  applyFilters() {
    this.isLoading = true;
    this.filteredJobs = this.jobs.filter((job) => {
      const lowerTitle = job.title?.trim()?.toLowerCase() || '';
      const lowerCompany = job.company?.name?.trim()?.toLowerCase() || '';

      // Search condition
      const matchesSearch =
        !this.searchTerm ||
        lowerTitle.includes(this.searchTerm) ||
        lowerCompany.includes(this.searchTerm);

      // Filter conditions
      const matchesWorkplace =
        this.filters['workplace'].length === 0 ||
        this.filters['workplace'].includes(job.workplace || '');

      const matchesCareerLevel =
        this.filters['careerLevel'].length === 0 ||
        this.filters['careerLevel'].includes(job.careerLevel || '');

      const matchesCity =
        this.filters['city'].length === 0 ||
        this.filters['city'].includes(job.company?.city || '');

      return (
        matchesSearch && matchesWorkplace && matchesCareerLevel && matchesCity
      );
    });

    this.currentPage = 1; // Reset pagination after filtering
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredJobs.slice(start, end); // Use filteredJobs for pagination
  }
}
