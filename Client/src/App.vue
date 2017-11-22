<template>
	<div style="height: 100%;">
		<div data-mode="login" v-if="!authorization">
			<div class="form">
				<button v-on:click="login">Login with Twitch</button>
			</div>
		</div>
		<div data-mode="dashboard" v-if="authorization && user" v-on:click="toogleAccount">
			<div class="header">
				<div class="banner">
					<router-link tag="li" to="/" class="logo no-select">
						<img src="./assets/img/logo.png" alt="">
						<h1>Modest Tools</h1>
					</router-link>
					<div class="search" v-bind:class="{ searchable }">
						<i class="fa fa-search"></i>
						<input type="text" name="text" placeholder="Search for a user" />
					</div>
					<div class="right no-select">
						<div class="account-container">
							<img :src="user.profile_image_url">
							<p v-text="user.display_name"></p>
							<i class="fa fa-caret-down"></i>
						</div>

						<ul class="account">
							<a href="https://www.twitch.tv/dashboard" target="_blank"><li><i class="fa fa-twitch"></i> Twitch Dashboard</li></a>
							<li class="divider"></li>
							<a href="https://github.com/TimothyCole/Modest-Tools" target="_blank"><li><i class="fa fa-github"></i> Source Code</li></a>
							<a href="https://github.com/TimothyCole/Modest-Tools/projects/1" target="_blank"><li><i class="fa fa-tasks"></i> Project Task List</li></a>
							<a href="https://github.com/TimothyCole/Modest-Tools/issues" target="_blank"><li><i class="fa fa-bug"></i> Bug Report</li></a>
							<li class="divider"></li>
							<li v-on:click="logout"><i class="fa fa-sign-out"></i> Logout</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="body">
				<div class="menu">
					<ul>
						<router-link tag="li" to="/"><i class="fa fa-bar-chart"></i> Dashboard</router-link>
						<router-link tag="li" to="/subscribers"><i class="fa fa-star"></i> Subscribers</router-link>
						<router-link tag="li" to="/donations"><i class="fa fa-usd"></i> Donations</router-link>
						<li class="divider"></li>
						<router-link tag="li" to="/alerts"><i class="fa fa-bell-o"></i> Alerts</router-link>
						<router-link tag="li" to="/events"><i class="fa fa-newspaper-o"></i> Events</router-link>
						<router-link tag="li" to="/chat"><i class="fa fa-feed"></i> Chat Overlay</router-link>
						<router-link tag="li" to="/goals"><i class="fa fa-calendar-check-o"></i> Goals</router-link>
						<li class="divider"></li>
						<router-link tag="li" to="/bot/logs"><i class="fa fa-align-justify"></i> Logs</router-link>
						<router-link tag="li" to="/bot/commands"><i class="fa fa-commenting"></i> Commands</router-link>
						<router-link tag="li" to="/bot/timers"><i class="fa fa-clock-o"></i> Timers</router-link>
						<router-link tag="li" to="/bot/regulars"><i class="fa fa-child"></i> Regulars</router-link>
						<router-link tag="li" to="/bot/song-requests"><i class="fa fa-music"></i> Song Requests</router-link>
						<router-link tag="li" to="/bot/spam"><i class="fa fa-bolt"></i> Spam Protection</router-link>
						<router-link tag="li" to="/bot/giveaways"><i class="fa fa-gift"></i> Giveaways</router-link>
					</ul>
				</div>
				<router-view></router-view>
			</div>
		</div>
		<div data-mode="loading" v-if="user === null && authorization">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
				<path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
					<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
				</path>
			</svg>
		</div>
	</div>
</template>

