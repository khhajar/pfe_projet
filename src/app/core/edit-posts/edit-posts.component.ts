import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-posts',
  templateUrl: './edit-posts.component.html',
  styleUrls: ['./edit-posts.component.css'],
})
export class EditPostsComponent {
  selectedIndex: number | null = null;
  jobTypes: string[] = ['job', 'intership'];
}
