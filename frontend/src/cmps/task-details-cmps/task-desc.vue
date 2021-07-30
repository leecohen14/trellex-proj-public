<template>
	<section class="task-description">
		<head>
			<img :src="require('@/assets/align-left.svg')" alt="" />
			<h3>Description</h3>
		</head>
		<!-- <textarea
			v-model="desc"
			@changed="saveDesc"
			name=""
			id=""
			cols="30"
			rows="10"
			placeholder="Add a more detailed description"
		></textarea> -->
		<el-input
			type="textarea"
			class="textarea"
			:autosize="{ minRows: 1, maxRows: 20 }"
			placeholder="Add a more detailed description"
			v-model="desc"
			@changed="saveDesc"
			@focus="openIsEditing"
			@blur="closeIsEditing"
		>
		</el-input>

		<transition
			enter-active-class="animate__animated animate__fadeIn animate__faster"
			leave-active-class="animate__animated animate__fadeOut animate__faster"
		>
			<span v-if="isEditing" class="controls-btns">
				<button class="save-btn" @mousedown="saveDesc">Save</button>
				<button class="cancel-btn">
					<img :src="require('@/assets/cancel-icon.png')" />
				</button>
			</span>
		</transition>
		<!-- <button @click="toggleIsEditing">X</button> -->
	</section>
</template>

<script>
export default {
	props: {
		task: Object
	},
	data() {
		return {
			desc: '',
			isEditing: null
		}
	},
	methods: {
		saveDesc() {
			this.closeIsEditing()
			this.task.description = this.desc
			this.$emit('saveTask', this.task)
		},
		openIsEditing() {
			this.isEditing = 'editing'
		},
		closeIsEditing() {
			this.isEditing = null
		}
	},
	created() {
		this.desc = this.task.description
	}
}
</script>