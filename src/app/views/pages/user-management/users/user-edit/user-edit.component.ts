// Angular
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Observable, Subscription} from 'rxjs';
// NGRX
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../core/reducers';
// Layout
import {LayoutConfigService, SubheaderService} from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
//Domain services
import {UserService} from '../../../../../core/database';
import {User} from '../../../../../core/database/_models/user';

@Component({
	selector: 'kt-user-edit',
	templateUrl: './user-edit.component.html',
	providers: [UserService],
})
export class UserEditComponent implements OnInit, OnDestroy {
	// Public properties
	user: User;
	userId$: Observable<number>;
	oldUser: User;
	selectedTab = 0;
	loading$: Observable<boolean>;
	userForm: FormGroup;
	hasFormErrors = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private userFB: FormBuilder,
				private subheaderService: SubheaderService,
				private layoutUtilsService: LayoutUtilsService,
				private store: Store<AppState>,
				private layoutConfigService: LayoutConfigService,
				private userService: UserService
	) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// this.loading$ = this.store.pipe(select(selectUsersActionLoading));
		//
		// const routeSubscription =  this.activatedRoute.params.subscribe(params => {
		// 	const id = params.id;
		// 	if (id && id > 0) {
		// 		this.store.pipe(select(selectUserById(id))).subscribe(res => {
		// 			if (res) {
		// 				// this.user = res;
		// 				this.oldUser = Object.assign({}, this.user);
		// 				this.initUser();
		// 			}
		// 		});
		// 	} else {
		// 		this.user = new User();
		// 		this.user.clear();
		// 		this.oldUser = Object.assign({}, this.user);
		// 		this.initUser();
		// 	}
		// });
		// this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init user
	 */
	initUser() {
		this.createForm();
		if (!this.user.id) {
			this.subheaderService.setTitle('Create user');
			this.subheaderService.setBreadcrumbs([
				{ title: 'User Management', page: `user-management` },
				{ title: 'Users',  page: `user-management/users` },
				{ title: 'Create user', page: `user-management/users/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit user');
		this.subheaderService.setBreadcrumbs([
			{ title: 'User Management', page: `user-management` },
			{ title: 'Users',  page: `user-management/users` },
			{ title: 'Edit user', page: `user-management/users/edit`, queryParams: { id: this.user.id } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.userForm = this.userFB.group({
			lastname: [this.user.firstName, Validators.required],
			firstname: [this.user.lastName, Validators.required],
			birthday: [this.user.birthday, Validators.required],
			gender: [this.user.gender, Validators.required]
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshUser(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/user-management/users/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.user = Object.assign({}, this.oldUser);
		this.createForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
  this.userForm.markAsUntouched();
  this.userForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedUser = this.prepareUser();

		// if (editedUser.id > 0) {
		// 	this.updateUser(editedUser, withBack);
		// 	return;
		// }

		this.addUser(editedUser, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		_user.firstName = controls.firstname.value;
		_user.lastName = controls.lastname.value;
		_user.gender = controls.gender.value;
		_user.birthday = controls.birthday.value;
		return _user;
	}

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	addUser(_user: User, withBack: boolean = false) {
		this.userService.addUser(_user).subscribe(response => {
		});
		this.router.navigate(['../'], {relativeTo: this.activatedRoute});
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const

		// const updatedUser: Update<User> = {
		// 	id: _user.id,
		// 	changes: _user
		// };
		// this.store.dispatch(new UserUpdated( { partialUser: updatedUser, user: _user }));
		// const message = `User successfully has been saved.`;
		// this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		// if (withBack) {
		// 	this.goBackWithId();
		// } else {
		// 	this.refreshUser(false);
		// }
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create user';
		if (!this.user || !this.user.id) {
			return result;
		}

		result = `Edit user - ${this.user.firstName} ${this.user.lastName} `;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	genders: String[] = ['Male', 'Female']

}