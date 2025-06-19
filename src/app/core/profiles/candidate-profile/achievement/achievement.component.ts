import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css'],
})
export class AchievementComponent {
  formsAchievement!: FormGroup;
  userId: string = '';
  isSaving: boolean = false;
  isLoading: boolean = true;

  constructor(
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private fb: FormBuilder,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getCandidate();
    this.initializeForm();
  }

  initializeForm() {
    this.formsAchievement = this.fb.group({
      achievements: [
        '',
        [
          Validators.required,
          Validators.minLength(25),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  get achievementsControl() {
    return this.formsAchievement.get('achievements');
  }

  getCandidate() {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate) => {
          if (candidate) {
            this.formsAchievement.patchValue({
              achievements: candidate.achievements,
            });
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    }
  }

  async saveAchievements() {
    if (this.formsAchievement.invalid) {
      this.formsAchievement.markAllAsTouched();
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
    }
    this.loadingService.start();
    try {
      this.isSaving = true;
      const { achievements } = this.formsAchievement.value;
      await this.candidateService.updateCandidate(this.userId, {
        achievements: achievements,
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.loadingService.stop();
        this.toastr.success('saved achievements successfully!', 'Success');
        this.isSaving = false;
      }, 500);
    } catch (errors: any) {
      this.loadingService.stop();
      this.toastr.error(errors, 'Error updating achievements');
    }
  }
}
