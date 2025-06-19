import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { AppliedJob, Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private collectionName = 'candidates';

  constructor(private firestore: AngularFirestore) {}

  async addCandidate(candidate: Candidate): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(candidate.userId)
      .set(candidate);
  }

  getCandidateById(userId: string): Observable<Candidate | undefined> {
    return this.firestore
      .collection<Candidate>(this.collectionName)
      .doc(userId)
      .valueChanges();
  }

  getAllCandidates(): Observable<Candidate[]> {
    return this.firestore
      .collection<Candidate>(this.collectionName)
      .valueChanges();
  }

  getAllCandidateApplyJobId(jobId: string): Observable<Candidate[]> {
    return this.firestore
      .collection<Candidate>(this.collectionName)
      .valueChanges()
      .pipe(
        map((candidates: Candidate[]) =>
          candidates.filter((candidate) =>
            candidate.appliedJobs?.some((job) => job.jobId === jobId)
          )
        )
      );
  }

  getAllCandidatesByJobAndStatus(
    jobId: string,
    status: AppliedJob['status']
  ): Observable<Candidate[]> {
    return this.firestore
      .collection<Candidate>(this.collectionName)
      .valueChanges()
      .pipe(
        map((candidates: Candidate[]) =>
          candidates.filter((candidate) =>
            candidate.appliedJobs?.some(
              (job) => job.jobId === jobId && job.status === status
            )
          )
        )
      );
  }

  async updateCandidate(
    userId: string | undefined,
    candidateData: Partial<Candidate>
  ): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(userId)
      .update(candidateData);
  }
}
