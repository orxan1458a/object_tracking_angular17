import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DeleteDialogBox } from './core/delete-dialog-box/delete-dialog-box.component';
import { SnackBarComponent } from './core/snack-bar/snack-bar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UpdateCarComponent } from './shared/windows/update-object/update-object.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatTimepickerModule } from 'mat-timepicker';
// import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZonesComponent } from './pages/zones/zones.component';
import { LiveComponent } from './pages/live/live.component';
import { FindPointComponent } from './shared/windows/find-point/find-point.component';
import { FindPlaceComponent } from './shared/windows/find-place/find-place.component';
import { MapComponent } from './pages/root/map/map.component';
import { MainComponent } from './pages/main/main.component';
import { HeaderComponent } from './pages/root/header/header.component';
import { NavComponent } from './pages/root/nav/nav.component';
import { MatBadgeModule } from '@angular/material/badge';
import { AddUserComponent } from './shared/windows/add-user/add-user.component';
import { NgxMaskModule } from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UpdateZoneComponent } from './shared/windows/update-zone/update-zone.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EventsComponent } from './pages/events/events.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateUserComponent } from './shared/windows/update-user/update-user.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './authentication/_auth/auth.interceptor';
import { UsersComponent } from './pages/users/users.component';
import { ExcelService } from './core/services/excel.service';
import { CompleteDialogBoxComponent } from './core/complete-dialog-box/complete-dialog-box.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LoadingComponent } from './core/loading/loading.component';
import { ResetPasswordComponent } from './shared/windows/reset-password/reset-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { ObjectsComponent } from './pages/objects/objects.component';
import { StompService } from './core/services/stomp.service';
import { ButtonComponent } from './shared/button/button.component';
import { NotificationComponent } from './shared/notification/notification.component';
import { InformationContainerComponent } from './pages/information-container/information-container.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { EventInfoContainerComponent } from './shared/windows/event-info-container/event-info-container.component';
import { PopupMenuComponent } from './pages/popup-menu/popup-menu.component';
import { SearchInputComponent } from './shared/search-input/search-input.component';
import { LanguagePopupComponent } from './shared/language-popup/language-popup.component';
import { NotificationBoxComponent } from './shared/notification-box/notification-box.component';
import { ProfilMenuBoxComponent } from './shared/profil-menu-box/profil-menu-box.component';
import { TrajectoryInfoContainerComponent } from './pages/trajectory-info-container/trajectory-info-container.component';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapsModule } from '@angular/google-maps'

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

@NgModule({
  declarations: [
    AppComponent,
    DeleteDialogBox,
    SnackBarComponent,
    UpdateCarComponent,
    TrajectoryComponent,
    ZonesComponent,
    LiveComponent,
    FindPointComponent,
    FindPlaceComponent,
    MapComponent,
    MainComponent,
    HeaderComponent,
    NavComponent,
    UpdateZoneComponent,
    EventsComponent,
    AddUserComponent,
    UpdateUserComponent,
    UsersComponent,
    CompleteDialogBoxComponent,
    LoadingComponent,
    ResetPasswordComponent,
    NotificationComponent,
    ObjectsComponent,
    ButtonComponent,
    InformationContainerComponent,
    EventInfoContainerComponent,
    PopupMenuComponent,
    SearchInputComponent,
    LanguagePopupComponent,
    NotificationBoxComponent,
    ProfilMenuBoxComponent,
    TrajectoryInfoContainerComponent,
  ],
  imports: [
    RouterModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    // MatTimepickerModule,
    MatStepperModule,
    MatSnackBarModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // NgxMatMomentModule,
    MatProgressSpinnerModule,
    DragDropModule,
    NgxMaskModule.forRoot(),
    MatSlideToggleModule,
    MatBadgeModule,
    MatDialogModule,
    CdkMenuModule,
    ClipboardModule,
    TranslateModule.forRoot({
      defaultLanguage: String(localStorage.getItem('language')),
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatMenuModule,
    MatTooltipModule,
    MatRippleModule,
    MatSliderModule,
    MatTabsModule,
    GoogleMapsModule,
    NgxMaterialTimepickerModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule


  ],
  exports: [TranslateModule],
  // entryComponents: [PopupMenuComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
    ExcelService,
    StompService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ]
})

export class AppModule {

}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

