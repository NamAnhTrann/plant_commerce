import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserInformationComponent } from './user-information/user-information.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { PlantLibraryComponent } from './plant-library/plant-library.component';

export const routes: Routes = [
  {path: "", component:HomepageComponent},
  {path: "login", component: LoginPageComponent},
  {path: "list-product", component: ListProductComponent},
  {path: 'view-product/:id', component:ViewProductComponent},
  {path: 'error-page', component:ErrorPageComponent},
  {path: 'about-us', component:AboutUsComponent},
  {path: 'cart-page/:id', component:CartPageComponent},
  {path: 'contact-us', component:ContactUsComponent},
  {path: 'user-information/:id', component:UserInformationComponent},
  {path: 'order-summary', component:OrderSummaryComponent},
  {path: 'plant-library', component:PlantLibraryComponent},
  { path: '**', redirectTo: 'error-page' }
];
