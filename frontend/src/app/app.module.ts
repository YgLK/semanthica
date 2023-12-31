import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import {MatIconModule} from "@angular/material/icon";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import { CartComponent } from './cart/cart.component';
import {MatTabsModule} from "@angular/material/tabs";
import { MenuFilterComponent } from './menu-filter/menu-filter.component';
import { CreateItemFormComponent } from './create-item-form/create-item-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import { FilterPipe } from './shared/filter.pipe';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemDetailsComponent } from './item-details/item-details.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgImageSliderModule } from 'ng-image-slider';


import {appRoutes} from "./routes";
import { ReviewsComponent } from './reviews/reviews.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { TokenInterceptorService } from "./shared/token-interceptor.service";
import {AuthGuardService} from "./shared/auth-guard.service";
import {ItemService} from "./shared/item.service";

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    CartComponent,
    MenuFilterComponent,
    CreateItemFormComponent,
    FilterPipe,
    ItemDetailsComponent,
    ReviewsComponent,
    OrderHistoryComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    NgxPaginationModule,
    NgImageSliderModule,
    HttpClientModule
  ],
  providers: [ItemService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
