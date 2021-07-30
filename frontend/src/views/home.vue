<template>
	<main class="home" @click="closeMenus">
		<section class="hero">
			<!-- <img src="../assets/home/hero.jpg" alt="" /> -->

			<section class="content">
				<h1>Trellex helps teams move work forward</h1>
				<p>
					Collaborate, manage projects, and reach new productivity
					peaks. From high rises to the home office, the way your team
					works is unique—accomplish it all with Trellex.
				</p>
				<button @click="goToBoard">Get started</button>
			</section>
		</section>
		<section class="body">
			<section class="body-content">
				<h1>It’s more than work. It’s a way of working together</h1>
				<p>
					Start with a Trellex board, lists, and cards. Customize and
					expand with more features as your teamwork grows. Manage
					projects, organize tasks, and build team spirit—all in one
					place.
				</p>
				<button @click="goToBoard">Start for free!</button>
			</section>
			<section class="body-details">
				<div>
					<h1>Cards contain everything you need</h1>
					<p>
						Trellex cards are your portal to more organized
						work—where every single part of your task can be
						managed, tracked, and shared with teammates. Open any
						card to uncover an ecosystem of checklists, due dates,
						attachments, conversations, and more.
					</p>
				</div>
				<img class="domore" src="../assets/home/domore.jpg" alt="" />
			</section>
			<section class="body-details">
				<img class="domore" src="../assets/home/team.jpg" alt="" />
				<div>
					<h1>Features to help your team succeed</h1>
					<p>
						Powering a productive team means using a powerful tool
						(and plenty of snacks). From meetings and projects to
						events and goal setting, Trellex’s intuitive features
						give any team the ability to quickly set up and
						customize workflows for just about anything.
					</p>
				</div>
			</section>
		</section>

		<section class="about">
			<h1>Made by</h1>
			<section class="users">
				<div class="user">
					<img src="../assets/profile-imgs/aviv.png" alt="" />
					<h1>Aviv Ben Shahar</h1>
					<section class="btns">
						<a href="https://github.com/Avivbens" target="”_blank”">
							<i class="fab fa-github-square"></i
						></a>
						<a
							href="https://www.linkedin.com/in/aviv-ben-shahar-33583b211/"
							target="”_blank”"
						>
							<i class="fab fa-linkedin"></i
						></a>
					</section>
				</div>
				<div class="user">
					<img src="../assets/profile-imgs/lee.jpg" alt="" />
					<h1>Lee Cohen</h1>
					<section class="btns">
						<a
							href="https://github.com/leecohen14"
							target="”_blank”"
						>
							<i class="fab fa-github-square"></i
						></a>
						<a href="" target="”_blank”">
							<i class="fab fa-linkedin"></i
						></a>
					</section>
				</div>

				<div class="user">
					<img src="../assets/profile-imgs/arthur.jpg" alt="" />
					<h1>Arthur Shtein</h1>
					<section class="btns">
						<a href="https://github.com/Spinier" target="”_blank”">
							<i class="fab fa-github-square"></i
						></a>
						<a
							href="https://www.linkedin.com/in/arthur-shtein-1398111b4/"
						>
							<i class="fab fa-linkedin"></i
						></a>
					</section>
				</div>
			</section>
		</section>
	</main>
</template>

<script>
import { boardService } from '@/services/board.service.js'
import { eventBusService } from "@/services/event-bus.service.js"

export default {
	name: 'home',
	data() {
		return {
		}
	},
	computed: {
		board() {
			return this.$store.getters.board
		}
	},
	methods: {
		async goToBoard() {
			if (this.$store.getters.loggedinUser.fake) await this.guestLogin()
			const boards = await boardService.query()
			if (!boards?.length) return
			this.$router.push(`/board/${boards[0]._id}`)
		},
		async guestLogin() {
			const guest = {
				username: 'guest',
				password: '123456'
			}
			try {
				await this.$store.dispatch({ type: 'login', userCred: guest })
			} catch (error) {
				this.$router.push('/').catch(() => { })
			}
		},
		closeMenus() {
			eventBusService.$emit('closeAllMenus')
		},
	},
}
</script>