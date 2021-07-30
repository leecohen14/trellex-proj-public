<template>
	<div
		v-if="label"
		class="label-preview"
		@click.stop="toggleLabels"
		:class="isOpenClass"
		:style="'background-color:' + label.color"
	>
		<transition
			enter-active-class="animate__animated animate__fadeInUpBig animate__faster"
			leave-active-class="animate__animated animate__fadeOutUpBig animate__faster"
		>
			<span class="label-title" v-if="isLabelsOpen === 1">{{
				label.title
			}}</span>
		</transition>
	</div>
</template>
<script>

export default {
	props: {
		label: Object,
		isLabelsOpen: Number,
	},
	data() {
		return {
			isToggled: false,
		}
	},
	methods: {
		toggleLabels() {
			this.$emit("toggleLabels")
		},
	},
	computed: {
		isOpenClass() {
			return {
				open: this.isLabelsOpen === 1,
				opening: this.isLabelsOpen === 2,
				close: this.isLabelsOpen === -1,
				closing: this.isLabelsOpen === 0,
			}
		},
	},
};
</script>