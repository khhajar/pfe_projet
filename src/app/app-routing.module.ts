import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoiceSignUpComponent } from './core/choice-sign-up/choice-sign-up.component';
import { FindCvComponent } from './core/find-cv/find-cv.component';
import { FindJobComponent } from './core/find-job/find-job.component';
import { HomeComponent } from './core/home/home.component';
import { JobDetailsComponent } from './core/job-details/job-details.component';
import { LoginComponent } from './core/login/login.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { AchievementComponent } from './core/profiles/candidate-profile/achievement/achievement.component';
import { CandidateProfileComponent } from './core/profiles/candidate-profile/candidate-profile.component';
import { CareerInterestComponent } from './core/profiles/candidate-profile/career-interest/career-interest.component';
import { CertificationComponent } from './core/profiles/candidate-profile/certification/certification.component';
import { EducationComponent } from './core/profiles/candidate-profile/education/education.component';
import { ExperienceComponent } from './core/profiles/candidate-profile/experience/experience.component';
import { GeneralInfoComponent } from './core/profiles/candidate-profile/general-info/general-info.component';
import { OnlinePresenceComponent } from './core/profiles/candidate-profile/online-presence/online-presence.component';
import { SkillComponent } from './core/profiles/candidate-profile/skill/skill.component';
import { UploadCvComponent } from './core/profiles/candidate-profile/upload-cv/upload-cv.component';
import { CompanyProfileComponent } from './core/profiles/company-profile/company-profile.component';
import { MainInfoComponent } from './core/profiles/company-profile/main-info/main-info.component';
import { MediaProfileComponent } from './core/profiles/company-profile/media-profile/media-profile.component';
import { ApplicantJobPostComponent } from './core/recruiter-dashboard/applicant-job-post/applicant-job-post.component';
import { InvitedComponent } from './core/recruiter-dashboard/invited/invited.component';
import { OfferedComponent } from './core/recruiter-dashboard/offered/offered.component';
import { OverviewJobComponent } from './core/recruiter-dashboard/overview-job/overview-job.component';
import { RecruiterDashboardComponent } from './core/recruiter-dashboard/recruiter-dashboard.component';
import { RejectedComponent } from './core/recruiter-dashboard/rejected/rejected.component';
import { RegisterRecruiterComponent } from './core/register-recruiter/register-recruiter.component';
import { RegisterUserComponent } from './core/register-user/register-user.component';
import { RoleGuard } from './guards/auth.guard';
import { ApplicationComponent } from './core/profiles/candidate-profile/application/application.component';
import { PageUnauthorizedComponent } from './core/page-unauthorized/page-unauthorized.component';
import { CvDetailsComponent } from './core/cv-details/cv-details.component';
import { ForgetPasswordComponent } from './core/forget-password/forget-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'find-job', component: FindJobComponent },
  { path: 'login', component: LoginComponent },
  { path: 'choice-signup', component: ChoiceSignUpComponent },
  {
    path: 'register',
    children: [
      { path: 'job', component: RegisterUserComponent },
      { path: 'hire', component: RegisterRecruiterComponent },
    ],
  },
  {
    path: 'profile',
    children: [
      {
        path: 'candidate',
        component: CandidateProfileComponent,
        canActivate: [RoleGuard],
        data: { role: 'candidate' },
        children: [
          { path: 'general-info', component: GeneralInfoComponent },
          { path: 'achievements', component: AchievementComponent },
          { path: 'online-presence', component: OnlinePresenceComponent },
          { path: 'upload-cv', component: UploadCvComponent },
          { path: 'certifications', component: CertificationComponent },
          { path: 'skills', component: SkillComponent },
          { path: 'experience', component: ExperienceComponent },
          { path: 'career-interest', component: CareerInterestComponent },
          { path: 'education', component: EducationComponent },
          { path: '', redirectTo: 'general-info', pathMatch: 'full' },
        ],
      },
    ],
  },
  {
    path: 'profile',
    children: [
      {
        path: 'company',
        component: CompanyProfileComponent,
        canActivate: [RoleGuard],
        data: { role: 'recruiter' },
        children: [
          { path: 'main-info', component: MainInfoComponent },
          { path: 'online-presence', component: MediaProfileComponent },
          { path: '', redirectTo: 'main-info', pathMatch: 'full' },
        ],
      },
    ],
  },
  {
    path: 'cv/:id',
    component: CvDetailsComponent,
    canActivate: [RoleGuard],
    data: { role: 'recruiter' },
  },
  {
    path: 'search-cv',
    component: FindCvComponent,
    canActivate: [RoleGuard],
    data: { role: 'recruiter' },
  },
  {
    path: 'candidate/applications',
    component: ApplicationComponent,
    canActivate: [RoleGuard],
    data: { role: 'candidate' },
  },
  {
    path: 'dashboard',
    component: RecruiterDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'recruiter' },
    children: [
      { path: 'overview', component: OverviewJobComponent },
      { path: 'overview/:jobId', component: OverviewJobComponent },
      { path: 'applicants/:jobId', component: ApplicantJobPostComponent },
      { path: 'invited/:jobId', component: InvitedComponent },
      { path: 'offered/:jobId', component: OfferedComponent },
      { path: 'rejected/:jobId', component: RejectedComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: 'job/:id', component: JobDetailsComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'unauthorized', component: PageUnauthorizedComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
