<template>
	<section class="date-summary">
		<h3>DUE DATE</h3>
		<div>
			<input 
			v-model="isDone" 
			@change="toggleIsDone"	
			type="checkbox" />
			
			<span class="date-display" v-if="date.length === 1">
				{{ date[0] | moment("MMM D") }}
			</span>
			<span v-else class="date-display">
				{{ date[0] | moment("MMM D") }}
				to {{ date[1] | moment("MMM D") }}
			</span>
			<span class="completed" v-if="isDone"> COMPLETE </span>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		dueDate: Array,
		isDueDateDone: Boolean,
	},
	data() {
		return {
			isDone: this.isDueDateDone ?? false
		}
	},
	computed: {
		date() {
			return this.dueDate
		},
	},
	methods: {
		toggleIsDone(){
			this.$emit('toggleIsDone', this.isDone)
		}
	}
};
</script>

Date.now 