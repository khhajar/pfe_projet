import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly cloudName = 'dd0eangic';
  private readonly uploadPreset = 'job-portal';
  private readonly apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Uploads an image file to Cloudinary
   * @param file The image file to upload
   * @returns Observable with the upload response
   */
  uploadImage(file: File): Observable<any> {
    return this.uploadFile(file, 'image');
  }

  /**
   * Uploads a PDF file to Cloudinary
   * @param file The PDF file to upload
   * @returns Observable with the upload response
   */
  uploadPDF(file: File): Observable<any> {
    return this.uploadFile(file, 'pdf');
  }

  /**
   * Generic file upload method
   * @param file File to upload
   * @param resourceType Resource type ('image' or 'raw')
   * @private
   */
  private uploadFile(file: File, resourceType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('resource_type', resourceType);
    return this.http.post(this.apiUrl, formData);
  }

  /**
   * Extracts public ID from Cloudinary URL
   * @param url Cloudinary URL
   */
  getPublicIdFromUrl(url: string): string | null {
    if (!url) return null;
    const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : null;
  }
}
