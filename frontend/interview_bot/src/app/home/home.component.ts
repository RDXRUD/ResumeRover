import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { response } from 'express';
import { concatMap, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileService } from '../file.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {//implements OnInit
  selectedFile: File | null = null;
  fileName: string = '';
  fileData:any =null;
  constructor(private apiService: ApiService,private router: Router,private fileService: FileService) { 
    this.router.navigate(['/home']);
  };
  showFileDrop: boolean = false;

  @Input() buttonTitle:string = 'Upload Resume'
  @Output() fileChange = new EventEmitter<FileList>();

  onFileSelectedd(event: any) {
    const file: File = event.target.files[0];
    console.log('Selected file:', file);
    // You can handle the file here (e.g., upload to server)
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      this.fileService.setFile(this.selectedFile).then(() => {
        this.router.navigate(['/processing']);
      });
      // this.onUpload();
    }
  }
  // onUpload() {
  //   if (this.selectedFile) {
  //     this.apiService.postData(this.selectedFile).pipe(
  //       concatMap(response => {
  //         console.log('File uploaded successfully', response);
  //         return this.apiService.getData();
  //       }),
  //       concatMap(response2 => {
  //         this.fileData = response2;
  //         console.log('Data retrieved successfully', this.fileData);
  //         return this.apiService.getQuestions();
  //       })
  //     ).subscribe(
  //       audioBlob => {
  //         // Assuming the audio file is returned as a Blob or similar data type
  //         console.log('Audio file retrieved successfully', audioBlob);
  
  //         // Example: You can create an audio element and play the audio
  //         const audioUrl = URL.createObjectURL(audioBlob);
  //         const audioElement = new Audio(audioUrl);
  //         audioElement.play();
  
  //         // If you need to do further processing with the audio file,
  //         // you can do it here
  //       },
  //       error => {
  //         console.error('Error', error);
  //       }
  //     );
  //   }
  // }
  
}
