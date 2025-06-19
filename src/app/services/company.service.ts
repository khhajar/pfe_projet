import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private collectionName = 'companies';

  constructor(private firestore: AngularFirestore) {}

  async addCompany(company: Company): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(company.companyId)
      .set(company);
  }

  getCompanyByRecruiter(recruiterId: string): Observable<Company | undefined> {
    return this.firestore
      .collection<Company>(this.collectionName)
      .doc(recruiterId)
      .valueChanges();
  }

  getCompanyById(companyId: string): Observable<Company | undefined> {
    return this.firestore
      .collection<Company>(this.collectionName)
      .doc(companyId)
      .valueChanges();
  }

  async updateCompany(
    companyId: string | undefined,
    companyData: Partial<Company>
  ): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(companyId)
      .update(companyData);
  }
}
