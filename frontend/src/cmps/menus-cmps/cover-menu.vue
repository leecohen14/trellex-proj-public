<template>
	<main class="cover-menu">
		<section class="size">
			<h5>Size</h5>

			<div class="buttons">
				<!-- helf -->
				<div
					role="button"
					class="isvr-Reb94vq0g c2K-XOKpsarOtb _2pFmKTmyH7T3W8"
					:class="isHalfCover"
					@click="selectSize(false)"
				>
					<div class="_28YCxuL0b0PLJg fill-by" :style="currBgc"></div>
					<div class="_2_NkiO6b3w-TwP">
						<div class="_3zyygYjXmBCuZ8"></div>
						<div class="_2YkoNjZbIBZjxA"></div>
						<div class="_3KUp4qsMp7f0nZ">
							<div class="_2TkMxnIj6-MZD9"></div>
							<div class="_2TkMxnIj6-MZD9"></div>
						</div>
						<div class="_3K8WSoeRLtPYZP"></div>
					</div>
				</div>

				<!-- full -->
				<div
					role="button"
					class="isvr-Reb94vq0g _3bvxiZCqVvPKiY _2pFmKTmyH7T3W8 fill-by"
					:style="currBgc"
					:class="isFullCover"
					@click="selectSize(true)"
				>
					<div class="_2_NkiO6b3w-TwP _2qTikuv_YOAV-C">
						<div class="_3zyygYjXmBCuZ8"></div>
						<div class="_2YkoNjZbIBZjxA"></div>
						<div class="_3KUp4qsMp7f0nZ">
							<div class="_2TkMxnIj6-MZD9"></div>
							<div class="_2TkMxnIj6-MZD9"></div>
						</div>
						<div class="_3K8WSoeRLtPYZP"></div>
					</div>
				</div>
			</div>
		</section>
		<button v-if="hasCover" class="remove-cover-btn" @click="removeCover">
			Remove cover
		</button>
		<section class="colors">
			<h5>Colors</h5>
			<div>
				<div
					v-for="(color, idx) in colors"
					:key="idx"
					class="color"
					:style="'background-color: ' + color"
					@click="selectColor(idx)"
				></div>
			</div>
		</section>
		<section class="attachments">
			<h5>attachments</h5>
			<div v-if="currTask.attachments">
				<div
					v-for="(attachment, idx) in currTask.attachments"
					:key="idx"
					class="attachment"
					:style="
						`background-image: url('${attachment.fileUrl}'); background-size:cover; background-position: center;`
					"
					@click="selectImg(idx)"
				></div>
			</div>
			<label class="upload-cover-btn"
				>Upload a cover image
				<input
					type="file"
					ref="file"
					multiple
					@change="onFilePicked"
					hidden
				/>
			</label>
		</section>
	</main>
</template>

<script>
import { utilService } from '../../services/util.service'

export default {
	data() {
		return {
			colors: [
				'#7BC86C',
				'#F5DD29',
				'#FFAF3F',
				'#EF7564',
				'#CD8DE5',
				'#5BA4CF',
				'#29CCE5',
				'#6DECA9',
				'#FF8ED4',
				'#172B4D',
			],
			attachments: []
		}
	},
	computed: {
		currTask() {
			return this.$store.getters.currTask
		},
		currBgc() {
			// if (!this.currTask) return null
			// if (!this.currTask?.cover?.bgColor) return ''
			// return 'background-color: ' + this.currTask.cover.bgColor + '; opacity:.7;'
			if (!this.currTask) return null
			if (this.currTask?.cover?.bgColor) return 'background-color: ' + this.currTask.cover.bgColor + '; opacity:.7;'
			if (this.currTask?.cover?.bgUrl)
				return `background-color: transparent ';
					background-image: url('${this.currTask.cover.bgUrl}');
					background-size:cover; background-position:center;
					opacity:1;`

			return null
		},
		isFull() {
			if (!this.currTask) return null

			return this.currTask.cover.isFull
		},
		hasCover() {
			if (!this.currTask) return false
			if (this.currTask?.cover?.bgColor || this.currTask?.cover?.bgUrl) return true
			return false
		},
		isHalfCover() {
			const cover = this.currTask.cover
			if (!cover) return
			if (!cover.isFull && (cover.bgColor || cover.bgUrl)) return 'selected-size'
			return ''
		},
		isFullCover() {
			const cover = this.currTask.cover
			if (!cover) return
			if (cover.isFull) return 'selected-size'
			return ''
		}
	},
	methods: {
		selectColor(idx) {
			if (!this.currTask) return
			let { groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId

			const cover = { isFull: false, bgColor: this.colors[idx], bgUrl: '' }
			this.$store.commit({ type: 'changeTaskCover', groupId, taskId: this.currTask.id, cover })
			this.$store.dispatch({ type: 'saveBoard' })
		},
		selectImg(idx) {
			if (!this.currTask) return
			let { groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId

			const cover = { isFull: false, bgColor: '', bgUrl: this.currTask.attachments[idx].fileUrl }
			this.$store.commit({ type: 'changeTaskCover', groupId, taskId: this.currTask.id, cover })
			this.$store.dispatch({ type: 'saveBoard' })
		},
		selectSize(size) {
			if (!this.currTask) return
			let { groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId

			const cover = { isFull: size, bgColor: this.currTask.cover.bgColor, bgUrl: this.currTask.cover.bgUrl }
			this.$store.commit({ type: 'changeTaskCover', groupId, taskId: this.currTask.id, cover })
			this.$store.dispatch({ type: 'saveBoard' })
		},
		removeCover() {
			if (!this.currTask) return
			let { groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId

			const cover = { isFull: false }
			this.$store.commit({ type: 'changeTaskCover', groupId, taskId: this.currTask.id, cover })
			this.$store.dispatch({ type: 'saveBoard' })
		},
		onFilePicked() {
			const file = event.target.files[0]
			const fileReader = new FileReader()
			const attachment = {
				id: utilService.makeId(),
				fileName: file.name,
				createdAt: Date.now(),
				// byMember: this.$store.getter.loggedInUser,
				byMember: {
					_id: "u101",
					username: "Lee",
					fullname: "Lee Cohen",
					imgUrl: "https://i.imgur.com/D4VUwSp.png"
				},
				fileUrl: ''
			}
			fileReader.onload = () => {
				attachment.fileUrl = fileReader.result
				this.attachments.push(attachment)
				this.saveAttachments()
			}
			fileReader.readAsDataURL(file)
		},
		saveAttachments() {
			const { taskId, groupId } = this.$route.params
			groupId ??= this.$store.getters.groupIdByTaskId
			const taskToSave = this.$store.getters.currTask
			taskToSave.cover ??= { isFull: false }
			taskToSave.cover.bgUrl = this.attachments[0].fileUrl
			taskToSave.cover.bgColor = ''
			taskToSave.attachments ??= []
			taskToSave.attachments = taskToSave.attachments.concat(this.attachments)
			this.$store.commit({ type: 'saveTask', groupId, taskToSave })
			this.$store.dispatch({ type: 'saveBoard' })
		}
	},
}
</script>

<style>
</style>