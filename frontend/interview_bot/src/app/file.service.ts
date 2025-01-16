import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private sharedFile: File | null = null;
  private audioFiles:any|null=null;
  setFile(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.sharedFile = file;
      resolve();
    });
  }

  getFile(): File | null {
    return this.sharedFile;
  }

  setAudios(audios:any):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.audioFiles = audios;
      resolve();
    });
  }
  getAudios():any|null{
    return this.audioFiles;
  }
}
