import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8002/';
  
  constructor(private http: HttpClient) { }

  // getData(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/data`);
  // }

  postData(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(`${this.apiUrl}upload-pdf/`, formData)
    // .pipe(
    //   catchError(this.handleError)
    // );
  }
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}get-pdf-data/`)}
  
  getQuestions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}questions/`)}

  getFiles():Observable<any> {
    return this.http.get<any>(`${this.apiUrl}voice/`)}

    // getQuestions(): Observable<Blob> {
    //   const url = `${this.apiUrl}questions/`;
    //   const headers = new HttpHeaders().set('Accept', 'audio/mpeg'); // Set the Accept header to specify the expected response type
      
    //   // Make a GET request for the audio file
    //   return this.http.get(url, { headers: headers, responseType: 'blob' });}

  // private handleError(error: HttpErrorResponse) {
  //   // Handle the error appropriately here
  //   return throwError('An error occurred while uploading the file.');
  // }
}
