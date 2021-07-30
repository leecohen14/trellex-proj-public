<template>
	<main class="checklist-menu">
		<label for="linkName" class="bold-font"
			>Title
			<br />
			<input
				type="text"
				placeholder="Set checklist"
				v-model="checklist"
				ref="input"
				@keydown.enter="addChecklist"
			/>
		</label>

		<button class="add-btn" @click="addChecklist">Add</button>
	</main>
</template>

<script>
import { utilService } from "@/services/util.service.js"
export default {
	data() {
		return {
			checklist: 'Checklist'
		}
	},
	methods: {
		addChecklist() {
			const { taskId } = this.$route.params
			const { groupId } = this.$route.params

			this.$store.commit({ type: 'getTaskById', taskId, groupId })
			const taskToSave = this.$store.getters.currTask

			taskToSave.checklists ??= []
			taskToSave.checklists.push({ title: this.checklist, id: utilService.makeId(), todos: [] })

			this.$store.dispatch({ type: 'saveTask', groupId, taskToSave })
			this.$emit('closeMenu')
		}
	},
	mounted() {
		this.$refs.input.select()
	},
}
</script>

<style>
</style>