<template>
	<main
		v-if="board"
		class="board"
		@click="closeMenus"
		v-dragscroll:nochilddrag.x="true"
		v-dragscroll:nochilddrag.y="false"
		ref="board"
	>
		<board-header :title="board.title" />
		<router-view />
		<section class="groups-container" @touchend="fixActionRestriction">
			<!-- @mouseover.stop="fixMobile" -->
			<Container
				v-if="board.groups && board.groups.length"
				orientation="horizontal"
				drag-class="card-ghost"
				drop-class="card-ghost-drop"
				:get-child-payload="getParentPayload"
				:drop-placeholder="dropPlaceholderOptions"
				:non-drag-area-selector="'.fill'"
				:drag-begin-delay="adaptDeviceDND"
				group-name="1"
				class="outter"
				@drop="onDrop(board.groups, $event)"
				@drag-start="calcPlaceholder"
				@drag-end="dragging = false"
			>
				<template v-if="!isQuickEdit">
					<Draggable
						v-for="(group, idx) in board.groups"
						:key="group.id"
					>
						<group-preview
							:data-group="group.id"
							:group="group"
							@saveBoard="countChangessToSave"
						/>
						<div data-dragscroll class="fill"></div>
					</Draggable>
				</template>
				<template v-else>
					<group-preview
						v-for="group in board.groups"
						:key="group.id"
						:group="group"
						@saveBoard="countChangessToSave"
					/>
				</template>
			</Container>

			<form @submit.prevent="addGroup" draggable="false">
				<button v-if="!addingGroup" @click="toggleAddingGroup">
					<i class="fas fa-plus"></i> Add another list
				</button>
				<div class="adding-group" v-else>
					<input
						ref="input"
						type="text"
						placeholder="Enter list title..."
						v-model="newGroup.title"
						@blur="toggleAddingGroup"
					/>
					<div class="btns-container">
						<button @mousedown.prevent.stop="" class="add-list-btn">
							Add list
						</button>
						<button
							class="cancel-btn"
							@click.stop="toggleAddingGroup"
						>
							<img :src="require('@/assets/cancel-icon.png')" />
						</button>
					</div>
				</div>
				<div data-dragscroll class="fill"></div>
			</form>
		</section>
		<button @mousedown.prevent.stop="toggleChat" class="chat-btn">
			<i class="far fa-comment"></i>
			<span class="chat-notifications" v-if="unreadMsgsCount">{{
				unreadMsgsCount
			}}</span>
		</button>
		<board-chat v-if="isChatOpen" :user="user" @closeChat="toggleChat" />
	</main>
</template>

<script>
import boardHeader from "@/cmps/board-header.vue"
import groupPreview from "@/cmps/group-preview.vue"
import boardChat from "@/cmps/board-chat.vue"
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@/services/applyDrag.js"

import { socketService, SOCKET_EVENT_BOARD_UPDATED } from "../services/socket.service.js"
import { eventBusService } from "@/services/event-bus.service.js"

