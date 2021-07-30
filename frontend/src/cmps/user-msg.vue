<template>
	<transition
		enter-active-class="animate__animated animate__fadeInLeftBig"
		leave-active-class="animate__animated animate__fadeOutLeft"
	>
		<div class="user-msg" v-if="msgShown">
			<!-- <div class="user-msg"> -->
			<img :src="require('@/assets/i-icon.svg')" alt="" />

			<button class="cancel-btn" @click="closeMsg">
				<img :src="require('@/assets/cancel-icon.png')" />
			</button>
			<span class="txt">
				{{ msg.txt }}
			</span>
		</div>
	</transition>
</template>

<script>
export default {
	computed: {
		msg() {
			return this.$store.getters.msg
		},
		msgShown() {
			return this.$store.getters.msgShown
		},
		color() {
			let color
			switch (this.msg.type) {
				case 'Success':
					color = '#cde8cde8'
					break
				case 'Error':
					color = '#e4565681'
					break
				default:
					color = '#71ca7185'
					break
			}
			return 'background-color: ' + color
		}
	},
	methods: {
		closeMsg() {
			this.$store.commit({ type: 'closeMsg' })
		}
	},
}
</script>