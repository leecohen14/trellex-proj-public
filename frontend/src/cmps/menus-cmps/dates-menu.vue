<template>
	<section class="date-menu">
		<date-picker
			:inline="true"
			v-model="time"
			:range="isRange"
			:value-type="'format'"
		>
		</date-picker>
		<section class="btns">
			<label>
				<input v-model="isRange" type="checkbox" />
				<h5>Choose range</h5>
			</label>

			<button @click="saveDate" class="save-btn">Save</button>
			<button @click="removeDate" class="remove-btn">Remove</button>
		</section>
	</section>
</template>

<script>
import DatePicker from "vue2-datepicker"
import "vue2-datepicker/index.css"

export default {
	data() {
		return {
			isRange: false,
			time: null,
		}
	},
	methods: {
		saveDate() {
			// Takes params by calc in quick edit mode option
			let { groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId

			if (typeof this.time === 'string') this.time = [this.time]
			const currTask = this.$store.getters.currTask
			currTask.dueDate = this.time
			this.$store.dispatch({ type: "saveTask", groupId, taskToSave: currTask, })
			this.closeMenu()
		},
		closeMenu() {
			this.$emit("closeMenu")
		},

		removeDate(){
			console.log('IN');
			let { groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId

			const currTask = this.$store.getters.currTask
			currTask.dueDate = ''
			this.$store.dispatch({ type: "saveTask", groupId, taskToSave: currTask, })
			this.closeMenu()
		}
	},
	components: {
		DatePicker
	},
};
</script>
