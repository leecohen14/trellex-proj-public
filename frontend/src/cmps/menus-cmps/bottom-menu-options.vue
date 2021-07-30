<template>
	<main class="bottom-menu-options">
		<template v-if="open === null">
			<h5 @mousedown.prevent="openMenu(0)">Members...</h5>
			<h5 @mousedown.prevent="openMenu(1)">Labels...</h5>
			<!-- <h5 @mousedown.prevent="openMenu(2)">Position...</h5> -->
		</template>

		<template v-else>
			<members-menu v-if="open === 0" />
			<labels-menu v-if="open === 1" />
			<!-- <posiiton-menu v-if="open === 2" /> -->
		</template>
	</main>
</template>

<script>
import membersMenu from "./members-menu.vue"
import labelsMenu from "./labels-menu.vue"
// import positionMenu from "../menus-cmps	/position-menu.vue"; // Not ready yet

export default {
	data() {
		return {
			open: null,
		}
	},
	methods: {
		closeMenu() {
			this.$emit("closeMenu")
		},
	},
	methods: {
		openMenu(idx) {
			this.open = idx
			console.log("Opening Members Menu..." + this.open)
		},
	},
	components: {
		membersMenu,
		labelsMenu,
	},
};
</script>
