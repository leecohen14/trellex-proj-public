<template>
	<basic-menu
		:title="'Account'"
		class="user-profile-menu"
		@closeMenu="closeMenu"
		v-loading="loading"
	>
		<section>
			<avatar
				class="sum-img"
				:size="40"
				:username="user.username"
				:src="user.imgUrl"
				:key="user._id"
			></avatar>
			<!-- Put real user in here! -->
			<span>{{ user.username }}</span>
		</section>
		<main v-if="!user.fake">
			<h5>Profile and visibility</h5>
			<h5>Activity</h5>
			<h5>Cards</h5>
			<h5>Settings</h5>
		</main>
		<footer>
			<h5 @click="guestLogin" v-if="user.fake">Try as a Guest</h5>
			<h5 @click="login" v-if="user.fake">Login</h5>
			<h5 v-else @click="logout">Log out</h5>
			<h5>Help</h5>
		</footer>
	</basic-menu>
</template>

<script>
import { userService } from "@/services/user.service.js"
import { boardService } from "@/services/board.service.js"
import basicMenu from '@/cmps/basic-menu.vue'

import Avatar from 'vue-avatar'

export default {
	data() {
		return {
			loading: false
		}
	},
	computed: {
		user() {
			return this.$store.getters.loggedinUser
		}
	},
	methods: {
		closeMenu() {
			if (!this?.$emit) return
			this.$emit('closeUserProfile')
		},
		login() {
			this.$router.push('/login')
			this.closeMenu()
		},
		async guestLogin() {
			const guest = {
				username: 'guest',
				password: '123456'
			}

			this.loading = true
			try {
				await this.$store.dispatch({ type: 'login', userCred: guest })

				const boards = await boardService.query()
				if (!boards?.length) return
				this.$router.push(`/board/${boards[0]._id}`)

			} catch (error) {
				this.$router.push('/').catch(() => { })
				// location.reload()
			} finally {
				this.loading = false
				this.closeMenu()
			}
		},
		async logout() {
			this.$router.push('/').catch(() => { })
			this.loading = true
			await this.$store.dispatch({ type: 'logout' })
			this.loading = false

			this.closeMenu()
		}
	},
	components: {
		basicMenu,
		Avatar,
	},
}
</script>
