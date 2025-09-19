 import { Routes } from '@angular/router';
import { FeedbackNotesComponent } from './feedback-notes/feedback-notes.component';
import { SettingsComponent } from '../manager/settings.component';
import { SkillAnalyticsComponent } from './skill-analytics/skill-analytics.component';



 export const branchManagerRoutes: Routes = [
    { path: '', component:FeedbackNotesComponent },
   { path: 'Skillanalytics', component: SkillAnalyticsComponent }, //
   { path:'settings', component:SettingsComponent},
   


 ];
   