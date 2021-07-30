<template>
	<section class="file-name-menu">
		<label for="linkName" class="bold-font"
			>Link name
			<br />
			<input
				id="linkName"
				type="text"
				placeholder="Set checklist"
				v-model="fileName"
				ref="input"
				@keydown.enter.prevent.stop="updateFileName"
			/>
		</label>
		<button class="update-btn" @click="updateFileName">Update</button>
	</section>
</template>

<script>
export default {
	props: {
		fileId: String
	},
	data() {
		return {
			fileName: this.$store.getters.currTask.attachments.find(f => f.id === this.fileId).fileName
		}
	},
	methods: {
		updateFileName() {
			const task = this.$store.getters.currTask
			const file = task.attachments.find(f => f.id === this.fileId)
			file.fileName = this.fileName
			const { groupId } = this.$route.params
			this.$store.commit({ type: "saveTask", groupId, taskToSave: task })
			this.$store.dispatch({ type: "saveBoard" })
			this.$emit('closeMenu')
		}
	},
	created() {
		this.$nextTick(() => {
			this.$refs.input.select()
		})
	}

}
</script>