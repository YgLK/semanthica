import { Routes } from '@angular/router';
import {DishesComponent} from "./dishes/dishes.component";
import {DishDetailsComponent} from "./dish-details/dish-details.component";
import {CartComponent} from "./cart/cart.component";
import {CreateDishFormComponent} from "./create-dish-form/create-dish-form.component";
import {HomeComponent} from "./home/home.component";
import {OrderHistoryComponent} from "./order-history/order-history.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

export const appRoutes:Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: DishesComponent },
  { path: 'dish/:id', component: DishDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'create-dish', component: CreateDishFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: '**', redirectTo: '/menu', pathMatch: 'full' }
];
