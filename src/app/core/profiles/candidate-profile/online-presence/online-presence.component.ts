import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Candidate } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-online-presence',
  templateUrl: './online-presence.component.html',
  styleUrls: ['./online-presence.component.css'],
})
export class OnlinePresenceComponent {
  socialFields = [
    {
      key: 'linkedIn',
      label: 'LinkedIn',
      placeholder: 'linkedin.com/in/username',
      value: '',
    },
    {
      key: 'github',
      label: 'github',
      placeholder: 'your github page',
      value: '',
    },
  ];

  formData: { [key: string]: string } = {};
  userId: string;

  constructor(
    private candidateService: CandidateService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('user')?.uid;
    if (this.userId) {
      this.candidateService
        .getCandidateById(this.userId)
        .subscribe((candidate: Candidate | undefined) => {
          if (candidate?.onlinePresence) {
            this.formData = { ...candidate.onlinePresence };
          }
        });
    }
  }

  async handleSave(data: any) {
    this.loadingService.start();
    try {
      await this.candidateService.updateCandidate(this.userId, {
        onlinePresence: data,
      });
      setTimeout(() => {
        this.toastr.success('Online presence updated successfully');
        this.loadingService.stop();
      }, 500);
    } catch (error: any) {
      this.loadingService.stop();
      this.toastr.error(error, 'Error updating Online Presence');
    }
  }
}
