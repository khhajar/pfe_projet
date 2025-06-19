import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobSelectionService {
  private selectedJobIdSubject = new BehaviorSubject<string | undefined>('');
  selectedJobId$ = this.selectedJobIdSubject.asObservable();

  setSelectedJobId(jobId: string | undefined) {
    this.selectedJobIdSubject.next(jobId);
  }

  getSelectedJobId(): string | undefined {
    return this.selectedJobIdSubject.getValue();
  }
}
