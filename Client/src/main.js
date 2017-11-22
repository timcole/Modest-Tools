import App from './App';
import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import Basics from './assets/js/basics'

Vue.config.productionTip = false;
Vue.use(Basics);
/* eslint-disable no-new */

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		Authorization: window.helpers.cookies.get("Authorization"),
		User: null,
		Searchable: false
	},
	mutations: {
		Authorization (state, auth) {
			state.Authorization = auth;
		},
		Searchable (state, option) {
			state.Searchable = option;
		},
		User (state, data) {
			state.User = data;
		}
	},
	actions: {
		Authorization (context, auth) {
			context.commit('Authorization', auth);
		},
		Searchable (context, option) {
			context.commit('Searchable', option);
		},
		User (context, data) {
			context.commit('User', data);
		}
	}
})

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
});