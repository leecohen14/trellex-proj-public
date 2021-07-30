<template>
	<section v-if="members" class="members-menu">
		<input type="text" placeholder="Search members..." />

		<h4>BOARD MEMBERS</h4>
		<article
			class="user"
			v-for="member in members"
			@click="toggleMember(member)"
		>
			<img class="user-img" :src="member.imgUrl" alt="" />
			<span>
				{{ member.fullname }} <span>&nbsp({{ member.username }})</span>

				<span
					class="check"
					v-if="taskMembers.find((m) => m._id === member._id)"
					><i class="fas fa-check"></i
				></span>
			</span>
		</article>
	</section>
</template>

<script>
export default {
	data() {
		return {
			taskMembers: null
		}
	},
	computed: {
		members() {
			return this.$store.getters.members
		},
	},
	methods: {
		toggleMember(member) {
			let { taskId, groupId } = this.$route.params

			// Takes params by calc in quick edit mode option
			taskId ??= this.$store.getters.currTask.id
			groupId ??= this.$store.getters.groupIdByTaskId


			const idx = this.taskMembers.findIndex(m => m._id === member._id)

			const activity = {
				txt: '',
				createdAt: Date.now(),
				byMember: this.$store.getters.loggedinUser || {
					_id: "u1",
					username: "Guest",
					fullname: "Guest User",
					imgUrl: "https://i.imgur.com/8OP4tm2.png"
				},
			}
			if (idx < 0) {
				this.taskMembers.push(member)
				this.$store.commit({ type: 'joinMemberToTask', member, taskId, groupId })
				activity.txt = `Added ${member.fullname}`
				this.$store.commit({ type: 'pushTaskActivity', taskId, groupId, activity })
			} else {
				this.taskMembers.splice(idx, 1)
				this.$store.commit({ type: 'removeMemberFromTask', member, taskId, groupId })


				activity.txt = `Removed ${member.fullname}`
				this.$store.commit({ type: 'pushTaskActivity', taskId, groupId, activity })
			}
			this.$store.dispatch({ type: 'saveBoard' })
		}
	},
	created() {
		this.taskMembers = this.$store.getters.currTask?.members || []
	}

}
</script>
