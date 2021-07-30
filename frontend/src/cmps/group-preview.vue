<template>
	<main class="group-preview" @mousedown="handleAudioVideo">
		<section class="group-header">
			<input
				ref="titleInput"
				type="text"
				placeholder="Title"
				v-model="group.title"
				@change="addGroup"
				@keydown.enter="addGroup"
				@mousedown.stop=""
			/>

			<button @click.prevent.stop="openGroupMenu" draggable="false">
				<img :src="require('@/assets/dots-menu.svg')" />
			</button>

			<basic-menu
				@mousedown.stop=""
				v-if="menuOpened"
				@closeMenu="closeGroupMenu"
				:title="'List actions'"
			>
				<group-top-menu
					:group="group"
					@closeMenu="closeGroupMenu"
					@openAddCard="toggleAddTask"
				/>
			</basic-menu>
		</section>
		<section ref="mainScroll" class="main">
			<Container
				drag-class="card-ghost"
				drop-class="card-ghost-drop"
				:get-child-payload="getChildPayload"
				:drop-placeholder="dropPlaceholderOptions"
				:drag-begin-delay="adaptDeviceDND"
				group-name="2"
				v-if="group"
				class="tasks-container"
				@drop="onDrop(group.tasks, $event)"
			>
				<template v-if="!isQuickEdit">
					<Draggable
						v-for="(task, $index) in group.tasks"
						:key="task.id"
					>
						<task-preview
							:task="task"
							:groupId="group.id"
							@click.native.stop.prevent="
								openTaskDetails(task.id)
							"
						/>
					</Draggable>
				</template>
				<template v-else>
					<task-preview
						v-for="task in group.tasks"
						:key="task.id"
						:task="task"
						:groupId="group.id"
						@click.native.stop.prevent="openTaskDetails(task.id)"
					/>
				</template>
			</Container>

			<div v-if="addingTask" class="add-card-container" @click.stop="">
				<el-input
					type="textarea"
					class="textarea"
					:autosize="{ minRows: 4, maxRows: 20 }"
					placeholder="Enter a title for this card..."
					v-model="newTask.title"
					@keypress.native.enter.prevent="onAddTask"
					@blur="toggleAddTask"
					ref="addCardText"
				>
				</el-input>
				<div class="add-card-footer">
					<span class="btns-container">
						<button class="add-btn" @mousedown.prevent="onAddTask">
							Add card
						</button>
						<button
							class="cancel-btn"
							@mousedown.stop="toggleAddTask"
						>
							<img :src="require('@/assets/cancel-icon.png')" />
						</button>
					</span>

					<button @mousedown.stop.prevent="openBottomMenuOptions">
						<img :src="require('@/assets/dots-menu.svg')" />
					</button>
				</div>
				<basic-menu
					:style="{
						top: menuPosition.posY + 'px',
						left: menuPosition.posX + 'px'
					}"
					class="menu"
					v-if="BottomMenuIsOptions"
					:title="'Options'"
					@closeMenu="closeBottomMenuOptions"
				>
					<bottom-menu-options
						:menuPosition="menuPosition"
						@closeMenu="closeBottomMenuOptions"
					/>
				</basic-menu>
			</div>
		</section>

		<div class="btns">
			<button
				class="add-card-btn"
				v-if="!addingTask"
				@mousedown.stop.prevent="toggleAddTask"
			>
				<img :src="require('@/assets/add.svg')" alt="" /> Add a card
			</button>
			<div class="record-btns">
				<button
					class="video-btn"
					@mousedown.stop.prevent="toggleRecordMode('video')"
				>
					<i class="fas fa-video"></i>
				</button>
				<button
					class="audio-btn"
					@mousedown.stop.prevent="toggleRecordMode('audio')"
				>
					<i class="fas fa-microphone"></i>
				</button>
			</div>
		</div>
		<record-cmp
			@closeMedia="closeMedia"
			@mediaTask="addMediaTask"
			v-if="isRecordingAudio || isRecordingVideo"
			:isVideo="isVideo"
		/>
	</main>
</template>

<script>
import taskPreview from "@/cmps/task-preview.vue"
import boardHeader from "./board-header.vue"
import labelsMenu from "@/cmps/menus-cmps/labels-menu.vue"

import basicMenu from "../cmps/basic-menu.vue"
import groupTopMenu from "./menus-cmps/group-top-menu.vue"
import bottomMenuOptions from "./menus-cmps/bottom-menu-options.vue"
import MembersMenu from "./menus-cmps/members-menu.vue"


