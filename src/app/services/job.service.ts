import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  async,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { Job } from '../models/job.model';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private collectionName = 'jobs';
  private companyCollection = 'companies';

  constructor(private firestore: AngularFirestore) {}

  async addJob(job: Job): Promise<void> {
    try {
      if (!job.jobId) throw new Error('Job ID is required');
      await this.firestore
        .collection(this.collectionName)
        .doc(job.jobId)
        .set(job);
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  }

  getAllJobs(): Observable<Job[]> {
    return this.firestore.collection<Job>(this.collectionName).valueChanges();
  }

  getAllCompleteJobs(): Observable<Job[]> {
    return this.firestore
      .collection<Job>(this.collectionName)
      .valueChanges()
      .pipe(
        switchMap((jobs) => {
          if (jobs.length === 0) {
            return of([]);
          }

          const jobObservables = jobs.map((job) =>
            this.firestore
              .collection<Company>(this.companyCollection)
              .doc(job.recruiterId)
              .valueChanges()
              .pipe(
                take(1),
                map((company) => ({
                  ...job,
                  company: company || null,
                }))
              )
          );
          return forkJoin(jobObservables);
        })
      );
  }

  getAllJobsByRecruiter(recruiterId: string): Observable<Job[]> {
    return this.firestore
      .collection<Job>(this.collectionName, (ref) =>
        ref.where('recruiterId', '==', recruiterId)
      )
      .valueChanges();
  }

  getJobById(jobId: string): Observable<Job | undefined> {
    if (jobId == '' || jobId == undefined || jobId == null) {
      return new Observable<Job | undefined>();
    }
    return this.firestore
      .collection<Job>(this.collectionName)
      .doc(jobId)
      .valueChanges();
  }

  getJobCompleteById(jobId: string): Observable<Job | undefined> {
    if (!jobId) {
      return new Observable<Job>();
    }
    return this.firestore
      .collection<Job>(this.collectionName)
      .doc(jobId)
      .valueChanges()
      .pipe(
        switchMap((job) => {
          if (!job || !job.recruiterId) {
            return of(job);
          }

          return this.firestore
            .collection<Company>(this.companyCollection)
            .doc(job.recruiterId)
            .valueChanges()
            .pipe(
              take(1),
              map((company) => ({
                ...job,
                company: company || null,
              }))
            );
        })
      );
  }

  async updateJob(jobId: string, jobData: Partial<Job>): Promise<void> {
    try {
      if (!jobId) throw new Error('Job ID is required');
      await this.firestore
        .collection(this.collectionName)
        .doc(jobId)
        .update(jobData);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  getLast8CompleteJobs(): Observable<Job[]> {
    return this.firestore
      .collection<Job>(this.collectionName, (ref) =>
        ref.orderBy('createDate', 'desc').limit(8)
      )
      .valueChanges()
      .pipe(
        switchMap((jobs) => {
          if (jobs.length === 0) {
            return of([]);
          }

          const jobObservables = jobs.map((job) =>
            this.firestore
              .collection<Company>(this.companyCollection)
              .doc(job.recruiterId)
              .valueChanges()
              .pipe(
                take(1),
                map((company) => ({
                  ...job,
                  company: company || null,
                }))
              )
          );
          return forkJoin(jobObservables);
        })
      );
  }
}
