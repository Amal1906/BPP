import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-catalyst-details-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './catalyst-details-modal.component.html',
  styleUrls: ['./catalyst-details-modal.component.scss']
})
export class CatalystDetailsModalComponent {
  currentVideo: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<CatalystDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  playVideo(videoPath: string): void {
    this.currentVideo = videoPath;
  }

  stopVideo(): void {
    this.currentVideo = null;
  }
}
