import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../../../../../core/database';
import {GraphQlResponse} from '../../../../../core/database/_models/graphQlResponse';
import {User} from '../../../../../core/database/_models/user';
import {UserBodyComponent} from './user-body/user-body.component';

@Component({
	selector: 'kt-body',
	templateUrl: './body.component.html',
	styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

	@ViewChild('viewBodyRef', {static: false, read: ViewContainerRef}) VCR: ViewContainerRef;

	child_unique_key: number = 0;
	userBodyReferences = Array<ComponentRef<UserBodyComponent>>();

	constructor(
		private userService: UserService,
		private CFR: ComponentFactoryResolver,
	) {
	}

	ngOnInit() {

		this.userService.getUsers().subscribe(response => {
			let users: User[] = (response as GraphQlResponse).data.users;
			users.forEach(user => this.createUserBodyComponent(user));
		})

	}

	private createUserBodyComponent(user: User) {
		let componentFactory = this.CFR.resolveComponentFactory(UserBodyComponent);

		let childComponentRef = this.VCR.createComponent(componentFactory);

		let childComponent = childComponentRef.instance;
		childComponent.unique_key = ++this.child_unique_key;
		childComponent.parentRef = this;

		childComponent.user = user;

		// add reference for newly created component
		this.userBodyReferences.push(childComponentRef);
	}
}
