<template>
	<section class="task-attachments">
		<head>
			<img
				:src="
					require('@/assets/details-side-bar-icons/Attachment-menu.svg')
				"
				alt=""
			/>
			<h3>Attachments</h3>
		</head>
		<transition
			enter-active-class="animate__animated animate__fadeIn animate__faster"
			leave-active-class="animate__animated animate__fadeOut animate__faster"
		>
			<Container
				orientation="vertical"
				:get-child-payload="getParentPayload"
				:drop-placeholder="dropPlaceholderOptions"
				group-name="3"
				class="files-container"
				@drop="onDrop(task.attachments, $event)"
			>
				<Draggable
					v-for="(file, idx) in task.attachments"
					class="file-container"
					:key="idx"
				>
					<div draggable="false">
						<img :src="file.fileUrl" alt="no img" />
						<div class="file-desc">
							<span class="file-name"
								>{{ file.fileName }}
								<img
									:src="
										require('@/assets/north-east-arrow.svg')
									"
									alt=""
									class="clickable"
									@click="openImage(file.fileUrl)"
							/></span>
							<span>
								Added
								{{ file.createdAt | moment("from") }} -
								<span
									class="clickable underline"
									@click="focusComment(file.fileName)"
									>Comment</span
								>
								-
								<span
									class="clickable underline"
									@click="removeFile(file)"
									>Delete</span
								>
								-
								<span
									class="clickable underline"
									@click.stop="openMenu(1, file.id)"
									>Edit</span
								>
							</span>
							<span
								class="make-cover clickable"
								@click="makeCover(file.fileUrl)"
							>
								<img
									class="cover "
									:src="
										require('@/assets/details-side-bar-icons/Cover-menu.svg')
									"
									alt=""
								/>
								<span class="underline ">Make cover</span>
							</span>
						</div>
					</div>
				</Draggable>
			</Container>
		</transition>

		<button class="add-btn" @click.stop="openMenu(2)">
			Add an attachment
		</button>

		<basic-menu
			class="name-menu"
			v-if="openedMenu"
			@closeMenu="openedMenu = 0"
			:title="'Edit attachment'"
			:style="{
				top: menuPosition.posY + 'px',
				left: menuPosition.posX + 'px'
			}"
		>
			<file-name-menu
				v-if="openedMenu === 1"
				:fileId="editedFileId"
				@closeMenu="openedMenu = 0"
			/>
			<attachment-menu
				v-if="openedMenu === 2"
				@closeMenu="openedMenu = 0"
			/>
		</basic-menu>
	</section>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@/services/applyDrag.js"
import { eventBusService } from '../../services/event-bus.service.js'
import basicMenu from '../../cmps/basic-menu.vue'
import fileNameMenu from '../../cmps/menus-cmps/file-name-menu.vue'
import attachmentMenu from '../../cmps/menus-cmps/attachment-menu.vue'

export default {
	props: {
	},
	data() {
		return {
			dropPlaceholderOptions: {
				className: "drop-preview",
				animationDuration: "150",
				showOnTop: false,
			},
			editedFileId: null,
			menuPosition: { posX: '', posY: '' },
			openedMenu: 0
		}
	},
	methods: {
		// --------------------
		onDrop(items, dropResult) {
			const newItems = applyDrag(items, dropResult)
			const taskToSave = this.task
			taskToSave.attachments = newItems

			const { groupId } = this.$route.params
			this.$store.commit({ type: "saveTask", groupId, taskToSave })

			this.$store.dispatch({ type: "saveBoard" })
		},
		getParentPayload(index) {
			return this.task.attachments[index]
		},


		// ---------------------
		focusComment(fileName) {
			eventBusService.$emit('focusOnComment', fileName)
		},
		removeFile(file) {
			const idx = this.task.attachments.findIndex(f => f.id === file.id)
			this.task.attachments.splice(idx, 1)
			const { taskId, groupId } = this.$route.params
			this.$store.commit({ type: "removeFile", groupId, taskId, fileId: file.id })
			this.$store.dispatch({ type: "saveBoard" })
		},
		openImage(url) {
			window.open(url, 'my image')
		},
		makeCover(fileUrl) {
			if (!this.task) return
			const { groupId } = this.$route.params
			const taskToSave = this.task
			taskToSave.cover ??= {}
			taskToSave.cover.bgUrl = fileUrl
			taskToSave.cover.bgColor = ''
			this.$store.commit({ type: 'saveTask', groupId, taskToSave })
			this.$store.dispatch({ type: 'saveBoard' })
		},
		openMenu(menuIdx, fileId = null) {
			this.openedMenu = 0
			this.$nextTick(() => {
				this.openedMenu = menuIdx
				if (fileId) this.editedFileId = fileId

				// TODO
				// this.menuPosition.posX = event.pageX - 142
				// this.menuPosition.posY = event.pageY - 29

				// const xPos = (event.clientX > window.innerWidth - 350) ? event.clientX - 280 : event.clientX
				const xPos = window.innerWidth / 5 - 20
				let yPos = 50
				if (event.clientY < 440) {
					yPos = 150
				}
				if (event.clientY < 330) {
					yPos = 250
				}
				if (event.clientY < 200) {
					yPos = 350
				}
				if (event.clientY < 100) {
					yPos = 480
				}
				this.menuPosition.posX = xPos
				this.menuPosition.posY = yPos
			})
		},
	},
	computed: {
		task() {
			return this.$store.getters.currTask
		}
	},
	components: {
		Container,
		Draggable,
		basicMenu,
		fileNameMenu,
		attachmentMenu
	},
}
</script>