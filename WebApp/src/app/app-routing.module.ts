import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard} from './auth-guard.service'
import { LayoutModule } from './layout/layout.module'

const routes: Routes = [
  {path: 'layout', loadChildren: () => LayoutModule, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signUp', component: LoginComponent},
  {path: 'verification', component:LoginComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
