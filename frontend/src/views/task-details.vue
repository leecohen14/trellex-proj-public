<template>
	<black-screen class="details-black-screen">
		<section v-if="task" class="task-details" @click.stop="closeMenus">
			<header
				v-if="cover && (cover.bgColor || cover.bgUrl)"
				class="head-cover"
				:style="coverStyle"
			>
				<button class="cancel-btn header" @click.stop="closeDetails">
					<img :src="require('@/assets/cancel-icon.png')" />
				</button>
				<button class="cover-btn header" @click.stop="openCoverMenu(1)">
					<img
						:src="
							require('@/assets/details-side-bar-icons/Cover-menu.svg')
						"
					/>
					Cover
				</button>
			</header>

			<button v-else class="cancel-btn" @click.stop="closeDetails">
				<img :src="require('@/assets/cancel-icon.png')" />
			</button>

			<main class="task-details-container">
				<task-title :task="task" @saveTask="saveTask" />
				<div class="main-container">
					<section>
						<transition-group
							name="group"
							enter-active-class="animate__animated animate__fadeInRight animate__faster"
							leave-active-class="animate__animated animate__fadeOutRight"
						>
							<task-summary-details :key="1" :task="task" />
							<!-- <input type="text" v-model="task.title" /> -->
							<!-- <textarea name="" id="" v-model="task.title" @change="saveTask()">{{task.title}}</textarea> -->
							<task-desc
								:key="2"
								:task="task"
								@saveTask="saveTask"
							/>
							<task-attachments
								:key="3"
								:task="task"
								v-if="
									task.attachments && task.attachments.length
								"
							/>
							<checklist-preview
								v-if="isChecklists"
								:key="4"
								:task="task"
							/>

							<task-activity
								:key="5"
								:task="task"
								@saveTask="saveTask"
							/>
							<!-- {{ task }} -->
						</transition-group>
					</section>
					<side-bar />
				</div>
			</main>
			<basic-menu
				class="cover-menu"
				v-if="openedMenu"
				@closeMenu="openedMenu = 0"
				:title="'cover'"
				:style="{
					top: menuPosition.posY + 'px',
					left: menuPosition.posX + 'px'
				}"
			>
				<cover-menu
					v-if="openedMenu === 1"
					@closeMenu="openedMenu = 0"
				/>
			</basic-menu>
		</section>
	</black-screen>
</template>

<script>
import taskDesc from '@/cmps/task-details-cmps/task-desc.vue'
import taskAttachments from '@/cmps/task-details-cmps/task-attachments.vue'
import taskTitle from '@/cmps/task-details-cmps/task-title.vue'
import taskActivity from '../cmps/task-details-cmps/task-activity.vue'
import checklistPreview from '../cmps/task-details-cmps/checklists-preview.vue'
import taskSummaryDetails from '../cmps/task-details-cmps/task-summary-details.vue'

import sideBar from '@/cmps/task-details-cmps/side-bar.vue'
import blackScreen from '../cmps/black-screen.vue'

import { eventBusService } from '../services/event-bus.service.js'
import basicMenu from '../cmps/basic-menu.vue'
import coverMenu from '../cmps/menus-cmps/cover-menu.vue'


export default {
	name: 'task-details',
	data() {
		return {
			menuPosition: { posX: '', posY: '' },
			openedMenu: 0
		}
	},

	computed: {
		task() {
			const { groupId } = this.$route.params
			const { taskId } = this.$route.params

			this.$store.commit({ type: 'getTaskById', taskId, groupId })
			return this.$store.getters.currTask
		},
		isChecklists() {
			return this.task.checklists?.length
		},
		cover() {
			return this.$store.getters.currTask?.cover
		},
		coverStyle() {
			const cover = this.$store.getters.currTask?.cover
			if (cover.bgColor) {
				const style = `background-color:${cover.bgColor}`
				return style
			} else if (cover.bgUrl) {
				// const style = `background-image: url('${cover.bgUrl}';  background-size:cover;)`
				const style = `background-image: url('${cover.bgUrl}');  background-size:cover; background-position:center;`
				return style
			}
		}
	},
	methods: {
		saveTask(task) {
			const { groupId } = this.$route.params
			this.$store.dispatch({ type: 'saveTask', taskToSave: task, groupId })
		},
		closeDetails() {
			const { boardId } = this.$route.params
			this.$store.commit({ type: 'closeBlack' })
			this.$router.push(`/board/${boardId}`)
		},
		closeMenus() {
			eventBusService.$emit('closeAllMenus')
		},
		openCoverMenu(menuIdx) {
			this.openedMenu = 0
			this.$nextTick(() => {
				this.openedMenu = menuIdx
				// TODO
				this.menuPosition.posX = event.pageX - 520
				this.menuPosition.posY = event.pageY - 14
			})
		},
	},
	created() {
		this.$store.commit({ type: 'openBlack' })
		document.addEventListener('keydown', ((e) => { if (e.key === "Escape" && this.$route.path.includes('details')) this.closeDetails() }))
	},
	components: {
		taskDesc,
		taskAttachments,
		taskTitle,
		taskActivity,
		checklistPreview,
		taskSummaryDetails,
		sideBar,
		blackScreen,
		basicMenu,
		coverMenu
	},
}
</script>


