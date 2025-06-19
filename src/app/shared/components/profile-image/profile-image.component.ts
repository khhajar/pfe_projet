import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { DEFAULT_IMAGE } from '../../constants/constants';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css'],
})
export class ProfileImageComponent {
  @Input() profileImage: string = '';
  defaultImage: string = DEFAULT_IMAGE;
  @Output() imageUploaded = new EventEmitter<string>(); // Emit URL after upload

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.cloudinaryService.uploadImage(file).subscribe((response: any) => {
        this.imageUploaded.emit(response.secure_url);
      });
    }
  }
}
