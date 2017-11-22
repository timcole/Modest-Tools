<template>
	<div class="content error no-select">
		<div class="text">
			<h1>404</h1>
			<p>Page Not Found</p>
		</div>
		<div class="background">
			<div class="row"><div class="col-1" v-for="i in 12" v-bind:key="i"><img src="./../assets/img/kappa.png" width="100%" /></div></div>
			<div class="row"><div class="col-2" v-for="i in 6" v-bind:key="i"><img src="./../assets/img/kappa.png" width="100%" /></div></div>
			<div class="row"><div class="col-1" v-for="i in 12" v-bind:key="i"><img src="./../assets/img/kappa.png" width="100%" /></div></div>
			<div class="row"><div class="col-2" v-for="i in 6" v-bind:key="i"><img src="./../assets/img/kappa.png" width="100%" /></div></div>
			<div class="row"><div class="col-1" v-for="i in 12" v-bind:key="i"><img src="./../assets/img/kappa.png" width="100%" /></div></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Error',
	created () {
		this.$store.dispatch("Searchable", false);
	},
	methods: { }
}
</script>

<style scoped lang="scss">
	@import "./../assets/globals.scss";

	.error {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: $primaryColor;

		.text {
			position: absolute;
			z-index: 1;

			h1 {
				font-size: 15em;
				line-height: .95em;
				font-weight: 900;
			}

			p {
				font-size: 2em;
				font-weight: 100;
			}
		}

		.background {
			overflow: hidden;
			position: relative;
			z-index: 0;
			opacity: 0.5;

			&, * {
				-webkit-user-drag: none;
				-khtml-user-drag: none;
				-moz-user-drag: none;
				-o-user-drag: none;
			}

			[class*="col-"] {
				margin: -10px 0;
			}

			img {
				animation: spin 2s linear infinite;
			}

			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
		}
	}
</style>
