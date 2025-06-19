import { Component, Input } from '@angular/core';
import { AppliedJob, ScheduleDate } from 'src/app/models/candidate.model';
import * as moment from 'moment';
import { DEFAULT_IMAGE } from '../../constants/constants';
@Component({
  selector: 'app-candidate-info-card',
  templateUrl: './candidate-info-card.component.html',
  styleUrls: ['./candidate-info-card.component.css'],
})
export class CandidateInfoCardComponent {
  @Input() candidateName: string = '';
  @Input() candidatePosition: string = '';
  @Input() candidateExperience: string = '';
  @Input() candidateImage: string = '';
  @Input() candidateStatus: AppliedJob['status'] | undefined;
  @Input() candidateSchedule: ScheduleDate | undefined;
  defaultImage: string = DEFAULT_IMAGE;

  formatDate(date: any): string {
    return moment.unix(date?.seconds).format('YYYY-MM-DD'); // Output: "2025-04-09"
  }
}
