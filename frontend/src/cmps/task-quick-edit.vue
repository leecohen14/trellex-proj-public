<template>
	<section @click="closeGroupMenu" class="quick-edit-menu">
		<div class="quick-edit-container">
			<div class="quick-labels">
				<task-label-preview
					v-for="label in currLabels"
					:key="label.id"
					:label="label"
				/>
			</div>
			<form @click.stop="" @submit.prevent="closeGroupMenu">
				<el-input
					type="textarea"
					class="textarea"
					:class="paddingTop"
					:autosize="{ minRows: 5, maxRows: 10 }"
					placeholder="Edit card..."
					v-model="taskToSave.title"
				>
				</el-input>

				<button >Save</button>
			</form>
		</div>

		<div @click.stop="" class="quick-edit-btns">
			<button @click="openTaskDetails">
				<i class="fas fa-clipboard-list"></i> Open card
			</button>

			<button @click="open = 2">
				<i class="fas fa-tag"></i> Edit labels
			</button>

			<button @click="open = 3">
				<i class="far fa-user"></i> Change members
			</button>

			<button @click="open = 4">
				<i class="fas fa-th-large"></i> Change cover
			</button>

			<button @click="open = 5">
				<i class="fas fa-arrow-right"></i> Move
			</button>

			<button @click="open = 6"><i class="far fa-copy"></i> Copy</button>

			<button @click="open = 7">
				<i class="far fa-clock"></i> Edit dates
			</button>

			<button @click="removeTask">
				<i class="far fa-trash-alt"></i> Delete
			</button>
		</div>

		<basic-menu v-if="open" @closeMenu="open = 0">
			<labels-menu
				v-if="open === 2"
				:taskId="task.id"
				@closeMenu="open = 0"
			/>
			<members-menu
				v-if="open === 3"
				:taskId="task.id"
				@closeMenu="open = 0"
			/>
			<dates-menu
				v-if="open === 7"
				:taskId="task.id"
				@closeMenu="open = 0"
			/>
			<cover-menu v-if="open === 4" @closeMenu="open = 0" />
		</basic-menu>
	</section>
</template>

<script>
import basicMenu from '@/cmps/basic-menu.vue'
import labelsMenu from '@/cmps/menus-cmps/labels-menu.vue'
import membersMenu from '@/cmps/menus-cmps/members-menu.vue'
import datesMenu from '@/cmps/menus-cmps/dates-menu.vue'
import coverMenu from '@/cmps/menus-cmps/cover-menu.vue'
import taskLabelPreview from '@/cmps/task-label-preview.vue'

export default {
	name: "task-quick-edit",
	props: {
		task: Object,
		groupId: String,
	},
	data() {
		return {
			taskToSave: this.task,
			open: 0
		}
	},
	methods: {
		async saveTask() {
			console.log('TASK >>> ', this.taskToSave);
			await this.$store.dispatch({ type: 'saveTask', taskToSave: this.taskToSave, groupId: this.groupId })
			this.closeGroupMenu()
		},
		async removeTask() {
			await this.$store.dispatch({ type: 'removeTask', taskId: this.task.id, groupId: this.groupId })
			this.closeGroupMenu()
		},
		closeGroupMenu() {
			this.$store.commit({ type: 'closeBlack' })
			this.$store.commit({ type: 'closeQuickEdit' })
		},
		openTaskDetails() {
			this.$store.commit({ type: 'closeQuickEdit' })
			const boardId = this.$store.getters.board._id
			const groupId = this.$store.getters.groupIdByTaskId
			this.$router
				.push(boardId + "/details/" + groupId + "/" + this.task.id)
				.catch((err) => { })
		},
		saveChanges(){
			console.log('HERE');
		}
	},
	computed: {
		labelsExist() {
			return this.task.labelIds?.length
		},
		currLabels() {
			const labels = this.$store.getters.labels
			const ls = []
			if (!this.task?.labelIds) return
			this.task.labelIds.forEach((id) => {
				const nl = labels.find((l) => l.id === id)
				if (nl) ls.push(nl)
			})
			console.log('LABELS >>>> ', ls)
			return ls
		},
		paddingTop(){
			if(!this.task.labelIds?.length) return 'no-padding-top'
		}
	},
	created() {
		console.log('TASK >>>',this.task);
		const taskId = this.task.id
		this.$store.commit({ type: 'getGroupIdByTaskId', taskId })

		const groupId = this.$store.getters.groupIdByTaskId
		this.$store.commit({ type: 'getTaskById', groupId, taskId })
	},
	components: {
		basicMenu,
		coverMenu,
		datesMenu,
		labelsMenu,
		membersMenu,
		taskLabelPreview
	},
}
</script>