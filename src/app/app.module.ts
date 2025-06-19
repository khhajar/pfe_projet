import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { HomeComponent } from './core/home/home.component';
import { WelcomeScreenComponent } from './core/home/welcome-screen/welcome-screen.component';
import { FindJobComponent } from './core/find-job/find-job.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { SearchInputComponent } from './shared/components/search-input/search-input.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { FilterSectionComponent } from './core/find-job/filter-section/filter-section.component';
import { JobCardComponent } from './core/find-job/job-card/job-card.component';
import { FilterBlockComponent } from './shared/components/filter-block/filter-block.component';
import { RangeFilterComponent } from './shared/components/range-filter/range-filter.component';
import { DateFilterComponent } from './shared/components/date-filter/date-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './core/login/login.component';
import { RegisterUserComponent } from './core/register-user/register-user.component';
import { RegisterRecruiterComponent } from './core/register-recruiter/register-recruiter.component';
import { ChoiceSignUpComponent } from './core/choice-sign-up/choice-sign-up.component';
import { JobDetailsComponent } from './core/job-details/job-details.component';
import { CandidateProfileComponent } from './core/profiles/candidate-profile/candidate-profile.component';
import { TabPageMenuComponent } from './shared/components/tab-page-menu/tab-page-menu.component';
import { AchievementComponent } from './core/profiles/candidate-profile/achievement/achievement.component';
import { OnlinePresenceComponent } from './core/profiles/candidate-profile/online-presence/online-presence.component';
import { UploadCvComponent } from './core/profiles/candidate-profile/upload-cv/upload-cv.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { CertificationComponent } from './core/profiles/candidate-profile/certification/certification.component';
import { SkillComponent } from './core/profiles/candidate-profile/skill/skill.component';
import { ItemCardComponent } from './shared/components/item-card/item-card.component';
import { ExperienceComponent } from './core/profiles/candidate-profile/experience/experience.component';
import { CareerInterestComponent } from './core/profiles/candidate-profile/career-interest/career-interest.component';
import { EducationComponent } from './core/profiles/candidate-profile/education/education.component';
import { GeneralInfoComponent } from './core/profiles/candidate-profile/general-info/general-info.component';
import { ApplicationComponent } from './core/profiles/candidate-profile/application/application.component';
import { CompanyProfileComponent } from './core/profiles/company-profile/company-profile.component';
import { MainInfoComponent } from './core/profiles/company-profile/main-info/main-info.component';
import { MediaProfileComponent } from './core/profiles/company-profile/media-profile/media-profile.component';
import { FindCvComponent } from './core/find-cv/find-cv.component';
import { FilterCvComponent } from './core/find-cv/filter-cv/filter-cv.component';
import { CvCardComponent } from './core/find-cv/cv-card/cv-card.component';
import { CvDetailsComponent } from './core/cv-details/cv-details.component';
import { RecruiterDashboardComponent } from './core/recruiter-dashboard/recruiter-dashboard.component';
import { OverviewJobComponent } from './core/recruiter-dashboard/overview-job/overview-job.component';
import { InvitedComponent } from './core/recruiter-dashboard/invited/invited.component';
import { OfferedComponent } from './core/recruiter-dashboard/offered/offered.component';
import { RejectedComponent } from './core/recruiter-dashboard/rejected/rejected.component';
import { ApplicantJobPostComponent } from './core/recruiter-dashboard/applicant-job-post/applicant-job-post.component';
import { CarteSelectorComponent } from './shared/components/carte-selector/carte-selector.component';
import { SocialLinksFormComponent } from './shared/components/social-links-form/social-links-form.component';
import { ProfileImageComponent } from './shared/components/profile-image/profile-image.component';
import { CandidateInfoCardComponent } from './shared/components/candidate-info-card/candidate-info-card.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from './environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PageUnauthorizedComponent } from './core/page-unauthorized/page-unauthorized.component';
import { SpinnerLocalComponent } from './shared/components/spinner-local/spinner-local.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { JobDescriptionComponent } from './shared/components/job-description/job-description.component';
import { ForgetPasswordComponent } from './core/forget-password/forget-password.component';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    WelcomeScreenComponent,
    FindJobComponent,
    PageNotFoundComponent,
    SearchInputComponent,
    FooterComponent,
    FilterSectionComponent,
    JobCardComponent,
    FilterBlockComponent,
    RangeFilterComponent,
    DateFilterComponent,
    LoadingSpinnerComponent,
    LoginComponent,
    RegisterUserComponent,
    RegisterRecruiterComponent,
    ChoiceSignUpComponent,
    JobDetailsComponent,
    CandidateProfileComponent,
    TabPageMenuComponent,
    AchievementComponent,
    OnlinePresenceComponent,
    UploadCvComponent,
    ModalComponent,
    CertificationComponent,
    SkillComponent,
    ItemCardComponent,
    ExperienceComponent,
    CareerInterestComponent,
    EducationComponent,
    GeneralInfoComponent,
    ApplicationComponent,
    CompanyProfileComponent,
    MainInfoComponent,
    MediaProfileComponent,
    FindCvComponent,
    FilterCvComponent,
    CvCardComponent,
    CvDetailsComponent,
    RecruiterDashboardComponent,
    OverviewJobComponent,
    InvitedComponent,
    OfferedComponent,
    RejectedComponent,
    ApplicantJobPostComponent,
    CarteSelectorComponent,
    SocialLinksFormComponent,
    ProfileImageComponent,
    CandidateInfoCardComponent,
    PageUnauthorizedComponent,
    SpinnerLocalComponent,
    JobDescriptionComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      progressBar: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
