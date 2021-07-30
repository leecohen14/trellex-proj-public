<template>
	<main @click="openMenu(22)" class="side-menu-background">
		<button  class="back-btn" @click="openMenu(null)">
			<img :src="require('@/assets/back-arrow.svg')" alt="" />
		</button>
		<div class="photos-container">
			<div class="photos">
				<img :src="require('@/assets/side-menu/bgs.jpg')" alt="" />
			</div>
			<div>Photos</div>
		</div>

		<div @click="openMenu(12)" class="colors-container">
			<div class="colors">
				<img :src="require('@/assets/side-menu/colors.jpg')" alt="" />
			</div>
			<div>Colors</div>
		</div>
	</main>
</template>

<script>
export default {
	methods: {
		openMenu(idx) {
			this.$emit('openMenu', idx)
		},


	}
}
</script>

<style>
</style>