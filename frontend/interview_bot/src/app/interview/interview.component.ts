import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { FileService } from '../file.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogModule, MatCheckboxModule, FormsModule],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
  animations: [
    trigger('buttonState', [
      state('granted', style({
        transform: 'scale(1.2)', /* Example animation */
        backgroundColor: '#00FF00' /* Example color change */
      })),
      transition('* => granted', [
        animate('0.3s')
      ]),
      transition('pressed => normal', [
        animate('0.1s', style({ transform: 'scale(0.95)' })),
        animate('0.1s', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})

export class InterviewComponent implements OnInit, AfterViewInit {
  private subscription: Subscription | undefined;
  constructor(private apiService: ApiService, private fileService: FileService, private router: Router, private dialog: MatDialog) {}

  @ViewChild('selfVideo') selfVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoElement1') videoElement1!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoElement2') videoElement2!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoElement3') videoElement3!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoElement4') videoElement4!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoElement5') videoElement5!: ElementRef<HTMLVideoElement>;

  audioFiles: any;
  showStartBox = true;
  cameraAllowed = false;
  audioAllowed = false;
  startValue=true;


  videos = [
    { src: '/assets/i2.mp4' },
    { src: '/assets/i5.mp4' },
    { src: '/assets/i3.mp4' },
    { src: '/assets/i4.mp4' },
    { src: '' },  // Placeholder for the live video
    { src: '/assets/i1.mp4' },
  ];


  ngAfterViewInit(): void {
    this.checkMediaPermissions();
  }

  checkMediaPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.cameraAllowed = true;
          this.audioAllowed = true;
          this.startValue = false;  // Hide the start box if permissions are granted
          const tracks = stream.getAudioTracks();
        if (tracks.length > 0) {
          tracks[0].enabled = false;
        }
          this.selfVideo.nativeElement.srcObject = stream;
          resolve();
        })
        .catch(err => {
          console.error('Error accessing media devices: ', err);
          this.startValue = true;  // Show the start box if there is an error

          // Check for individual permissions
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
              this.cameraAllowed = true;
              this.startValue = true;  // Hide the start box if video permission is granted
              resolve();
            })
            .catch(() => {
              this.cameraAllowed = false;
              this.startValue = true;  // Show the start box if there is an error
              reject();
            });

          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              this.audioAllowed = true;
              this.startValue = true;  // Hide the start box if audio permission is granted
              resolve();
            })
            .catch(() => {
              this.audioAllowed = false;
              this.startValue = true;  // Show the start box if there is an error
              reject();
            });
        });
    });
  }

  ngOnInit(): void {
    this.audioFiles = this.fileService.getAudios();
    console.log("____");
    console.log(this.audioFiles);
  }

  start(): void {
    this.checkMediaPermissions()
      .then(() => {
        this.showStartBox = this.startValue;
        if(this.showStartBox==false){
          this.interview();
        }
      })
      .catch(() => {
        this.showStartBox = this.startValue;
      });
  }
  interview(){
    
  }
  playVideo(videoNumber: number): void {
    this.checkMediaPermissions()
      .then(() => {
        switch (videoNumber) {
          case 1:
            this.videoElement1.nativeElement.play();
            break;
          case 2:
            this.videoElement2.nativeElement.play();
            break;
          case 3:
            this.videoElement3.nativeElement.play();
            break;
          case 4:
            this.videoElement4.nativeElement.play();
            break;
          case 5:
            this.selfVideo.nativeElement.play();
            break;
          case 6:
            this.videoElement5.nativeElement.play();
            break;
        }
      })
      .catch(() => {
        this.showStartBox = true;  // Show the start box if there is an error
      });
  }

  pauseVideo(videoNumber: number): void {
    switch (videoNumber) {
      case 1:
        this.videoElement1.nativeElement.pause();
        break;
      case 2:
        this.videoElement2.nativeElement.pause();
        break;
      case 3:
        this.videoElement3.nativeElement.pause();
        break;
      case 4:
        this.videoElement4.nativeElement.pause();
        break;
      case 5:
        this.selfVideo.nativeElement.pause();
        break;
      case 6:
        this.videoElement5.nativeElement.pause();
        break;
    }
  }
}
