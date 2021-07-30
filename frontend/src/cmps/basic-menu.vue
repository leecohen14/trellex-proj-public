<template>
	<transition
		enter-active-class="animate__animated animate__fadeInRight animate__faster"
		leave-active-class="animate__animated animate__fadeOutRight animate__faster"
	>
		<section v-if="isAlive" class="basic-menu" @click.stop="">
			<header class="title">
				<!-- <span class="close-btn" @click="closeMenu">X</span> -->
				<button class="close-btn" @click="closeMenu">
					<img :src="require('@/assets/cancel-icon.png')" />
				</button>
				<p>
					{{ title }}
				</p>
			</header>

			<slot></slot>
		</section>
	</transition>
</template>

<script>
import { eventBusService } from '@/services/event-bus.service.js'
export default {
	
	props: {
		title: {
			type: String,
			default: '',
		},
		isAutoClosed: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return{
			isAlive: false
		}
	},
	methods: {
		closeMenu() {
			this.isAlive = false
			this.$emit('closeMenu')
		},
	},
	created() {
		eventBusService.$emit('closeAllMenus')
		if (this.isAutoClosed) eventBusService.$on('closeAllMenus', this.closeMenu)
	},
	mounted(){
		this.isAlive = true
	}
};
</script>