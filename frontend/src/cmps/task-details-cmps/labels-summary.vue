<template>
	<section class="labels-summary" @click.stop="">
		<h3 class="sum-h">LABELS</h3>
		<main>
			<div
				class="label-color"
				v-for="(label, idx) in labels"
				v-if="
					taskLabelsIds &&
						taskLabelsIds.some(labelId => labelId === label.id)
				"
				:key="idx"
				:style="'background-color:' + label.color"
			>
				{{ label.title }}
			</div>
			<button @click="toggleLabelsMenu" class="add-label">
				<img :src="require('@/assets/add.svg')" alt="" />
			</button>

			<basic-menu
				class="menu"
				@closeMenu="menuIsOpen = false"
				v-if="menuIsOpen"
				:title="'Labels'"
			>
				<labels-menu @closeMenu="menuIsOpen = false" />
			</basic-menu>
		</main>
	</section>
</template>

<script>
import basicMenu from "../basic-menu.vue"
import labelsMenu from "../menus-cmps/labels-menu.vue"

export default {
	data() {
		return {
			menuIsOpen: false,
		}
	},
	computed: {
		labels() {
			return this.$store.getters.labels
		},
		taskLabelsIds() {
			return this.$store.getters.currTask.labelIds
		},
	},
	methods: {
		toggleLabelsMenu() {
			this.menuIsOpen = !this.menuIsOpen
		},
	},
	components: {
		basicMenu,
		labelsMenu,
	},
};
</script>