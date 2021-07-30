<template>
	<div class="card-list-container">
		<Card v-for="1 in 4" />
	</div>
</template>
<script>
import Card from "./Card.vue"
export default {
	name: "CardList",
	components: {
		Card
	}
};
</script>
<style scoped>
.card-list-container {
	display: flex;
	flex-direction: column;
	width: 200px;
	border: 1px solid #dcebf4;
	border-radius: 6px;
	padding: 1rem 1rem 0 1rem;
	margin-top: 5rem;
}
</style>