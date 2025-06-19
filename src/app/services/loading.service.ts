import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new Subject<boolean>();
  public loading$ = this.loadingSubject.asObservable();

  start() {
    this.loadingSubject.next(true);
  }

  stop() {
    this.loadingSubject.next(false);
  }
}
