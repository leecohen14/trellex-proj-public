<template>
	<main class="checklist-preview">
		<transition-group
			enter-active-class="animate__animated animate__fadeInRight animate__faster"
			leave-active-class="animate__animated animate__fadeOutRight animate__faster"
		>
			<section
				class="todos-container"
				v-for="(checklist, idx) in taskToSave.checklists"
				:key="checklist.id"
			>
				<head>
					<span>
						<img :src="require('@/assets/checklist.svg')" alt="" />
						<h3>{{ checklist.title }}</h3>
					</span>
					<button @click="removeChecklist(idx)">
						Delete
					</button>
				</head>

				<todos-preview
					:list="checklist"
					@saveChecklist="saveChecklist"
				/>
			</section>
		</transition-group>
	</main>
</template>

<script>
import todosPreview from '@/cmps/task-details-cmps/todos-preview.vue'

export default {
	props: {
		task: Object
	},
	computed: {
		taskToSave() {
			return JSON.parse(JSON.stringify(this.task))
		}
	},
	methods: {
		saveTask() {
			const { groupId } = this.$route.params
			this.$store.dispatch({ type: 'saveTask', groupId, taskToSave: this.taskToSave })
		},
		saveChecklist(checklist) {
			const idx = this.taskToSave.checklists.findIndex(l => l.id === checklist.id)
			if (idx < 0) return
			this.taskToSave.checklists.splice(idx, 1, checklist)

			this.saveTask()
		},
		removeChecklist(idx) {
			if (idx < 0) return
			this.taskToSave.checklists.splice(idx, 1)

			this.saveTask()
		}
	},
	components: {
		todosPreview
	},
}
</script>