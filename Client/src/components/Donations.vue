<template>
	<div class="content">

	</div>
</template>

<script>
export default {
	name: 'Donations',
	created () {
		this.$store.dispatch("Searchable", true);
	},
	methods: { }
}
</script>

<style scoped lang="scss">

</style>
