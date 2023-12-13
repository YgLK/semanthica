import { Routes } from '@angular/router';
import {ItemsComponent} from "./items/items.component";
import {ItemDetailsComponent} from "./item-details/item-details.component";
import {CartComponent} from "./cart/cart.component";
import {CreateItemFormComponent} from "./create-item-form/create-item-form.component";
import {HomeComponent} from "./home/home.component";
import {OrderHistoryComponent} from "./order-history/order-history.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuardService} from "./shared/auth-guard.service";

export const appRoutes:Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'menu', component: ItemsComponent, canActivate: [AuthGuardService] },
  { path: 'item/:id', component: ItemDetailsComponent, canActivate: [AuthGuardService]},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService]},
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuardService] },
  { path: 'create-item', component: CreateItemFormComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: '**', redirectTo: '/menu', pathMatch: 'full' }
];
