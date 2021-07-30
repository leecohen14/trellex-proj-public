<template>
	<section class="invite-menu">
		<section class="invite-menu-header">
			<h1>Invite to board</h1>
			<button @click.prevent="closeMenu">
				<img :src="require('@/assets/cancel-icon.png')" />
			</button>
		</section>
		<main>
			<el-select
				class="element-input"
				v-model="selectedMembers"
				multiple
				placeholder="Choose user to add"
			>
				<el-option
					v-for="member in members"
                    :member="member"
					:key="member._id"
                    :value="member.fullname"
				>
				</el-option>
			</el-select>

			<button @click.prevent="sendInvite">Send invitation</button>
		</main>
	</section>
</template>

<script>
export default {
    data(){
        return{
            selectedMembers: []
        }
    },

	methods: {
		closeMenu() {
			this.$emit('closeMenu')
		},
		sendInvite() {
			console.log('Ready for mazgan...')
			this.closeMenu()
		}
	},
	computed: {
		members() {
			return this.$store.getters.board?.members || []
		}
	}
}
</script>

<style>
</style>