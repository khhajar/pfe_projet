import { Component, Input } from '@angular/core';
import { AppliedJob } from 'src/app/models/candidate.model';
import { Job } from 'src/app/models/job.model';
import { DEFAULT_IMAGE } from 'src/app/shared/constants/constants';
import { formatPostDate } from 'src/app/shared/utils/formatPostDate.util';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css'],
})
export class JobCardComponent {
  @Input() set job(item: Job) {
    this._job = item;
    this.logoCompany = item?.company?.logo;
    this.companyName = item?.company?.name;
    this.skills = item?.skills?.join(', ');
  }

  get job() {
    return this._job;
  }
  _job: Job;
  @Input() jobStatus: AppliedJob['status'] | undefined;
  @Input() selectedTab: string;
  formatPostDate = formatPostDate;
  logoCompany: string | undefined = '';
  companyName: string | undefined = '';
  userId: string = '';
  skills: string | undefined = '';
  defaultImage: string = DEFAULT_IMAGE;
  constructor() {}
}
