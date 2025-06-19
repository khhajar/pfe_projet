import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css'],
})
export class CandidateProfileComponent {
  pages: { path: string; name: string }[] = [
    { path: 'general-info', name: 'General Info' },
    { path: 'achievements', name: 'Achievements' },
    { path: 'career-interest', name: 'Career Interests' },
    { path: 'experience', name: 'Experience' },
    { path: 'skills', name: 'Skills' },
    { path: 'education', name: 'Education' },
    { path: 'certifications', name: 'Certifications' },
    { path: 'upload-cv', name: 'Upload CV' },
    { path: 'online-presence', name: 'Online Presence' },
  ];

  constructor(private readonly loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.start();
    setTimeout(() => {
      this.loadingService.stop();
    }, 1000);
  }
}
