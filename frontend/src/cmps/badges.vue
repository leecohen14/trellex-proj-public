<template>
	<main v-if="task" class="badges">
		<section v-if="task.members" class="watching-badge">
			<img
				:src="require('@/assets/badges/watching.png')"
				alt=""
				title="You are watching this card"
			/>
		</section>
		<section
			v-if="task.dueDate"
			class="due-later-badge"
			:class="dueDateClass"
			@click.stop.prevent="toggleIsDone"
		>
			<img
				:src="require('@/assets/badges/clock.png')"
				alt="Due Date"
				title="This card is due later"
			/>
			<!-- <i class="icon-clock"> </i> -->

			<template v-if="task.dueDate.length < 2">{{ task.dueDate[0] | moment("MMM D") }}</template>
			<template v-else>{{ task.dueDate[1] | moment("MMM D") }}</template>
		</section>
		<section v-if="task.description" class="desc-badge">
			<img
				:src="require('@/assets/badges/align-left.svg')"
				alt=""
				title="This card has a description"
			/>
		</section>
		<section v-if="task.comments" class="comments-badge">
			<img
				:src="require('@/assets/badges/comments.png')"
				alt="comments"
				title="Comments"
			/>
			{{ task.comments.length }}
		</section>
		<section v-if="isAttachments" class="attach-badge">
			<img
				:src="require('@/assets/badges/attachment.svg')"
				alt="attachment"
				title="Attachments"
			/>
			{{ isAttachments }}
		</section>
		<section
			v-if="task.checklists && todosCounters.todosCounter"
			class="checklist-badge"
			:class="{
				'done-checklist':
					todosCounters.isDoneCounter === todosCounters.todosCounter,
			}"
		>
			<img
				:src="require('@/assets/badges/checklist.svg')"
				alt=""
				title="Checklist items"
			/>
			{{ todosCounters.isDoneCounter }}/{{ todosCounters.todosCounter }}
		</section>
	</main>
</template>

<script>

export default {
	props: {
		task: Object,
	},
	data() {
		return {
		}
	},

	computed: {
		isCheckLists() {
			return this.task.checklists?.todos
		},

		todosCounters() {
			const counters = { todosCounter: 0, isDoneCounter: 0 }
			this.task.checklists.forEach(cl => {
				counters.isDoneCounter += cl.todos.reduce((acc, todo) => {
					counters.todosCounter++
					if (todo.isDone) acc++
					return acc
				}, 0)
			})
			return counters
		},

		isAttachments() {
			return this.task?.attachments?.length
		},

		calculateTime() {
			const currTime = +Date.now()
			const targetTime = this.task.dueDate?.[this.task.dueDate?.length - 1]
			const targetTimeStemp = +new Date(targetTime).getTime()

			const day = 1000 * 60 * 60 * 24
			const diff = targetTimeStemp - currTime
			let result = -1

			if (diff < day) result = 1
			if (diff < 0) result = 0
			else if (diff > day) result = 2

			return result
		},
		dueDateClass() {
			const calcTime = (this.task.isDueDateDone) ? -1 : this.calculateTime
			return {
				'due-date-done': this.task.isDueDateDone,
				'due-date-soon': calcTime === 1,
				'due-date-late': calcTime === 0
			}
		},
	},
	methods: {
		toggleIsDone() {
			this.task.isDueDateDone = !this.task.isDueDateDone
			this.$store.commit({ type: 'getGroupIdByTaskId', taskId: this.task.id })
			const groupId = this.$store.getters.groupIdByTaskId

			this.$store.dispatch({ type: 'saveTask', groupId, taskToSave: this.task })
		}
	}
}
</script>

<style>
</style>