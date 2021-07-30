<template>
	<section class="side-menu-about">
		<button class="back-btn" @click="openMenu(null)">
			<img :src="require('@/assets/back-arrow.svg')" alt="" />
		</button>
		<div class="board-admins">
			<div class="board-admins-header">
				<img
					:src="
						require('@/assets/details-side-bar-icons/Members-menu.svg')
					"
				/>
				<h1>Board admins</h1>
			</div>
			<p>Here will be our admins</p>
		</div>

		<div class="desc-container">
			<div class="desc-header">
				<img :src="require('@/assets/align-left.svg')" alt="" />
				<h1>Description</h1>
			</div>

			<el-input
				type="textarea"
				class="textarea-desc"
				:autosize="{ minRows: 1, maxRows: 20 }"
				placeholder="It's your board's time to shine! Let people know what this board is used for and what they can excpect to see."
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
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			desc: '',
			isEditing: null
		}
	},
	methods: {
		saveDesc() {
			this.closeIsEditing()
			// this.task.description = this.desc
			this.$emit('saveTask', this.task)
		},
		openIsEditing() {
			this.isEditing = 'editing'
		},
		closeIsEditing() {
			this.isEditing = null
		},
		closeMenu() {
			this.$emit('event name', variable)
		},
		openMenu(idx) {
			this.$emit('openMenu' , idx)
		}
	},
}
</script>

<style>
</style>