<template>
	<main>
		<section v-if="!open" class="side-menu">
			<button class="about-btn">
				<img :src="require('@/assets/boards.svg')" alt="" />
				<!-- <div @click="openMenu(2)" class="inside-about-btn">
					About this board
					<p>Add a description to your board</p>
				</div> -->
				<div class="inside-about-btn">
					<span @click="openMenu(2)">
						About this board
						<span>Add a description to your board</span>
					</span>
				</div>
				<!-- <div>
					<p>Add a description to your board</p>
				</div> -->
			</button>

			<button class="change-bg-btn" @click="openMenu(1)">
				<span class="blue-square"></span>&nbsp
				<span class="text">Change background</span>
			</button>
			<section class="board-activity">
				<div class="activity-title">
					<img :src="require('@/assets/activity.png')" />
					<h3 class="bold-font">Activity</h3>
				</div>
				<section class="activities">
					<article
						class="activity"
						v-for="(activity, idx) in board.activities"
						:key="idx"
					>
						<avatar
							class="user-avatar"
							:size="32"
							:username="activity.byMember.username"
							:src="activity.byMember.imgUrl"
						></avatar>
						<div class="activity-details">
							<span class="">
								<span class="user-fullname bold-font">{{ activity.byMember.fullname }}&nbsp</span>
								{{ activity.txt }}
							</span>
							<span>
								{{ activity.createdAt | moment("from") }}
							</span>
						</div>
					</article>
				</section>
			</section>
		</section>

		<side-menu-background @openMenu="openMenu" v-if="open === 1" />
		<side-menu-about
			@openMenu="openMenu"
			v-if="open === 2"
			@setTitle="setTitle"
		/>
		<side-menu-colors @openMenu="openMenu" v-if="open === 12" />
		<side-menu-photos @openMenu="openMenu" v-if="open === 22" />
	</main>
</template>
<script>
import sideMenuBackground from './side-menu-background.vue'
import sideMenuAbout from './side-menu-about.vue'
import sideMenuColors from './side-menu-colors.vue'
import SideMenuPhotos from './side-menu-photos.vue'
import Avatar from 'vue-avatar'

export default {
	data() {
		return {
			isSideMenuBgOpen: false,
			open: null
		}
	},

	methods: {
		closeMenu() {
			this.$emit("closeMenu")
		},
		openMenu(idx) {
			switch (idx) {
				case 1:
					this.setTitle('Change background')
					break
				case 2:
					this.setTitle('About this board')
					break
				case 3:
					this.setTitle('Search cards')
					break
				case 12:
					this.setTitle('Colors')
					break
				case 22:
					this.setTitle('Photos')
					break
				default:
					this.setTitle('Menu')
					open = null
					break
			}
			this.open = idx
		},
		setTitle(title) {
			this.$emit('setTitle', title)
		}


	},
	computed: {
		board() {
			return this.$store.getters.board
		}
	},
	components: {
		sideMenuBackground,
		sideMenuAbout,
		sideMenuColors,
		SideMenuPhotos,
		Avatar
	},
}
</script>
