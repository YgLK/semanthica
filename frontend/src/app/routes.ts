import { Routes } from '@angular/router';
import {DishesComponent} from "./dishes/dishes.component";
import {DishDetailsComponent} from "./dish-details/dish-details.component";
import {CartComponent} from "./cart/cart.component";
import {CreateDishFormComponent} from "./create-dish-form/create-dish-form.component";
import {HomeComponent} from "./home/home.component";
import {OrderHistoryComponent} from "./order-history/order-history.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuardService} from "./shared/auth-guard.service";

export const appRoutes:Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'menu', component: DishesComponent, canActivate: [AuthGuardService] },
  { path: 'item/:id', component: DishDetailsComponent, canActivate: [AuthGuardService]},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService]},
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuardService] },
  { path: 'create-dish', component: CreateDishFormComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: '**', redirectTo: '/menu', pathMatch: 'full' }
];
