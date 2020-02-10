import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FriendComponent } from './friend/friend.component';
import { ProfileComponent } from './profile/profile.component';
import { CheckListComponent } from './check-list/check-list.component';
import { AuthGuard } from './_guards/auth.guard';


export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'friend', component: FriendComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'check-list', component: CheckListComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
