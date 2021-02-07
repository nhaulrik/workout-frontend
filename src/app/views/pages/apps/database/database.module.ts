// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
// Fake API Angular-in-memory
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
// Translate Module
import {TranslateModule} from '@ngx-translate/core';
// NGRX
// UI
import {PartialsModule} from '../../../partials/partials.module';
// Core
import {FakeApiService} from '../../../../core/_base/layout';

// Core => Services
import {MuscleService} from '../../../../core/database/_services/muscle.service';
import {SessionService} from '../../../../core/database/_services/session.service';
import {WorkoutSetService} from '../../../../core/database/_services/workoutSet.service';

// Core => Utils
import {HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService} from '../../../../core/_base/crud';
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent
} from '../../../partials/content/crud';
// Components
import {DatabaseComponent} from './database.component';
// Muscles
import {MuscleComponent} from './muscle/muscle.component';
import {
	MAT_DATE_LOCALE,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatAutocompleteModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule
} from '@angular/material';
import {NgxPermissionsModule} from 'ngx-permissions';
import {environment} from '../../../../../environments/environment';
import {NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {SessionComponent} from './session/session.component';
import {SessionEditComponent} from './session/session-edit/session-edit.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ExerciseComponent} from './exercise/exercise.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {BodyComponent} from '../../../partials/content/database/body/body.component';
import {DialogAdvancedMeasurementComponent} from '../../../partials/content/database/body/user-body/dialog-advanced-measurement/dialog-advanced-measurement.component';
import { ProgrammeComponent } from './programme/programme.component';
import { DialogCreateProgrammeComponent } from './programme/dialog/dialog-create-programme/dialog-create-programme.component';

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: DatabaseComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'database' },
		children: [
			{
				path: '',
				redirectTo: 'muscles',
				pathMatch: 'full'
			},
			{
				path: 'exercises',
				component: ExerciseComponent
			}, {
				path: 'muscles',
				component: MuscleComponent
			},
			{
				path: 'sessions',
				component: SessionComponent
			},
			{
				path: 'sessions/add',
				component: SessionEditComponent
			},
			{
				path: 'sessions/edit',
				component: SessionEditComponent
			},
			{
				path: 'body',
				component: BodyComponent
			},
			{
				path: 'programme',
				component: ProgrammeComponent
			},
		]
	}
];

@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		DragDropModule,
		HttpClientModule,
		PartialsModule,
		NgxPermissionsModule.forChild(),
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		NgbProgressbarModule,
		MatSlideToggleModule,
		MatButtonToggleModule,
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
			passThruUnknownUrl: true,
			dataEncapsulation: false
		}) : [],
	],
	providers: [
		{provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		TypesUtilsService,
		LayoutUtilsService,
		HttpUtilsService,
		TypesUtilsService,
		MuscleService,
		SessionService,
		WorkoutSetService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		DialogAdvancedMeasurementComponent,
	],
	declarations: [
		DatabaseComponent,
		MuscleComponent,
		SessionComponent,
		SessionEditComponent,
		ExerciseComponent,
		DialogAdvancedMeasurementComponent,
		ProgrammeComponent,
		DialogCreateProgrammeComponent,
	]
})
export class DatabaseModule {
}