// ------- Libs -------
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "../services/applyDrag.js"

import recordCmp from '@/cmps/record-cmp.vue'
import { eventBusService } from '../services/event-bus.service'

export default {
	name: "group-preview",
	props: {
		group: Object,
	},
	data() {
		return {
			addingTask: false,
			isRecordingVideo: false,
			isRecordingAudio: false,
			// isRecordingMode: false,

			newTask: {
				title: "",
				members: [],
			},
			dropPlaceholderOptions: {
				className: "drop-preview",
				animationDuration: "150",
				showOnTop: false,
			},

			menuOpened: false,
			BottomMenuIsOptions: false,
			menuPosition: { posX: "", posY: "" },
		}
	},
	computed: {
		isQuickEdit() {
			return this.$store.getters.isTaskQuickEdit
		},
		isVideo() {
			return this.isRecordingVideo
		},
		adaptDeviceDND() {
			return (window.innerWidth < 600) ? 100 : 0
		},
	},
	methods: {
		openBottomMenuOptions(ev) {
			this.BottomMenuIsOptions = !this.BottomMenuIsOptions
			const xPos = (ev.clientX > window.innerWidth - 350) ? ev.clientX - 280 : ev.clientX
			const yPos = (ev.clientY > 400) ? ev.clientY - 160 : ev.clientY + 25
			this.menuPosition.posX = xPos
			this.menuPosition.posY = yPos
		},
		closeBottomMenuOptions() {
			this.BottomMenuIsOptions = false
		},
		onAddTask() {
			if (!this.newTask.title) return
			this.addingTask = false
			this.addTask()

			this.newTask = { title: "" }
		},
		toggleAddTask() {
			this.addingTask = !this.addingTask
			this.newTask = { title: "" }

			if (this.addingTask) {
				this.$nextTick(() => {
					this.$refs.addCardText.select()
					this.$refs.mainScroll.scrollBy(0, 100000)
				})
			}
			this.closeGroupMenu()
			this.closeBottomMenuOptions()
		},
		addTask() {
			this.$store.dispatch({
				type: "addTask",
				groupId: this.group.id,
				taskToSave: this.newTask,
			})
		},
		toggleTaskMenu() {
			console.log("toggling task menu")
		},
		addMediaTask(media) {
			this.newTask.title = "Media"
			this.newTask.media ??= {}
			this.newTask.media.url = media.data
			this.newTask.media.type = media.type

			this.onAddTask()
		},
		toggleRecordMode(mode) {
			if (mode === 'video') {
				this.isRecordingVideo = !this.isRecordingVideo
			} else {
				this.isRecordingAudio = !this.isRecordingAudio
			}
		},
		closeMedia() {
			this.isRecordingVideo = false
			this.isRecordingAudio = false
		},
		openTaskDetails(taskId) {
			console.log("opening...")
			const { boardId } = this.$route.params

			// this.$store.commit({ type: "openBlack" })
			this.$router
				.push(boardId + "/details/" + this.group.id + "/" + taskId)
				.catch((err) => { })
		},

		// ----------------------

		addGroup() {
			this.$store.dispatch({
				type: "addGroup",
				groupToSave: this.group,
			})

			this.$nextTick(() => {
				this.$refs.titleInput.blur()
			})
		},

		openGroupMenu() {
			this.menuOpened = true
		},
		closeGroupMenu() {
			this.menuOpened = false
		},

		// -------------- DND
		onDrop(items, dropResult) {
			const newItems = applyDrag(items, dropResult)
			this.$store.commit({
				type: "setTasks",
				tasksToSave: newItems,
				groupId: this.group.id,
			})

			this.$emit('saveBoard')
		},
		getChildPayload(index) {
			return this.group.tasks[index]
		},
		closeAllRecord() {
			this.isRecordingVideo = false
			this.isRecordingAudio = false
		},
		handleAudioVideo() {
			if (this.isRecordingVideo || this.isRecordingAudio) {
				event.preventDefault()
				event.stopPropagation()
			}
		}
	},
	components: {
		taskPreview,
		boardHeader,

		labelsMenu,
		basicMenu,
		groupTopMenu,
		bottomMenuOptions,
		MembersMenu,
		Container,
		Draggable,

		recordCmp
	},
	created() {
		eventBusService.$on('closeHeaderMenus', this.closeAllRecord)
	}
};
</script>,