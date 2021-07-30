<template>
	<div class="card-container">
		<div class="card-body">
			<p>
				{{ title }}
			</p>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
	},
	name: "Card"
};
</script>
<style scoped>
.card-container {
	background: #fff;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
	width: 100%;
	height: 50px;
	cursor: pointer;
	margin-bottom: 2rem;
}
p {
	font-size: 0.8rem;
}
</style>