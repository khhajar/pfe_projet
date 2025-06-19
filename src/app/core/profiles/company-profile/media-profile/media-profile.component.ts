import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-media-profile',
  templateUrl: './media-profile.component.html',
  styleUrls: ['./media-profile.component.css'],
})
export class MediaProfileComponent implements OnInit {
  socialFields = [
    {
      key: 'linkedIn',
      label: 'LinkedIn',
      placeholder: 'linkedin.com/in/username',
      value: '',
    },
    {
      key: 'website',
      label: 'Website',
      placeholder: 'your personal website',
      value: '',
    },
  ];

  formData: { [key: string]: string } = {};
  companyId: string;

  constructor(
    private companyService: CompanyService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.companyId = this.localStorageService.getItem('user')?.uid;
    if (this.companyId) {
      this.companyService
        .getCompanyById(this.companyId)
        .subscribe((company) => {
          if (company?.onlinePresence) {
            this.formData = { ...company.onlinePresence };
          }
        });
    }
  }

  async handleSave(data: any) {
    try {
      this.loadingService.start();
      await this.companyService.updateCompany(this.companyId, {
        onlinePresence: data,
      });
      this.toastr.success('Successfully updated company');
    } catch (error: any) {
      this.toastr.error(error, 'Error updating Online Presence');
    } finally {
      setTimeout(() => {
        this.loadingService.stop();
      }, 500);
    }
  }
}
