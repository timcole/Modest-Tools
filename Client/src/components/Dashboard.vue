<template>
	<div class="content">
		<div class="test">
			<h1>Kappa</h1>
			<h1>Kappa</h1>
			<h1>Kappa</h1>
			<h2>Kappa</h2>
			<h2>Kappa</h2>
			<h2>Kappa</h2>
			<h3>Kappa</h3>
			<h3>Kappa</h3>
			<h3>Kappa</h3>
			<h4>Kappa</h4>
			<h4>Kappa</h4>
			<h4>Kappa</h4>
			<h5>Kappa</h5>
			<h5>Kappa</h5>
			<h5>Kappa</h5>
			<h6>Kappa</h6>
			<h6>Kappa</h6>
			<h6>Kappa</h6>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Dashboard',
	created () {
		this.$store.dispatch("Searchable", false);
	},
	methods: { }
}
</script>

<style scoped lang="scss">
	@import "./../assets/globals.scss";

	div.test {
		padding: 20px;
	}
</style>
