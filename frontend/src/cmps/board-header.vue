<template>
	<section class="board-header">
		<main class="left-board-header">
			<h1 v-if="!titleIsEditing" @click="openEditing">
				{{ boardTitle }}
			</h1>
			<input
				v-else
				type="text"
				ref="title"
				placeholder="Title"
				v-model="boardTitle"
				@blur="saveBoardTitle"
				@keydown.enter="saveBoardTitle"
				:style="'width:' + inputWidth + 'px'"
			/>

			<span class="border-divider"> </span>

			<button @click="toggleFav" class="fav" :class="{ starred: isFav }">
				<i class="icon-star"> </i>
				<!-- <i class="far fa-star"></i> -->
			</button>

			<span class="border-divider"> </span>
			<!-- <button>Workspace</button> -->
			<div v-if="members.length" class="users">
				<avatar
					class="sum-img"
					:size="32"
					:rounded="true"
					:username="member.username"
					:src="member.imgUrl"
					v-for="member in members"
					:key="member._id"
				></avatar>
			</div>

			<span class="border-divider"> </span>
			<button
				@click.stop="toggleMembersMenu"
				class="board-header-btn invite-btn"
			>
				Invite
			</button>
			<basic-menu :title="'Invite to board'" v-if="isMembersMenuOpen"> 
				<invite-members
					class="members-invite"
					@closeMenu="isMembersMenuOpen"
				></invite-members>
			</basic-menu>
			<!-- <invite-menu @closeMenu="toggleInviteMenu" v-if="isInviteMenuOpen"> </invite-menu> -->
		</main>
		<div class="right-board-header">
			<button class="board-header-btn statistics-btn" @click="openStats">
				Statistics
			</button>
			<button class="board-header-btn" @mousedown="openSideMenu">
				<img :src="require('@/assets/dots-menu.svg')" /> Show menu
			</button>
		</div>

		<basic-menu
			:isAutoClosed="false"
			class="basic-side-menu"
			v-if="isSideMenuOpen"
			@closeMenu="toggleSideMenu"
			:title="currTitle"
		>
			<side-menu
				@click.native="closeMenus"
				@closeMenu="toggleSideMenu"
				@setTitle="setTitle"
			/>
		</basic-menu>
	</section>
</template>

<script>
import Avatar from 'vue-avatar'
import sideMenu from './side-menu/side-menu.vue'
import basicMenu from './basic-menu.vue'
// import inviteMenu from '@/cmps/invite-menu.vue'
// import membersMenu from '@/cmps/menus-cmps/members-menu.vue'
import inviteMembers from '@/cmps/invite-members.vue'

import { eventBusService } from "@/services/event-bus.service.js"

export default {
	props: {
		title: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			boardTitle: '',
			titleIsEditing: false,
			isSideMenuOpen: false,
			// isInviteMenuOpen: false,
			isMembersMenuOpen: false,
			currTitle: 'Menu'
		}
	},
	methods: {
		openSideMenu() {
			console.log('Opening side menu ... ')
			this.isSideMenuOpen = !this.isSideMenuOpen
		},
		openStats() {
			console.log('Opening Statistics ... ')
			const { boardId } = this.$route.params
			this.$router.push(`/board/${boardId}/statistics`)
		},
		saveBoardTitle() {
			this.$store.commit({ type: 'saveBoardTitle', boardTitle: this.boardTitle })
			this.$store.dispatch({ type: 'saveBoard' })
			this.titleIsEditing = false
		},
		openEditing() {
			this.titleIsEditing = true
			this.$nextTick(() => {
				this.$refs.title.select()
				// this.$refs.title.focus()
			})
		},
		toggleSideMenu() {
			this.isSideMenuOpen = !this.isSideMenuOpen
			this.currTitle = 'Menu'
		},
		// toggleInviteMenu() {
		// 	this.isInviteMenuOpen = !this.isInviteMenuOpen
		// },
		toggleMembersMenu() {
			this.isMembersMenuOpen = !this.isMembersMenuOpen
		},
		setTitle(title) {
			this.currTitle = title
		},
		closeMenus() {
			eventBusService.$emit('closeAllMenus')
		},
		toggleFav() {
			console.log("IN")
			let isFav = this.$store.getters.board.isFavorite
			isFav = !isFav
			this.$store.commit({ type: 'toggleBoardIsFavorite', isFav })
			this.$store.dispatch({ type: 'saveBoard' })
		},

	},
	computed: {
		members() {
			return this.$store.getters.members
		},
		inputWidth(ev) {
			const inputWidth = ((ev.boardTitle.length) * 11)
			return inputWidth
		},
		isFav() {
			return this.$store.getters.board.isFavorite
		},
	},
	mounted() {
		this.boardTitle = this.$store.getters.board.title
	},
	watch: {
		"title": {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				if (newValue === oldValue) return

				this.boardTitle = this.title
			}
		}
	},
	components: {
		Avatar,
		sideMenu,
		basicMenu,
		// inviteMenu,
		// membersMenu,
		basicMenu,
		inviteMembers
	},
}
</script>