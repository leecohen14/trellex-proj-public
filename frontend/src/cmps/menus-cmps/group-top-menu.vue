<template>
	<section class="group-top-menu" @click.stop="">
		<div>
			<h5 @click="addCard">Add card...</h5>
			<h5>Watch</h5>
			<h5>Sort by</h5>
			<h5 @click="removeGroup">Delete this list</h5>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		group: Object
	},
	methods: {
		addCard() {
			this.$emit('openAddCard')
		},
		removeGroup() {
			this.$store.dispatch({ type: 'removeGroup', groupId: this.group.id })
		}
	},

}
</script>