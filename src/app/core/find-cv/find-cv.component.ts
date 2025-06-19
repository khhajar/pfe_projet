import { Component } from '@angular/core';
import { Candidate } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-find-cv',
  templateUrl: './find-cv.component.html',
  styleUrls: ['./find-cv.component.css'],
})
export class FindCvComponent {
  currentPage = 1;
  itemsPerPage = 5;
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  filters: { [key: string]: string[] } = {
    careerLevels: [],
    genders: [],
    workPlaces: [],
    cities: [],
  };
  candidates: Candidate[] = [];
  isLoading: boolean = true;

  /* get & set */
  get pages() {
    return Array.from(
      { length: Math.ceil(this.filteredCandidates.length / this.itemsPerPage) },
      (_, index) => index + 1
    );
  }

  constructor(
    private loadingService: LoadingService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.getAllCandidates();
  }

  getAllCandidates() {
    this.candidateService.getAllCandidates().subscribe((candidates) => {
      if (candidates) {
        this.candidates = candidates.filter(
          (candidate) => candidate.isCompleteProfile
        );
        this.filteredCandidates = [...this.candidates];
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    });
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCandidates.slice(start, end);
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm.trim().toLowerCase();
    this.applyFilters();
  }

  onFilterJob(filters: { [key: string]: string[] }) {
    this.filters = filters;
    this.applyFilters();
  }

  applyFilters() {
    this.isLoading = true;
    this.filteredCandidates = this.candidates.filter((candidate) => {
      const lowerJobTitle = candidate.jobTitle?.trim()?.toLowerCase() || '';
      const lowerFirstName = candidate.firstName?.trim()?.toLowerCase() || '';
      const lowerLastName = candidate.lastName?.trim()?.toLowerCase() || '';

      const workplaces = this.filters['workPlaces']?.map((item) =>
        item.toLowerCase()
      );
      const careerLevels = this.filters['careerLevels']?.map((item) =>
        item.toLowerCase()
      );
      const cities = this.filters['cities']?.map((item) => item.toLowerCase());
      const genders = this.filters['genders']?.map((item) =>
        item.toLowerCase()
      );

      // Filter conditions
      const matchesWorkplace =
        workplaces.length === 0 ||
        workplaces.includes(
          candidate.careerInterest?.workplacePreferred?.toLowerCase() || ''
        );

      const matchesCareerLevel =
        careerLevels.length === 0 ||
        careerLevels.includes(
          candidate.careerInterest?.careerLevel?.toLowerCase() || ''
        );

      const matchesCity =
        cities.length === 0 ||
        cities.includes(candidate.city?.toLowerCase() || '');

      const matchesGender =
        genders.length === 0 ||
        genders.includes(candidate.gender?.toLowerCase() || '');

      //Search Term
      const matchesSearch =
        !this.searchTerm ||
        lowerJobTitle.includes(this.searchTerm) ||
        lowerFirstName.includes(this.searchTerm) ||
        lowerLastName.includes(this.searchTerm);

      return (
        matchesSearch &&
        matchesWorkplace &&
        matchesCareerLevel &&
        matchesCity &&
        matchesGender
      );
    });
    this.currentPage = 1;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
