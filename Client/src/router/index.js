import Router from 'vue-router'
import Vue from 'vue'
import Dashboard from '@/components/Dashboard'
import Subs from '@/components/Subs'
import Donations from '@/components/Donations'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Dashboard',
			component: Dashboard
		},
		{
			path: '/subscribers',
			name: 'Subs',
			component: Subs
		},
		{
			path: '/donations',
			name: 'Donations',
			component: Donations
		},
		{
			path: '*',
			name: 'Error',
			component: Error
		}
	],
	mode: "history"
})
