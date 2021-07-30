<template>
	<main class="labels-option">
		<section v-if="!editLabelId" class="labels-menu">
			<input type="text" placeholder="Search labels..." />

			<h5 class="title">LABELS</h5>
			<section class="labels-container">
				<article v-for="(label, idx) in labels" :key="label.id">
					<div
						class="label"
						:style="'background-color:' + label.color + ';'"
						@click="toggleLabel(label.id)"
					>
						{{ label.title }}
						<span
							class="check"
							v-if="taskLabelsIds.find(lId => lId === label.id)"
							><i class="fas fa-check"></i
						></span>
					</div>

					<button @click="onEditLabel(label.id)">
						<img :src="require('@/assets/edit.gif')" alt="" />
					</button>
				</article>
			</section>
		</section>

		<section v-else class="edit-label">
			<button class="back-btn" @click="goBack">
				<img :src="require('@/assets/back-arrow.svg')" alt="" />
			</button>
			<h5 class="title">Name</h5>
			<input
				ref="input"
				type="text"
				placeholder="Set label..."
				v-model="currLabel.title"
				@change="saveLabel"
				@keydown.enter="saveLabel"
			/>
		</section>
	</main>
</template>

<script>
export default {

	data() {
		return {
			editLabelId: null,
			currLabel: null,
			taskLabelsIds: null,
		}
	},
	computed: {
		labels() {
			return this.$store.getters.board.labels
		}
	},
	methods: {
		toggleLabel(labelId) {
			let { taskId, groupId } = this.$route.params

			// Takes params by calc in quick edit mode option
			taskId ??= this.$store.getters.currTask.id
			groupId ??= this.$store.getters.groupIdByTaskId


			// check if already in this task
			// if not - push, if is inside then sfind index and splice
			// if splice then send a remove label from task
			const idx = this.taskLabelsIds.findIndex(lId => lId === labelId)

			if (idx < 0) {
				this.taskLabelsIds.push(labelId)
				this.$store.commit({ type: 'addLabelToTask', labelId, taskId, groupId })
			} else {
				this.taskLabelsIds.splice(idx, 1)
				this.$store.commit({ type: 'removeLabelFromTask', labelId, taskId, groupId })
			}
			this.$store.dispatch({ type: 'saveBoard' })
		},
		onEditLabel(id) {
			this.editLabelId = id
			if (!id) return

			this.currLabel = this.labels.find(l => l.id === id)

			this.$nextTick(() => {
				this.$refs.input.select()
			})
		},
		saveLabel() {
			this.$store.dispatch({ type: 'saveLabels', labels: this.labels })


			this.editLabelId = null
			this.currLabel = null
		},
		goBack() {
			this.editLabelId = null
			this.currLabel = null
		}
	},
	created() {
		this.taskLabelsIds = this.$store.getters.currTask?.labelIds || []
	}
}
</script>
