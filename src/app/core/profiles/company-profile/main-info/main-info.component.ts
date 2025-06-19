import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  CITIES,
  COMPANY_SIZES,
  SPECIALTIES,
} from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css'],
})
export class MainInfoComponent implements OnInit {
  profileImage: string = '';
  cities: string[] = CITIES;
  companSizes: string[] = COMPANY_SIZES;
  specialties: string[] = SPECIALTIES;
  mainInfoForm!: FormGroup;
  companyId: string | undefined;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getCompanyData();
    this.initializeForm();
  }

  getCompanyData() {
    this.companyId = this.localStorageService.getItem('user')?.uid;
    if (this.companyId) {
      this.companyService
        .getCompanyById(this.companyId)
        .subscribe((company) => {
          if (company) {
            setTimeout(() => {
              this.mainInfoForm.patchValue({
                companyName: company.name,
                city: company.city,
                companySize: company.size,
                specialties: company.speciality,
                phone: company.number,
                about: company.about,
              });

              if (company.logo) {
                this.profileImage = company.logo;
              }
              this.isLoading = false;
            }, 1000);
          } else {
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
        });
    }
  }

  initializeForm() {
    this.mainInfoForm = this.fb.group({
      companyName: ['', Validators.required],
      city: ['', Validators.required],
      companySize: ['', Validators.required],
      specialties: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')],
      ],
      about: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  onImageSelected(url: string): void {
    this.profileImage = url;
  }

  async onSubmit() {
    if (this.mainInfoForm.valid && this.companyId) {
      try {
        this.loadingService.start();
        const formData = this.mainInfoForm.value;
        const data = {
          name: formData.companyName,
          city: formData.city,
          speciality: formData.specialties,
          size: formData.companySize,
          about: formData.about,
          number: formData.phone,
          logo: this.profileImage,
          isCompletedProfile: true,
          updatedAt: new Date(),
        };

        await this.companyService.updateCompany(this.companyId, data);
        this.toastr.success('Successfully updated company');
      } catch (error: any) {
        this.toastr.error(error, 'Error updating company');
      } finally {
        setTimeout(() => {
          this.loadingService.stop();
        }, 500);
      }
    } else {
      this.toastr.error('Form is invalid');
    }
  }
}
