<template>
	<section class="task-summary-details" v-if="task">
		<members-summary
			v-if="task.members && task.members.length"
			:members="task.members"
		/>
		<labels-summary
			v-if="task.labelIds && task.labelIds.length"
			:labelIds="task.labelIds"
		/>
		<date-summary @toggleIsDone="toggleIsDone" v-if="task.dueDate" :dueDate="task.dueDate" :isDueDateDone="task.isDueDateDone" />
	</section>
</template>

<script>
import membersSummary from "./members-summary.vue"
import labelsSummary from "./labels-summary.vue"
import dateSummary from "./date-summary.vue"

export default {
	name: "task-summary-details",

	computed: {
		task() {
			return this.$store.getters.currTask
		}
	},
	components: {
		membersSummary,
		labelsSummary,
		dateSummary,
	},
	methods: {
		toggleIsDone(val){
			const {groupId} = this.$route.params
			this.task.isDueDateDone  = val
			this.$store.dispatch({type: 'saveTask', groupId, taskToSave: this.task})

		}
	}
};
</script>