export default {
	name: "board",
	data() {
		return {
			addingGroup: false,
			newGroup: { title: "", tasks: [] },
			dropPlaceholderOptions: {
				className: "drop-preview",
				animationDuration: "0",
				showOnTop: false,
			},
			dragging: false,
			calcing: null,
			dropCount: 0,
			isChatOpen: false,
		}
	},
	methods: {
		addGroup() {
			if (!this.newGroup.title) return
			this.$store.dispatch({
				type: "addGroup",
				groupToSave: this.newGroup,
			})

			this.newGroup = { title: "", tasks: [] }
			this.$nextTick(() => {
				this.$refs.board.scrollBy(400, 0)
				this.$refs.input.select()
			})

			this.$store.commit({ type: 'setMsgTxt', txt: 'Added successfuly!' })
			this.$store.dispatch({ type: 'activeMsg' })
		},
		toggleAddingGroup() {
			this.newGroup = { title: "", tasks: [] }
			this.addingGroup = !this.addingGroup
			if (this.addingGroup) {
				this.$nextTick(() => this.$refs.input.select())
			}
		},
		closeMenus() {
			eventBusService.$emit('closeAllMenus')
		},
		async loadBoard(boardId) {
			try {
				await this.$store.dispatch({ type: "loadBoard", boardId })
			} catch (error) {
				await this.$router.push('/').catch(() => { })
				await this.$store.dispatch({ type: 'logout' })
				location.reload()
			}
		},

		// --------------------
		countChangessToSave() {
			this.dropCount++

			if (this.dropCount === this.board?.groups?.length) {
				this.$store.dispatch({ type: 'saveBoard' })
				this.dropCount = 0
			}
		},
		onDrop(items, dropResult) {
			const newItems = applyDrag(items, dropResult)
			this.$store.commit({ type: "setGroups", groups: newItems })

			this.$store.dispatch({ type: "saveBoard" })
		},

		getParentPayload(index) {
			return this.board.groups[index]
		},
		calcPlaceholder(ev) {
			if (!ev.isSource) return
			const item = document.querySelector(`[data-group=${ev.payload.id}]`)

			this.dragging = true
			this.calcing = setInterval(() => {
				if (!this.dragging) clearInterval(this.calcing)

				const placeholder = document.querySelector('.outter > .smooth-dnd-drop-preview-constant-class')
				if (!placeholder) return
				placeholder.style.height = item.offsetHeight + 'px'
			}, 5)
		},
		fixActionRestriction() {
			// console.log('event :>> ', event)
			document.body.classList.remove(
				"smooth-dnd-no-user-select",
				"smooth-dnd-disable-touch-action"
			)
		},


		handleScroll() {
			this.$refs.board.scrollTop = 0
		},

		getOffset(el) {
			const rect = el.getBoundingClientRect()
			return {
				left: rect.left + window.scrollX,
				top: rect.top + window.scrollY
			}
		},


		// ------------------
		async setup() {
			const { boardId } = this.$route.params
			if (!boardId) return

			await socketService.setup()
			await this.loadBoard(boardId)

			// SOCKETS
			socketService.emit('register-board', boardId)
			socketService.on(SOCKET_EVENT_BOARD_UPDATED, this.loadBoard)
			socketService.on('add-msg', () => {
				this.$store.commit({ type: 'updateChatUnreadMsgs', action: 'increase' })
				// this.$store.dispatch({type: 'updateUSer'})
			})
			socketService.on('user-watch-task', ({ taskId, taskTitle, userId }) => {
				this.$store.commit({type: 'setNoti', mode: true})
				console.log('taskId, taskTitle, userId :>> ', taskId, taskTitle, userId)
				if (userId !== this.$store.getters.loggedinUser?._id) return
				this.$store.commit({type: 'setMsgTime', time: 4500})
				this.$store.commit({ type: 'setMsgTxt', txt: `You have been tagged in ${taskTitle}!` })
				this.$store.dispatch({ type: 'activeMsg' })
			})
		},
		toggleChat() {
			this.isChatOpen = !this.isChatOpen
		}
	},
	computed: {
		board() {
			return this.$store.getters.board
		},
		isQuickEdit() {
			return this.$store.getters.isTaskQuickEdit
		},
		fixMobile() {
			if (window.innerWidth < 600) event.preventDefault()
		},
		adaptDeviceDND() {
			return (window.innerWidth < 600) ? 100 : 0
		},
		user() {
			return this.$store.getters.loggedinUser
		},
		unreadMsgsCount() {
			return this.$store.getters.unreadMsgsCount
		},
	},
	watch: {
		"$route.params.boardId": {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				if (newValue === oldValue) return

				socketService.off(SOCKET_EVENT_BOARD_UPDATED)
				socketService.off('user-watch-task')
				socketService.off('add-msg')
				socketService.terminate()

				this.setup()
			}
		}
	},
	destroyed() {
		socketService.off(SOCKET_EVENT_BOARD_UPDATED)
		socketService.off('user-watch-task')
		socketService.off('add-msg')
		socketService.terminate()
	},
	components: {
		groupPreview,
		Container,
		Draggable,
		boardHeader,
		boardChat
	},
};
</script>

