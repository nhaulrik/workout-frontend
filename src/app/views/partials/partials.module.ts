// Angular
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule,
} from '@angular/material';
// NgBootstrap
import {NgbDropdownModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
// Core module
import {CoreModule} from '../../core/core.module';
// CRUD Partials
import {
	ActionNotificationComponent,
	AlertComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
	ContextMenu2Component,
	ContextMenuComponent,
	LanguageSelectorComponent,
	NotificationComponent,
	QuickActionComponent,
	QuickPanelComponent,
	ScrollTopComponent,
	SearchDefaultComponent,
	SearchDropdownComponent,
	SearchResultComponent,
	SplashScreenComponent,
	StickyToolbarComponent,
	Subheader1Component,
	Subheader2Component,
	Subheader3Component,
	Subheader4Component,
	Subheader5Component,
	SubheaderSearchComponent,
} from './layout';
// General
import {NoticeComponent} from './content/general/notice/notice.component';
import {PortletModule} from './content/general/portlet/portlet.module';
// Errpr
import {ErrorComponent} from './content/general/error/error.component';
// Extra module
import {WidgetModule} from './content/widgets/widget.module';
// SVG inline
import {InlineSVGModule} from 'ng-inline-svg';
import {CartComponent} from './layout/topbar/cart/cart.component';
import {ExerciseSelectorComponent} from './content/database/exercise-selector/exercise-selector.component';
import {UserSelectorComponent} from './content/database/user-selector/user-selector.component';
import {SessionCreateComponent} from './content/database/session-details/session-create.component';
import {WorkoutExerciseComponent} from './content/database/workout-exercise/workout-exercise.component';
import {SessionCalendarComponent} from './content/database/session-calendar/session-calendar.component';
import {WorkoutSetComponent} from './content/database/workout-set/workout-set.component';
import {SessionComponent} from './content/database/session/session.component';
import {BodyComponent} from './content/database/body/body.component';
import {UserBodyComponent} from './content/database/body/user-body/user-body.component';
import {IntelligenceComponent} from './content/database/intelligence/intelligence.component';
import {DialogPhaseComponent} from './content/database/programme/dialog-phase/dialog-phase.component';
import {PhaseComponent} from './content/database/programme/phase/phase.component';
import { ProgrammeComponent } from './content/database/programme/programme/programme.component';
import { SplitComponent } from './content/database/programme/split/split.component';
import { DialogCreatePhaseComponent } from './content/database/programme/dialog-create-phase/dialog-create-phase.component';

@NgModule({
	declarations: [
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		CartComponent,

		ErrorComponent,

		ExerciseSelectorComponent,
		UserSelectorComponent,
		SessionCreateComponent,
		WorkoutExerciseComponent,
		WorkoutSetComponent,
		SessionCalendarComponent,
		SessionComponent,
		BodyComponent,
		UserBodyComponent,
		IntelligenceComponent,
		DialogPhaseComponent,
		PhaseComponent,
		ProgrammeComponent,
		SplitComponent,
		DialogCreatePhaseComponent,
	],
	exports: [
		ExerciseSelectorComponent,
		UserSelectorComponent,
		SessionCreateComponent,
		WorkoutExerciseComponent,
		SessionCalendarComponent,

		WidgetModule,
		PortletModule,

		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		CartComponent,

		ErrorComponent,
		IntelligenceComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
		WidgetModule,

		// angular material modules
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
		MatDialogModule,

		// ng-bootstrap modules
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
		MatSlideToggleModule,
		MatButtonToggleModule,
		MatDividerModule,
	],
	entryComponents: [
		WorkoutExerciseComponent,
		WorkoutSetComponent,
		SessionComponent,
		SessionCalendarComponent,
		SessionCreateComponent,
		UserBodyComponent,
		IntelligenceComponent,
		ProgrammeComponent,
		PhaseComponent,
		SplitComponent,
	]
})
export class PartialsModule {
}
