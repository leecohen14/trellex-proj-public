<template>
	<div class="members-summary" @click.stop="">
		<h3 class="sum-h">MEMBERS</h3>

		<section class="members-imgs" v-if="members && members.length">
			<avatar
				class="sum-img"
				:size="32"
				:rounded="true"
				:username="member.username"
				:src="member.imgUrl"
				v-for="member in members"
				v-if="
					taskMembers && taskMembers.some(m => m._id === member._id)
				"
				:key="member._id"
			></avatar>
			<button @click="toggleMembersMenu" class="add-member">
				<img :src="require('@/assets/add.svg')" alt="" />
			</button>
		</section>
		<basic-menu
			class="menu"
			@closeMenu="toggleMembersMenu"
			v-if="menuIsOpen"
			:title="menuTitle"
		>
			<members-menu @closeMenu="menuIsOpen = false" />
		</basic-menu>
	</div>
</template>

<script>
import basicMenu from '../basic-menu.vue'
import membersMenu from '../menus-cmps/members-menu.vue'

import Avatar from 'vue-avatar'

export default {
	data() {
		return {
			// taskMembers: null,
			menuTitle: "Members",
			menuIsOpen: false,
		}
	},
	computed: {
		members() {
			return this.$store.getters.members
		},
		taskMembers() {
			return this.$store.getters.currTask.members
		}
	},
	methods: {
		toggleMembersMenu() {
			this.menuIsOpen = !this.menuIsOpen
			console.log('Opening Members Modal ...')
		}
	},
	created() {
		// this.taskMembers = this.$store.getters.currTask.members 
	},
	components: {
		basicMenu,
		membersMenu,


		Avatar
	}
};
</script>