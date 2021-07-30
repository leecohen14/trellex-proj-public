<template>
	<header class="app-header">
		<nav class="nav">
			<router-link to="/">
				<button>
					<img :src="require('@/assets/home.svg')" alt="" />
				</button>
			</router-link>

			<!-- <router-link to="/board"> -->
			<button class="boards-btn" @click="toggleBoards(true)">
				<img :src="require('@/assets/boards.svg')" alt="" />
				<p>Boards</p>
			</button>
			<boards-menu 
				v-if="isBoardsMenuOpen"
				@closeMenu="toggleBoards(false)"
				@openCreateBoard="openCreateBoard"
			/>
			<!-- </router-link> -->
			<input
				class="search-input"
				type="search"
				placeholder="Jump to..."
			/>
		</nav>

		<router-link to="/">
			<img
				class="logo"
				:src="require('@/assets/Trellex-logo.new.gif')"
				alt=""
				draggable="false"
			/>
		</router-link>

		<nav class="nav">
			<button @click="openCreateBoard">
				<img :src="require('@/assets/add.svg')" alt="" />
			</button>
			<button>
				<img :src="require('@/assets/info.svg')" alt="" />
			</button>
			<button :style="hasNoti">
				<img :src="require('@/assets/bell.svg')" alt="" />
			</button>
			<button @click="openUserMenu">
				<i class="fas fa-user-circle" />
			</button>
		</nav>
		<create-board v-if="isCreateBoardOpen" @closeMenu="closeBoardsMenu"/>
	</header>
</template>

<script>
import { eventBusService } from '@/services/event-bus.service.js'
import boardsMenu from '../cmps/menus-cmps/boards-menu.vue'
import createBoard from '../cmps/create-board.vue';
export default {
	data() {
		return {
			isBoardsMenuOpen: false,
			isCreateBoardOpen: false
		}
	},
	methods: {
		openUserMenu() {
			this.$emit('openUserProfile')
		},
		toggleBoards(mode=true) {
			this.isBoardsMenuOpen = mode
		},
		closeBoardsMenu(){
			this.isBoardsMenuOpen = false
			this.isCreateBoardOpen = false
		},
		openCreateBoard(){
			this.isCreateBoardOpen = true
			this.isBoardsMenuOpen = false
		}
	},
	computed: {
		boards() {
			return this.isBoardsMenuOpen
		},
		hasNoti(){
			if (this.$store.getters.userNoti) return 'background-color: #CF513D;'
		}
	},
	created(){
		eventBusService.$on('closeHeaderMenus', this.closeBoardsMenu)
	},
	components: {
		boardsMenu,
		createBoard
	}
}
</script>
