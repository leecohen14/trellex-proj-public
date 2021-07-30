<template>
	<main v-if="members" class="badges-members">
		<avatar
				class="sum-img"
				:size="28"
				:rounded="true"
				:username="member.username"
				:src="member.imgUrl"
				v-for="member in members"
				:key="member._id"
			></avatar>
	</main>
</template>

<script>
import Avatar from 'vue-avatar'

export default {

	props: {
		task: Object,
	},
    computed: {
        members(){
            return this.task.members
        }
    },
	components: {
        Avatar
    },
};
</script>

<style>
</style>