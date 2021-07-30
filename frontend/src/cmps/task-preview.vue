<template>
	<section v-if="task" class="task-preview" :class="coverType" ref="task">
		<div
			v-if="cover && cover.isFull"
			:style="coverStyle"
			:class="coverClass"
		>
			<button class="edit-btn header" @mousedown.stop="setTaskQuickEdit">
				<img
					class="edit-img"
					:src="require('@/assets/edit.gif')"
					alt=""
				/>
			</button>
			<span class="title bold-font">{{ task.title }}</span>
		</div>
		<template v-else>
			<div
				v-if="cover && !cover.isFull && cover.bgUrl"
				class="half-cover img"
				:style="coverStyle"
			></div>
			<div
				v-if="cover && !cover.isFull && cover.bgColor"
				class="half-cover color"
				:style="coverStyle"
			></div>

			<div v-if="labelsExist" class="labels-container">
				<task-label-preview
					v-for="label in currLabels"
					:key="label.id"
					:label="label"
					:isLabelsOpen="isLabelsOpen"
					@toggleLabels="toggleLabels"
				/>
			</div>
			<p class="task-title">
				{{ task.title }}
			</p>

			<div
				class="media-preview"
				v-if="task.media"
				:class="{ video: task.media.type === 'video' }"
			>
				<video controls width="250" class="media-controller">
					<source :src="task.media.url" type="video/webm" />
					Sorry, your browser doesn't support embedded videos.
				</video>
			</div>
			<button class="edit-btn" @mousedown.stop="setTaskQuickEdit">
				<img
					class="edit-img"
					:src="require('@/assets/edit.gif')"
					alt=""
				/>
			</button>
			<div class="all-badges" v-if="hasBadges">
				<badges :task="task" />
				<badges-members :task="task" />
			</div>
		</template>
		<task-quick-edit
			v-if="isTaskQuickEdit === task.id && isBlack"
			:task="task"
			:groupId="groupId"
			@click.native.stop=""
		/>
	</section>
</template>

<script>
import taskQuickEdit from "./task-quick-edit.vue"
import taskLabelPreview from "./task-label-preview.vue"
import badges from "./badges.vue"
import badgesMembers from "./badges-members.vue"

export default {
	name: "task-preview",
	props: {
		task: Object,
		groupId: String,
	},
	computed: {
		currLabels() {
			const labels = this.$store.getters.labels
			const ls = []
			if (!this.task?.labelIds) return
			this.task.labelIds.forEach((id) => {
				const nl = labels.find((l) => l.id === id)
				if (nl) ls.push(nl)
			})
			return ls
		},

		isLabelsOpen() {
			return this.$store.getters.isLabelsOpen
		},
		isBlack() {
			return this.$store.getters.isBlack
		},
		isTaskQuickEdit() {
			return this.$store.getters.isTaskQuickEdit
		},
		labelsExist() {
			return this.task.labelIds?.length
		},
		cover() {
			return this.task.cover
		},
		coverStyle() {
			const cover = this.task.cover
			if (cover.bgColor) {
				const style = `background-color:${cover.bgColor}`
				return style
			} else if (cover.bgUrl) {
				// const style = `background-image: url('${cover.bgUrl}';  background-size:cover;)`
				const style = `background-image: url('${cover.bgUrl}');  background-size:cover; background-position:center;`
				return style
			}
		},
		coverClass() {
			const cover = this.task.cover
			// return (cover.bgColor) ? 'full-cover color full' : 'full-cover img full'
			return (cover.bgColor) ? 'full-cover color' : 'full-cover img'
		},
		coverType() {
			const cover = this.task.cover
			if (cover?.isFull) {
				return (cover?.bgColor) ? 'full-cover color ' : 'full-cover img '
			} else if (cover?.bgColor) {
				return 'half-cover color'
			} else {
				return (cover?.bgUrl) ? 'half-cover img ' : ''
			}
		},
		hasBadges() {
			return this.task.members?.length || this.task.dueDate?.length || this.task.comments?.length || this.task.checklists?.length || this.task.attachments?.length
		}
	},
	methods: {
		setTaskQuickEdit(ev) {
			const id = id ? null : this.task.id
			const type = id ? "openBlack" : "closeBlack"
			this.$store.commit({ type })
			this.$store.commit({ type: "setTaskQuickEdit", id })


			// Calc position by elemet offSet
			const offSet = this.getOffset(this.$refs.task)
			const width = window.innerWidth
			const height = window.innerHeight

			let tClass = ''
			if (offSet.left > width - 450 && width > 500) {
				offSet.left -= 200
				tClass = 'reverse'
			}

			this.$nextTick(() => {
				const el = document.querySelector('.quick-edit-menu')
				if (!el) return
				if (offSet.top > height - 270) {
					el.classList.add('low')
					offSet.top -= 230
				}
				el.style.left = offSet.left + 'px'
				el.style.top = offSet.top + 'px'
				if (tClass) el.classList.add(tClass)
			})

			// Calc where quick edit menu should be
			// const pos = ev.clientX
			// const width = window.innerWidth
			// let target = 500
			// let tClass = ''
			// if (pos > width - 250) {
			// 	target = pos - 440
			// 	tClass = 'reverse'
			// } else {
			// 	target = pos - 230
			// }
			// this.$nextTick(() => {
			// 	const el = document.querySelector('.quick-edit-menu')
			// 	if (!el) return
			// 	el.style.left = target + 'px'
			// 	if (tClass) el.classList.add(tClass)
			// })
		},
		toggleLabels() {
			let nextPos
			switch (this.isLabelsOpen) {
				case -1:
					nextPos = 2
					break
				case 1:
					nextPos = 0
					break
			}
			this.$store.commit({ type: 'toggleLabelsIsOpen', position: nextPos })
			setTimeout(() => {
				this.$store.commit({ type: 'toggleLabelsIsOpen', position: (nextPos - 1) })
				this.$store.dispatch({ type: 'saveBoard' })
			}, 450)
		},

		// -----------------
		getOffset(el) {
			const rect = el.getBoundingClientRect()
			return {
				left: rect.left + window.scrollX,
				top: rect.top + window.scrollY
			}
		}
	},
	components: {
		taskQuickEdit,
		taskLabelPreview,
		badges,
		badgesMembers,
	},
};
</script>