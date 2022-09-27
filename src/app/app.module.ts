import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMaterialModule } from 'src/app/_modules/angular-material.module';
import { FirebaseModule } from 'src/app/_modules/firebase-develop.module';
import { environment } from 'src/environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';
import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { CrewEditorComponent } from './_elements/dialogs/crew-editor/crew-editor.component';
import { MemberInputComponent } from './_elements/dialogs/crew-editor/member-input/member-input.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';
import { StatisticEditorComponent } from './_elements/dialogs/statistic-editor/statistic-editor.component';
import { ShiftCardComponent } from './_elements/shift-table/shift-card/shift-card.component';
import { ShiftTableComponent } from './_elements/shift-table/shift-table.component';
import { UserDataComponent } from './users/user/user-data/user-data.component';
import { UserScheduleComponent } from './users/user/user-schedule/user-schedule.component';
import { HoursTableComponent } from './users/user/user-schedule/hours-table/hours-table.component';

// AoT requires an exported function for factories of translate module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    LoginDialogComponent,
    PersonalShiftComponent,
    ShiftTableComponent,
    ShiftCardComponent,
    StatisticEditorComponent,
    CrewEditorComponent,
    MemberInputComponent,
    ShiftsComponent,
    UsersComponent,
    UserComponent,
    ConfirmDialogComponent,
    UserDataComponent,
    UserScheduleComponent,
    HoursTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FirebaseModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['YYYY-MM-DD'],
        },
        display: {
          dateInput: 'YYYY-MM-DD',
        },
      },
    },
    DatePipe,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
