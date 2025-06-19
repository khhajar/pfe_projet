import { Component, Input } from '@angular/core';
import { Candidate } from 'src/app/models/candidate.model';
import { DEFAULT_IMAGE } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-cv-card',
  templateUrl: './cv-card.component.html',
  styleUrls: ['./cv-card.component.css'],
})
export class CvCardComponent {
  @Input() candidate: Candidate;
  defaultImage: string = DEFAULT_IMAGE;
  constructor() {}
}
