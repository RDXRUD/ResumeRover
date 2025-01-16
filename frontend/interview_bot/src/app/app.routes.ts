import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProcessingComponent } from './processing/processing.component';
import { InterviewComponent } from './interview/interview.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "home",
        component: HomeComponent,
    },
    {
        path: "processing",
        component: ProcessingComponent,
    },
    {
        path: "interview",
        component: InterviewComponent,
    },
];
