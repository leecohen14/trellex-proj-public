<template>
	<div class="black-screen" v-if="isBlack" @click.stop="closeBlack">
		<slot></slot>
	</div>
</template>


<script>
import { eventBusService } from '../services/event-bus.service'
export default {
	computed: {
		isBlack() {
			return this.$store.getters.isBlack
		}
	},
	methods: {
		closeBlack() {
			const { boardId } = this.$route.params
			eventBusService.$emit('closeHeaderMenus')
			this.$store.commit({ type: 'closeBlack' })
			this.$store.commit({ type: 'closeQuickEdit' })
			if (this.$route.name.includes('board')) return
			this.$router.push('/board/' + boardId)
		}
	},
}
</script>
