<template>
	<section class="task-activities">
		<div>
			<img :src="require('@/assets/activity.png')" />
			<h3>Activity</h3>
		</div>

		<!-- Add Comment -->
		<div class="add-comment">
			<avatar
				class="user-avatar"
				:size="32"
				:username="'Lee Cohen'"
				:src="'@/assets/profile-imgs/lee.jpg'"
			></avatar>

			<main :class="border" @click="openIsCommentOpen">
				<el-input
					type="textarea"
					class="textarea"
					ref="comment"
					:autosize="{ minRows: 1, maxRows: 20 }"
					@keydown.native.enter.stop.prevent="saveComment"
					placeholder="Write a comment..."
					v-model="comment"
					@blur="closeCommentOpen"
				>
				</el-input>

				<div
					v-if="isCommentOpen"
					class="controllers"
					@mousedown.prevent=""
				>
					<button class="save-btn" @mousedown.prevent="saveComment">
						Save
					</button>
					<button
						class="attachment-btn"
						@mousedown.prevent="attachment"
					>
						<img
							:src="
								require('@/assets/details-side-bar-icons/Attachment-menu.svg')
							"
						/>
					</button>
				</div>
			</main>
		</div>

		<!-- Comments -->
		<article class="comment" v-for="comment in task.comments">
			<avatar
				class="user-avatar"
				:size="32"
				:username="comment.byMember.username"
				:src="comment.byMember.imgUrl"
			></avatar>

			<div class="comment-container">
				<p>
					<span class="user-fullname"
						>{{ comment.byMember.fullname }} &nbsp</span
					>
					<span>{{ comment.createdAt | moment("from") }}</span>
				</p>
				<div class="comment-box">
					{{ comment.txt }}
				</div>
			</div>
		</article>

		<!-- Activities -->
		<article class="activities" v-for="activity in task.activities">
			<avatar
				class="user-avatar"
				:size="32"
				:username="activity.byMember.username"
				:src="activity.byMember.imgUrl"
			></avatar>
			<span class="user-fullname">
				{{ activity.byMember.fullname }} &nbsp
			</span>
			<span>
				{{ activity.txt }}
				{{ activity.createdAt | moment("from") }}
			</span>
		</article>
	</section>
</template>

<script>
import { utilService } from '../../services/util.service.js'
import { eventBusService } from '../../services/event-bus.service.js'
import Avatar from 'vue-avatar'

export default {
	props: {
		task: Object
	},
	data() {
		return {
			comment: '',
			isCommentOpen: null
		}
	},
	computed: {
		border() {
			if (this.isCommentOpen) return 'border'
			else return ''
		}
	},
	methods: {
		openIsCommentOpen() {
			this.isCommentOpen = true
			this.$refs.comment.focus()
		},
		closeCommentOpen() {
			console.log('closing')
			this.isCommentOpen = null
		},
		attachment() {
			console.log('open attachment')
		},
		saveComment() {
			console.log(this.comment, 'commenting...')
			const comment = {
				id: utilService.makeId(), //add here make id from utils
				txt: this.comment,
				createdAt: Date.now(),
				byMember: { // later will be getter from user store
					_id: 'u101',
					username: 'Lee',
					fullname: 'Lee Cohen',
					imgUrl: 'https://i.imgur.com/D4VUwSp.png'
				}
			}
			this.task.comments ??= []
			this.task.comments.unshift(comment)
			this.closeCommentOpen()
			this.comment = ''
			this.$emit('saveTask', this.task)

			this.$nextTick(() => {
				this.$refs.comment.blur()
			})
		},
		focusCommentForFile(fileName) {
			this.$refs.comment.focus()
			this.comment += fileName
		}

	},
	created() {
		eventBusService.$on('focusOnComment', this.focusCommentForFile)
	},
	components: {
		Avatar,
	},
}
</script>