<script>
export default {
	name: 'App',
	data () {
		return {
			api: {
				login: `${window.Settings.API}${window.Settings.Endpoints.auth.twitch}`,
				logout: `${window.Settings.API}${window.Settings.Endpoints.auth.invalidate}`,
				me: `${window.Settings.API}${window.Settings.Endpoints.me}`,
			}
		}
	},
	computed: {
		authorization () { return this.$store.state.Authorization },
		searchable () { return this.$store.state.Searchable },
		user () { return this.$store.state.User }
	},
	created () { this.authCheck(); },
	methods: {
		authCheck: function () {
			// Sourced from: https://stackoverflow.com/a/3855394
			var qs = (function(a) {
				if (a == "") return {};
				var b = {};
				for (var i = 0; i < a.length; ++i)
				{
					var p = a[i].split('=', 2);
					if (p.length == 1) {
						b[p[0]] = "";
					} else {
						b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
					}
				}
				return b;
			})(window.location.search.substr(1).split('&'));

			if (qs.authorization) {
				window.helpers.cookies.set("Authorization", qs.authorization, 1);
				this.$store.dispatch('Authorization', qs.authorization);
				window.close();
			}

			this.me();
		},
		me: function () {
			if (this.$store.state.User !== null && !this.$store.state.Authorization) return;
			fetch(this.api.me, {
				headers: new Headers({
					Authorization: this.$store.state.Authorization
				})
			}).then((j) => {
				return j.json();
			}).then((data) => {
				this.$store.dispatch('User', data.data);
			}).catch((err) => {
				console.error(err)
			});
		},
		login: function () {
			var auth = window.open(this.api.login, "", "width=600,height=700");
			var openerCheck = setInterval(() => {
				if(auth.closed) {
					clearInterval(openerCheck);
					this.$store.dispatch('Authorization', window.helpers.cookies.get("Authorization"));
					this.me();
				}
			}, 500);
		},
		toogleAccount: function (e) {
			var target = (e.target.classList.contains('account-container') ? e.target : e.target.parentNode);

			if (target.classList.contains('account-container')) {
				target.classList[(target.classList.contains("open") ? "remove" : "add")]("open")
			} else if (!target.classList.contains('account') && !target.parentNode.classList.contains('account')) {
				var container = document.querySelector(".account-container.open");
				if (container) container.classList.remove("open");
			}
		},
		logout: function () {
			fetch(this.api.logout, {
				method: "DELETE",
				headers: new Headers({
					Authorization: this.$store.state.Authorization
				})
			}).then(() => {
				window.helpers.cookies.set("Authorization", null, -1);
				this.$store.dispatch('Authorization', null);
			}).catch((err) => {
				console.error(err)
			});
		}
	}
}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');
	@import "./assets/globals.scss";

	.float-left { float: left; }
	.float-right { float: right; }
	.hide { display: none !important; }

	// Sourced from: https://stackoverflow.com/a/4407335
	* .no-select {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	* {
		padding: 0;
		margin: 0;
	}

	html, body {
		background: $backgroundColor;
		font-family: 'Roboto', sans-serif;
		color: #eee;
		height: 100%;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	i {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	div[data-mode='login'] {
		width: 400px;
		padding: 8% 0 0;
		margin: auto;
		text-align: center;

		div.form {
			border-radius: 1.5px;
			background: #ffffff;
			max-width: 450px;
			margin: 0 auto;
			padding: 25px;
			text-align: center;
			box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.25);

			button {
				border-radius: 1.5px;
				font-family: "Roboto", sans-serif;
				outline: 0;
				background: #6441A4;
				border: 0;
				border-bottom: 4px solid #56378e;
				width: 100%;
				padding: 15px;
				padding-bottom: 12px;
				color: #ffffff;
				transition: all 0.3 ease;
				-webkit-transition: all 0.3 ease;
				cursor: pointer;

				&:hover {
					background: #56378e;
				}
			}
		}
	}

	div[data-mode='dashboard'] {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		height: 100%;

		.header {
			flex: 0 0 auto;

			.banner {
				background-color: $primaryColor;
				display: block;
				height: 50px;
				line-height: 45px;
				display: -webkit-box;
				display: -moz-box;
				display: -ms-flexbox;
				display: -webkit-flex;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				flex: 1 100%;
				z-index: 9001;

				.logo {
					order: 1;
					cursor: pointer;
					padding: 0 10px;

					img {
						padding-right: 10px;
						height: 32px;
					}

					h1 {
						font-weight: 300;
						font-size: 1.5em;
						color: #fff;
					}
				}

				.search {
					flex: 3 0;
					order: 2;
					margin: auto 175px auto 25px;
					visibility: hidden;

					&.searchable {
						visibility: visible;
					}

					i.fa {
						position: absolute;
						line-height: normal;
						margin-top: 5px;
						padding: 9px 15px;
						color: lighten($secondaryColor, 25%);

						&:nth-child(1):after {
							height: 24px;
							position: absolute;
							margin-left: 15px;
							margin-top: -3px;
							width: 1px;
							background: lighten($primaryColor, 10%);
							content: '';
						}

						&.focused {
							color: rgba(68, 68, 68, 0.5);

							&:nth-child(1):after {
								background: rgba(68, 68, 68, 0.25);
							}
						}

						&#search {
							display: inline;
						}
					}

					input[type="text"] {
						width: 100%;
						padding-left: 60px;
						border-radius: 3px;
						height: 34px;
						margin-top: -2px;
						background-color: $secondaryColor;
						border: 1px solid lighten($primaryColor, 10%);
						font-size: 0.85em;
						color: #fff;
						outline: none;
						transition: background 250ms ease;
						transition: color 250ms ease;
						max-width: 500px;

						&:focus {
							background: #fff;
							color: #434343;
							box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

							&::-webkit-input-placeholder {
								color: rgba(68, 68, 68, 0.5);
							}
						}

						&::-webkit-input-placeholder {
							color: transparent;
						}
					}
				}

				div.right {
					order: 3;
					position: relative;
					margin-left: -50px;
					width: 240px;
					max-width: 240px;
					height: 100%;

					div.account-container {
						position: relative;
						background: $primaryColor;
						width: 100%;
						height: 100%;
						z-index: 9001;
						cursor: pointer;

						img {
							height: 34px;
							margin: 4px 5px 3px 5px;
							border-radius: 5px;
							border: 2px solid $secondaryColor;
						}

						i.fa-caret-down {
							float: right;
							vertical-align: middle;
							height: 24px;
							line-height: 24px;
							margin: 12px;
							transition: 200ms linear all;
							padding-right: 5px;
							
							&:after { clear: right; }
						}

						&.open i.fa-caret-down {
							padding-left: 5px;
							transform: rotate(180deg);
						}

						&.open + ul.account {
							top: 50px;
						}
					}

					ul.account {
						position: absolute;
						font-weight: 100;
						width: 240px;
						transition: top 0.15s linear;
						left: 0;
						color: white;
						white-space: nowrap;
						z-index: 9000;
						margin: 0;
						padding: 0;
						line-height: normal;
						border-bottom: 2px solid $primaryColor;
						cursor: pointer;
						top: -250px;

						a {
							display: block;
							width: 100%;
							text-decoration: none;
						}

						li {
							color: #fff;
							text-decoration: none;
							line-height: 100%;
							width: 100%;
							padding: 10px 0;
							padding-right: 0;
							display: block;
							background: $secondaryColor;
							font-size: .9em;

							&.divider {
								padding: 5px 0;

								&:after {
									height: 1px;
									position: absolute;
									width: 200px;
									margin: 0 20px;
									background: $primaryColor;
									content: '';
								}
							}

							&:not(.divider):hover {
								background: $primaryColor;
							}

							i {
								padding: 0 10px 0 15px;
								margin-top: -2px;
							}
						}
					}
				}

				* {
					display: inline-block;
					vertical-align: middle;
					padding: 0;
					margin: 0;
				}
			}
		}

		.body {
			display: flex;
			flex-direction: row;
			max-height: calc(100vh - 50px);
			flex: 1 1 auto;
			position: relative;

			.menu {
				min-width: 240px;
				border-right: 1px solid $touchColor;
				overflow: hidden;

				&:hover { overflow-y: auto; }
				
				ul {
					font-size: 0.9em;

					li {
						vertical-align: middle;
						padding: 10px 13px;
						border-left: 2px solid transparent;
						border-right: 2px solid transparent;

						&.divider {
							padding: 0;
							border: none;
							position: relative;

							&:after {
								height: 1px;
								position: absolute;
								width: 175px;
								margin: 8px 30px;
								background: $touchColor;
								content: '';
							}
						}

						&:not(.router-link-exact-active):not(.divider):hover {
							border-left: 2px solid $primaryColor;
							background: $touchColor;
						}

						&.router-link-exact-active {
							border-right: 2px solid $primaryColor;
							background: $touchColor;
						}

						i {
							vertical-align: middle;
							width: 15px;
							text-align: center;
							margin-right: 10px;
						}
					}
				}
			}

			.content {
				width: 100%;
				overflow-y: auto;
			}
		}

		.top-menu {
			background-color: $secondaryColor;
			display: block;
			border-bottom: 2px solid lighten($secondaryColor, 10%);

			div.container {
				height: 45px;
				line-height: 45px;
				display: -webkit-box;
				display: -moz-box;
				display: -ms-flexbox;
				display: -webkit-flex;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				flex: 1 100%;
				height: 45px;
				line-height: 45px;

				ul {
					flex: 3 0px;
					order: 1;
					list-style: none;
					padding: 0;
					margin: 0;

					a {
						color: #b3c5e4;
						text-decoration: none;
						line-height: 100%;

						li {
							display: inline-block;
							height: 45px;
							line-height: 45px;
							padding: 0 10px;
						}

						&:not(:first-child) {
							margin-left: 20px;
						}

						&.active {
							color: #fff;
						}

						&:not(.active):hover {
							color: #fff;
						}

						&:first-child {
							margin-left: -10px;
						}
					}
				}

				i.icon {
					order: 1;
					align-items: flex-end;
					line-height: 45px;
					color: #fff;
				}
			}
		}
	}
	div[data-mode="loading"] {
		width: 100%;

		svg {
			margin: 50px auto;
			width: 100%;

			path {
				fill: $primaryColor;
			}
		}
	}

	// Columns
	.container {
		width: 1275px;
		margin: 0 auto;
	}
	.row {
		width: 100%;

		[class*="col-"] {
			float: left;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			padding: .5em;
		}

		&::after {
			content: "";
			clear: both;
			display: block;
		}

		.col-1 {width: 8.33%;}
		.col-2 {width: 16.66%;}
		.col-3 {width: 25%;}
		.col-4 {width: 33.33%;}
		.col-5 {width: 41.66%;}
		.col-6 {width: 50%;}
		.col-7 {width: 58.33%;}
		.col-8 {width: 66.66%;}
		.col-9 {width: 75%;}
		.col-10 {width: 83.33%;}
		.col-11 {width: 91.66%;}
		.col-12 {width: 100%;}

		@media screen and (max-width: 1000px) {
			.col-1 {width: 100%;}
			.col-2 {width: 100%;}
			.col-3 {width: 100%;}
			.col-4 {width: 100%;}
			.col-5 {width: 100%;}
			.col-6 {width: 100%;}
			.col-7 {width: 100%;}
			.col-8 {width: 100%;}
			.col-9 {width: 100%;}
			.col-10 {width: 100%;}
			.col-11 {width: 100%;}
			.col-12 {width: 100%;}
		}
	}

	// Drop Shadows
	.dp-1 {
		box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	}

	.dp-2 {
		box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
	}

	.dp-3 {
		box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
	}

	.dp-4 {
		box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
	}

	.dp-5 {
		box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
	}

	// Scrollbars
	::-webkit-scrollbar {
		width: 5px;
		height: 5px;
	}
	::-webkit-scrollbar-button {
		width: 0px;
		height: 0px;
	}
	::-webkit-scrollbar-thumb {
		background: $secondaryColor;
		border-radius: 2px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: $primaryColor;
	}
	::-webkit-scrollbar-thumb:active {
		background: $primaryColor;
	}
	::-webkit-scrollbar-track {
		background: $touchColor;
		border: 0px none #ffffff;
		border-radius: 2px;
	}
</style>
