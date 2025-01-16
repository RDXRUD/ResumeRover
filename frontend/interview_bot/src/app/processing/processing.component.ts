import { Component, OnInit ,CUSTOM_ELEMENTS_SCHEMA, OnDestroy} from '@angular/core';
import { FileService } from '../file.service';
import { ApiService } from '../api.service';
import { concatMap } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-processing',
  standalone: true,
  imports: [],
  templateUrl: './processing.component.html',
  styleUrl: './processing.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProcessingComponent implements OnInit,OnDestroy{
  selectedFile: File | null = null;
  fileData: any;
  textList:string[]= [
    "Parsing PDF...",
    "Extracting Text...",
    "Analysing Document Structure...",
    "Segmenting Content...",
    "Contextual Analysing...",
    "Data Formatting...",
    "Extracting Keywords...",
    "Indexing...",
    "Validating...",
    "Reporting..."
];
currentIndex: number = 0;
currentText: string = this.textList[this.currentIndex];
questions:any;
audioFiles:any;
private subscription: Subscription | undefined;

  constructor(private apiService: ApiService,private fileService: FileService,private router:Router) {}
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  ngOnInit(): void {
    this.selectedFile = this.fileService.getFile();
    this.onUpload();
    this.subscription = interval(2300).subscribe(() => {
      this.currentIndex = (this.currentIndex + 1) % this.textList.length;
      this.currentText = this.textList[this.currentIndex];
    });
    if(this.fileData && this.currentIndex==this.textList.length-1){
      this.router.navigate(['/interview']);
    }
  }



  onUpload() {
    if (this.selectedFile) {
      this.apiService.postData(this.selectedFile).pipe(
        concatMap(response => {
          console.log('File uploaded successfully', response);
          return this.apiService.getData();
        }),
        concatMap(response2 => {
          this.fileData = response2;
          console.log('Data retrieved successfully', this.fileData);
          return this.apiService.getQuestions();
        })
      ,concatMap( response3 => {
          // Assuming the audio file is returned as a Blob or similar data type
          this.audioFiles=response3;
          console.log('Audio file retrieved successfully', this.audioFiles);
          return this.apiService.getFiles();
          // Example: You can create an audio element and play the audio
          // const audioUrl = URL.createObjectURL(audioBlob);
          // const audioElement = new Audio(audioUrl);
          // audioElement.play();
  
          // If you need to do further processing with the audio file,
          // you can do it here
        })
      ).subscribe(
          res => {
            this.audioFiles=res;
            console.log(this.audioFiles)
            if(this.audioFiles){
              this.fileService.setAudios(this.audioFiles).then(() => {
                this.router.navigate(['/interview']);
              });
            }
          }
      );

    }
  }
}
