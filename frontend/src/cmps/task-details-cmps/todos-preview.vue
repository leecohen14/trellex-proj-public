<template>
	<section class="todos-preview">
		<progress-bar :percentage="percentage" />
		<!-- <transition-group
			enter-active-class="animate__animated animate__fadeInRight animate__faster"
			leave-active-class="animate__animated animate__fadeOutRight animate__faster"
		> -->
			<article
				class="todo"
				v-for="(todo, idx) in checklist.todos"
				:key="todo.id"
				@click="editTodo(idx)"
				:style="isEditingStyle(idx)"
			>
				<!-- Show -->
				<template v-if="editingTodoIdx !== idx">
					<input
						class="checkbox"
						type="checkbox"
						:checked="todo.isDone"
						@change.prevent.stop="toggleTodo(idx)"
						@click.stop=""
					/>
					<span class="title" :class="{ linethrough: todo.isDone }">{{
						todo.title
					}}</span>
				</template>

				<!-- Editing todo -->
				<template v-else>
					<el-input
						type="textarea"
						ref="textareaEdit"
						class="textarea"
						:autosize="{ minRows: 1, maxRows: 20 }"
						placeholder="Edit todo..."
						v-model="editingTodo.title"
						@blur="closeEditTodo"
						@keypress.native.prevent.enter="updateTodo"
					></el-input>

					<span class="controls-btns">
						<button class="save-btn" @click.stop="updateTodo">
							Save
						</button>
						<button class="cancel-btn" @click.stop="closeEditTodo">
							<img :src="require('@/assets/cancel-icon.png')" />
						</button>
					</span>
				</template>
			</article>
		<!-- </transition-group> -->

		<!-- Addign todos -->
		<button v-if="!isAddingTodo" @click="openAddTodo">Add an item</button>
		<section v-else class="add-todo-area">
			<el-input
				type="textarea"
				ref="textareaAdd"
				class="textarea"
				:autosize="{ minRows: 1, maxRows: 20 }"
				placeholder="Add todo..."
				v-model="newTodo.title"
				@blur="closeEditTodo"
				@keypress.native.prevent.enter="saveNewTodo"
			>
			</el-input>

			<span class="controls-btns">
				<button class="save-btn" @mousedown.stop.prevent="saveNewTodo">Save</button>
				<button @click="closeAddTodo" class="cancel-btn">
					<img :src="require('@/assets/cancel-icon.png')" />
				</button>
			</span>
		</section>
	</section>
</template>

<script>
import progressBar from '@/cmps/progress-bar.vue'
import { utilService } from '../../services/util.service'

export default {
	props: {
		list: Object,
	},
	data() {
		return {
			isAddingTodo: false,
			newTodo: { title: '', isDone: false },
			editingTodo: null,
			editingTodoIdx: null
		}
	},
	computed: {
		checklist() {
			return JSON.parse(JSON.stringify(this.list))
		},
		percentage() {
			if (!this.checklist.todos.length) return 0

			return Math.round((this.checklist.todos.reduce((acc, t) => {
				if (t.isDone) acc++

				return acc
			}, 0) / this.checklist.todos.length) * 100)
		}
	},
	methods: {
		editTodo(idx) {
			this.editingTodoIdx = idx
			this.editingTodo = JSON.parse(JSON.stringify(this.checklist.todos[idx]))
			this.$nextTick(() => {
				this.$refs.textareaEdit[0].focus()
			})
		},
		closeEditTodo() {
			this.isAddingTodo = false
			this.editingTodoIdx = null
			this.editingTodo = null
		},
		toggleTodo(idx) {
			this.checklist.todos[idx].isDone = !this.checklist.todos[idx].isDone
			this.saveChanges()
		},
		updateTodo() {
			if (!this.editingTodo?.title) this.closeAddTodo()
			const idx = this.checklist.todos.findIndex(t => t.id === this.editingTodo.id)
			if (idx < 0) return

			this.checklist.todos.splice(idx, 1, this.editingTodo)
			this.editingTodo = null
			this.closeEditTodo()
			this.saveChanges()
		},
		saveNewTodo() {
			if (!this.newTodo.title) return

			this.newTodo.id = utilService.makeId()
			this.checklist.todos ??= []

			this.checklist.todos.push(this.newTodo)
			this.zeroNewTodo()

			this.$refs.textareaAdd.focus()

			this.saveChanges()
		},
		openAddTodo() {
			this.isAddingTodo = true
			this.$nextTick(() => {
				this.$refs.textareaAdd.select()
			})
		},
		closeAddTodo() {
			this.isAddingTodo = false
			this.zeroNewTodo()
		},
		zeroNewTodo() {
			this.newTodo = { title: '', isDone: false }
		},
		saveChanges() {
			this.$emit('saveChecklist', this.checklist)
		},
		isEditingStyle(idx){
			if(this.editingTodoIdx === idx) return 'flex-direction: column; align-items: flex-start;'
		}
	},
	components: {
		progressBar,
	},
}
</script>
