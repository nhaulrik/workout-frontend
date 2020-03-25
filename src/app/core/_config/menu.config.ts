export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'New session',
					root: true,
					alignment: 'left',
					page: '/database/sessions/edit',
					translate: 'MENU.NEW_SESSION',
				},
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
				},
				{
					title: 'Applications',
					root: true,
					alignment: 'left',
					toggle: 'click',
					submenu: [
						{
							title: 'User Management',
							bullet: 'dot',
							icon: 'flaticon-user',
							submenu: [
								{
									title: 'Users',
									page: '/user-management/users'
								},
								{
									title: 'Roles',
									page: '/user-management/roles'
								}
							]
						},
					]
				},
			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{section: 'Workout'},
				{
					title: 'Sessions',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-digital-marketing',
					submenu: [
						{
							title: 'Show all',
							page: '/database/sessions'
						},
						{
							title: 'This week',
							page: '/ngbootstrap/accordion'
						},
						{
							title: 'All time',
							page: '/ngbootstrap/accordion'
						}
					]
				},
				{
					title: 'Programmes',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-browser-2',
					submenu: [
						{
							title: 'Stronglifts 5x5',
							bullet: 'dot'
						},
						{
							title: 'Max Muscle Plan',
							bullet: 'dot'
						},
					]
				},
				{section: 'Manage'},
				{
					title: 'Database',
					bullet: 'dot',
					icon: 'flaticon2-list-2',
					root: true,
					submenu: [
						{
							title: 'Muscles',
							page: '/database/muscles'
						},
					]
				},
				{
					title: 'Users',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-user-outline-symbol',
					page: '/user-management/roles'
				},
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
