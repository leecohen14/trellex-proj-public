<template>
	<section class="attachment-menu" v-loading="loading">
		<main>
			<label>
				<h5>Computer</h5>
				<input
					type="file"
					ref="file"
					multiple
					@change="saveToCloud"
					hidden
				/>
			</label>
			<h5>
				Trellex
				<span
					><img
						class="lock"
						:src="require('@/assets/lock.svg')"
						alt=""
				/></span>
			</h5>
			<h5>
				Google Drive
				<span
					><img
						class="lock"
						:src="require('@/assets/lock.svg')"
						alt=""
				/></span>
			</h5>
			<h5>
				Dropbox
				<span
					><img
						class="lock"
						:src="require('@/assets/lock.svg')"
						alt=""
				/></span>
			</h5>
			<h5>
				Box
				<span
					><img
						class="lock"
						:src="require('@/assets/lock.svg')"
						alt=""
				/></span>
			</h5>
			<h5>
				oneDrive
				<span
					><img
						class="lock"
						:src="require('@/assets/lock.svg')"
						alt=""
				/></span>
			</h5>
		</main>
		<div class="link-upload">
			<p class="bold-font">Attach a link</p>
			<input
				type="text"
				v-model="imgLink"
				placeholder="Paste any link here..."
			/>
			<button @click="saveAttachments(imgLink)">Attach</button>
		</div>
		<div class="tips">
			Tip: With <span class="underline">Power-Ups</span>, you can attach
			conversations from Slack, pull requests from GitHub, and leads from
			Salesforce.
		</div>
	</section>
</template>

<script>
import basicMenu from '@/cmps/basic-menu.vue'
import { utilService } from '../../services/util.service'
import axios from 'axios'

export default {
	data() {
		return {
			cloudinary: {
				apiKey: '344625452339553',
				cloudName: 'avivcloud'
			},
			loading: false,

			currTask: null,
			imgLink: '',
			attachments: []
		}
	},
	computed: {
		clURL() {
			return `https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/image/upload`
		}
	},
	methods: {
		saveToCloud() {
			this.loading = true
			const formData = new FormData()
			formData.append('file', event.target.files[0])
			formData.append('upload_preset', 'piahypd8')

			// For debug purpose only
			// Inspects the content of formData
			axios.post(this.clURL, formData)
				.then(res => {
					this.saveAttachments(res.data.secure_url)
				})
				.catch(() => {
					this.loading = false
				})
		},
		saveAttachments(imgLink = null) {
			if (imgLink === '') return
			if (imgLink) {
				const attachment = {
					id: utilService.makeId(),
					fileName: `no name`,
					createdAt: Date.now(),
					// byMember: this.$store.getter.loggedInUser,
					byMember: {
						_id: "u101",
						username: "Lee",
						fullname: "Lee Cohen",
						imgUrl: "https://i.imgur.com/D4VUwSp.png"
					},
					fileUrl: imgLink
				}
				this.attachments.push(attachment)
				this.loading = false
			}
			const { taskId, groupId } = this.$route.params
			this.$store.commit({ type: 'addAttachments', attachments: this.attachments, taskId, groupId })
			this.$store.dispatch({ type: 'saveBoard' })
			this.$emit('closeMenu')
		},
		// !unused
		onFilePicked() {
			const formData = new FormData()
			const file = event.target.files[0]
			const fileReader = new FileReader()
			const attachment = {
				id: utilService.makeId(),
				fileName: file.name,
				createdAt: Date.now(),
				byMember: this.$store.getter.loggedInUser || {
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
	},
	components: {
		basicMenu,
	},
	created() {
		this.currTask = this.$store.getters.currTask
	}

}
</script>