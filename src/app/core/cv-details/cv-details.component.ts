import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Candidate } from 'src/app/models/candidate.model';
import { DEFAULT_IMAGE } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-cv-details',
  templateUrl: './cv-details.component.html',
  styleUrls: ['./cv-details.component.css'],
})
export class CvDetailsComponent implements OnInit {
  candidate?: Candidate;
  isLoading: boolean = true;
  userId: string = '';
  defaultImage: string = DEFAULT_IMAGE;

  constructor(
    private readonly candidateService: CandidateService,
    private readonly loadingService: LoadingService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.activeRoute.snapshot.paramMap.get('id')!;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate) => {
          if (candidate) {
            this.candidate = candidate;
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    }
  }

  goBack(): void {
    history.back();
  }
}
