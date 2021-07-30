<template>
	<main class="task-title">
		<section>
			<img :src="require('@/assets/hard-drive.svg')" alt="" />
			<main class="title">
				<el-input
					type="textarea"
					class="textarea"
					v-model="title"
					@change="saveTask"
					placeholder="Title"
					ref="input"
					@keydown.native.enter.stop.prevent="saveTask"
				>
				</el-input>
				<span>in list <span class="underline">{{groupName}}</span></span>
			</main>
		</section>
	</main>
</template>

<script>
export default {
	props: {
		task: Object
	},
	data() {
		return {
			title: '',
			isEditing: false
		}
	},
	methods: {
		saveTask() {
			this.task.title = this.title
			this.$emit('saveTask', this.task)

			this.$nextTick(() => {
				this.$refs.input.blur()
			})
		},
	},
	computed:{
		groupName() {
			const {groupId} = this.$route.params
			const group = this.$store.getters.board.groups.find(g => g.id === groupId)
			return group.title
		}
	},
	created() {
		this.title = this.task.title
	}
}
</script>
