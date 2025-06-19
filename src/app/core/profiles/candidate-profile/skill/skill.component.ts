import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { name } from '@cloudinary/url-gen/actions/namedTransformation';
import { ToastrService } from 'ngx-toastr';
import { Language, Skill } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import {
  EXPERIENCE_YEARS,
  LANGUAGE_LEVELS,
} from 'src/app/shared/constants/constants';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
})
export class SkillComponent implements OnInit {
  years: string[] = EXPERIENCE_YEARS;
  levels: string[] = LANGUAGE_LEVELS;
  skillForm!: FormGroup;
  languageForm!: FormGroup;
  skills: Skill[] = [];
  languages: Language[] = [];
  isLoading = true;
  userId: string = '';
  skillId: string = '';
  languageId: string = '';
  @ViewChild('deleteModal') deleteModal: ModalComponent;

  constructor(
    private readonly fb: FormBuilder,
    private readonly candidateService: CandidateService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.getCandidate();
  }

  private initializeForms(): void {
    this.skillForm = this.fb.group({
      id: [''],
      skillName: ['', Validators.required],
      yearExperience: ['', Validators.required],
    });

    this.languageForm = this.fb.group({
      id: [''],
      languageName: ['', Validators.required],
      level: ['', Validators.required],
    });
  }

  private getCandidate(): void {
    this.userId = this.localStorageService.getItem('user')?.uid ?? '';

    if (!this.userId) return;

    this.candidateService
      .getCandidateById(this.userId)
      .subscribe((candidate) => {
        if (candidate) {
          this.skills = candidate?.skills ?? [];
          this.languages = candidate?.languages ?? [];
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
  }

  async addSkill(): Promise<void> {
    if (!this.skillForm.valid) return;
    this.skillForm.value.id = uuidv4();
    this.skills.push(this.skillForm.value as Skill);
    this.skillForm.reset({
      skillName: '',
      yearExperience: '',
    });
    await this.updateCandidateData({ skills: this.skills });
  }

  async removeSkill(): Promise<void> {
    const index = this.skills.findIndex((a) => a.id === this.skillId);
    if (index !== -1) {
      this.skills.splice(index, 1);
      await this.updateCandidateData({ skills: this.skills });
    }
  }

  async addLanguage(): Promise<void> {
    if (!this.languageForm.valid) return;
    this.languageForm.value.id = uuidv4();
    this.languages.push(this.languageForm.value as Language);
    this.languageForm.reset({
      languageName: '',
      level: '',
    });
    await this.updateCandidateData({ languages: this.languages });
  }

  async removeLanguage(): Promise<void> {
    const index = this.languages.findIndex((a) => a.id === this.languageId);
    if (index !== -1) {
      this.languages.splice(index, 1);
      await this.updateCandidateData({ languages: this.languages });
    }
  }

  private async updateCandidateData(
    update: Partial<{ skills: Skill[]; languages: Language[] }>
  ): Promise<void> {
    if (!this.userId) return;
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        ...update,
        updatedAt: new Date(),
      });
      setTimeout(() => {
        this.toastr.success('Saved successful!', 'Success');
        this.loadingService.stop();
      }, 500);
    } catch (error) {
      this.toastr.error('Failed to Saved data', 'Error');
    }
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.skillName || '' || index.toString();
  }

  trackByLanguage(index: number, language: Language): string {
    return language.languageName || '' || index.toString();
  }

  openDeleteModal(type: 'skill' | 'language', id: string): void {
    if (type === 'skill') {
      this.skillId = id;
    } else if (type === 'language') {
      this.languageId = id;
    }
    this.deleteModal.show();
  }

  onClose(): void {
    this.deleteModal.hide();
    this.skillId = '';
    this.languageId = '';
  }

  onConfirmDelete(): void {
    if (this.skillId !== '') {
      this.removeSkill();
    }
    if (this.languageId !== '') {
      this.removeLanguage();
    }
    this.onClose();
  }
}
