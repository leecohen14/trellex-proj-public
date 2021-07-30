<template>
	<section class="boards-menu">
		<div class="head">
			<input
				type="text"
				placeholder="Find boards by name..."
				ref="searchInput"
			/>
			<button class="cancel-btn" @click.stop="closeMenu">
				<img :src="require('@/assets/cancel-icon.png')" />
			</button>
		</div>

		<main class="body" v-loading="loading">
			<section class="stared-container">
				<h5>
					<i class="far fa-star"> </i>
					Starred Boards
				</h5>
				<article
					class="board-mini-preview"
					v-for="board in staredBoards"
					@click="moveToBoard(board._id)"
					:key="board._id"
					:style="boardBgStyle(board._id)"
				>
					<div class="filter"></div>
					<img
						:src="board.style.bgUrl"
						alt=""
						v-if="board.style.bgUrl"
					/>
					<span class="title">{{ board.title }}</span>
				</article>
			</section>
			<section class="recent-container">
				<h5>
					<img :src="require('@/assets/badges/clock.png')" />

					Recent Boards
				</h5>
				<article
					class="board-mini-preview"
					v-for="board in unStaredBoards"
					@click="moveToBoard(board._id)"
					:key="board._id"
					:style="boardBgStyle(board._id)"
				>
					<div class="filter"></div>
					<img
						:src="board.style.bgUrl"
						alt=""
						v-if="board.style.bgUrl"
					/>
					<div
						v-else
						class="minibox-color"
						:style="boardBgStyle(board._id)"
					></div>
					<span class="title">{{ board.title }}</span>
				</article>
			</section>
			<button @click="createNewBoard">Create new board...</button>
		</main>
	</section>
</template>

<script>
import { eventBusService } from '@/services/event-bus.service.js'
import { boardService } from '@/services/board.service.js'
import createBoard from "../create-board.vue"

export default {
	data() {
		return {
			isCreateBoardOpen: false,
			boards: null,

			loading: false
		}
	},
	methods: {
		closeMenu() {
			this.$emit('closeMenu')
		},
		createNewBoard() {
			console.log('Creating new board')
			this.$emit('openCreateBoard')
		},
		moveToBoard(id) {
			this.$router.push({ path: `/board/${id}` }).catch(() => { })
			this.closeMenu()
		},
		boardBgStyle(id) {
			if (!this.boards) return
			const bg = this.boards.find(b => b._id === id)
			if (!bg) return
			if (bg.style.bgUrl) return `background-image: url('${bg.style.bgUrl}');`
			return `background-color: ${bg.style.bgColor}`
		},
	},
	computed: {
		// boards() {
		// 	// use: c_thumb,w_200,g_face    -   for small size data
		// 	// TODO getter for all boards for curr user
		// 	return [
		// 		{ title: 'Auto car', _id: 'blablab1la', isStared: true, imgUrl: 'https://res.cloudinary.com/avivcloud/image/upload/c_thumb,w_200,g_face/v1626957444/o3uumjivommtn4fruowu.jpg' },
		// 		{ title: 'Auto car', _id: 'blablab3la', isStared: false, imgUrl: 'https://res.cloudinary.com/avivcloud/image/upload/c_thumb,w_200,g_face/v1626957444/o3uumjivommtn4fruowu.jpg' },
		// 		{ title: 'Auto car', _id: 'blablab2la', isStared: true, imgUrl: 'https://res.cloudinary.com/avivcloud/image/upload/c_thumb,w_200,g_face/v1626957444/o3uumjivommtn4fruowu.jpg' },
		// 		{ title: 'Auto car', _id: 'blablab4la', isStared: true, imgUrl: 'https://res.cloudinary.com/avivcloud/image/upload/c_thumb,w_200,g_face/v1626957444/o3uumjivommtn4fruowu.jpg' },
		// 		{ title: 'Auto car', _id: 'blablab5la', isStared: false, imgUrl: 'https://res.cloudinary.com/avivcloud/image/upload/c_thumb,w_200,g_face/v1626957444/o3uumjivommtn4fruowu.jpg' },
		// 		{ title: 'Auto car', _id: 'blablab6la', isStared: false, imgUrl: 'https://res.cloudinary.com/avivcloud/image/upload/c_thumb,w_200,g_face/v1626957444/o3uumjivommtn4fruowu.jpg' },
		// 	]
		// },
		staredBoards() {
			return this.boards?.filter(b => b.isStared)
		},
		unStaredBoards() {
			return this.boards?.filter(b => !b.isStared)
		},
		// bgStyle() {
		// 	if (this.board.style.bgUrl) return `background-image: url('${this.board.style.bgUrl}'); background-size:cover; background-position: center;`
		// 	return `background-color: ${this.board.style.bgColor}`
		// },
	},
	async created() {
		eventBusService.$on('closeAllMenus', this.closeMenu)
		this.loading = true
		this.boards = await boardService.query()
		this.loading = false
	},
	mounted() {
		this.$refs.searchInput.select()
	},

}
</script>
