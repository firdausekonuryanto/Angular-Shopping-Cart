import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProductComponent } from './product/product.component';
import { FormsModule } from '@angular/forms';
import { TemplateComponent } from './template/template.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
