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
import { FirebaseModule } from 'src/app/_modules/firebase.module';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { ForceRefreshDirective } from './_directives/force-refresh.directive';
import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { CongregationCreatorComponent } from './_elements/dialogs/congregation-creator/congregation-creator.component';
import { CongregationEditorComponent } from './_elements/dialogs/congregation-editor/congregation-editor.component';
import { CrewEditorComponent } from './_elements/dialogs/crew-editor/crew-editor.component';
import { MemberInputComponent } from './_elements/dialogs/crew-editor/member-input/member-input.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';
import { ShiftHoursCreatorComponent } from './_elements/dialogs/shiftHour-creator/shiftHour-creator.component';
import { ShiftHoursEditorComponent } from './_elements/dialogs/shiftHour-editor/shiftHour-editor.component';
import { SiteCreatorComponent } from './_elements/dialogs/site-creator/site-creator.component';
import { SiteEditorComponent } from './_elements/dialogs/site-editor/site-editor.component';
import { StatisticEditorComponent } from './_elements/dialogs/statistic-editor/statistic-editor.component';
import { ShiftCardComponent } from './_elements/shift-table/shift-card/shift-card.component';
import { ShiftTableComponent } from './_elements/shift-table/shift-table.component';
import { YearMonthSelectComponent } from './_elements/year-month-select/year-month-select.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LineBindingDialogComponent } from './line-binding/line-binding-dialog/line-binding-dialog.component';
import { LineBindingComponent } from './line-binding/line-binding.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { OpeningShiftsComponent } from './opening-shifts/opening-shifts.component';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { CongregationsComponent } from './settings/congregations/congregations.component';
import { SettingsComponent } from './settings/settings.component';
import { ShfitHoursComponent } from './settings/shfitHours/shfitHours.component';
import { SiteComponent } from './settings/sites/sites.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { DayScheduleComponent } from './site-shifts/day-schedule/day-schedule.component';
import { SelectSiteComponent } from './site-shifts/select-site/select-site.component';
import { SiteShiftComponent } from './site-shifts/site-shift/site-shift.component';
import { SiteShiftsComponent } from './site-shifts/site-shifts.component';
import { UserDataComponent } from './users/user/user-data/user-data.component';
import { CalendarHeaderComponent } from './users/user/user-schedule/calendar-header/calendar-header.component';
import { HoursListComponent } from './users/user/user-schedule/hours-list/hours-list.component';
import { HoursTableComponent } from './users/user/user-schedule/hours-table/hours-table.component';
import { UserScheduleComponent } from './users/user/user-schedule/user-schedule.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';
import { UserTableComponent } from 'src/app/users/user-table.component';
import { UserFilterComponent } from 'src/app/users/user-filter/user-filter.component';
import { ShiftEditorComponent } from './shifts/shift-editor/shift-editor.component';
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
    CalendarHeaderComponent,
    ForceRefreshDirective,
    HoursListComponent,
    SettingsComponent,
    SiteComponent,
    ShfitHoursComponent,
    CongregationsComponent,
    SiteEditorComponent,
    SiteCreatorComponent,
    OpeningShiftsComponent,
    YearMonthSelectComponent,
    OpeningShiftsComponent,
    YearMonthSelectComponent,
    LoginComponent,
    LineBindingComponent,
    LineBindingDialogComponent,
    ShiftHoursCreatorComponent,
    ShiftHoursEditorComponent,
    CongregationCreatorComponent,
    CongregationEditorComponent,
    SiteShiftsComponent,
    SelectSiteComponent,
    DayScheduleComponent,
    SiteShiftComponent,
    UserTableComponent,
    UserFilterComponent,
    ShiftEditorComponent,
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
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
        },
      },
    },
    DatePipe,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
