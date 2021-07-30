<template>
	<section class="create-board">
		<main>
			<div class="create-main-area" :style="bgStyle">
				<div class="blackBg" :style="blackBgStyle">
					<el-input
						class="title-input"
						type="text"
						placeholder="Add board title"
						v-model="board.title"
					>
					</el-input>
					<span class="username">
						<i class="fas fa-user-circle" />
						{{ user.fullname }}</span
					>
				</div>
			</div>
			<div class="bgs-container">
				<div
					v-for="(bg, idx) in bgs"
					:key="idx"
					class="bg-card"
					:style="cardBgStyle(idx)"
					@click="changeBgStyle(idx)"
				></div>
			</div>
		</main>

		<button class="create-btn" @click="createBoard">Create board</button>
	</section>
</template>

<script>
export default {
	data() {
		return {
			board: {
				title: '',
				style: { bgUrl: "https://images.unsplash.com/photo-1587502624372-45627391a31f?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MXwxfHNlYXJjaHwxfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85", bgColor: '' }
			},
			bgs: [
				{ bgUrl: "https://images.unsplash.com/photo-1587502624372-45627391a31f?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MXwxfHNlYXJjaHwxfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85", bgColor: '' },
				{ bgUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwyfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85", bgColor: '' },
				{ bgUrl: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwzfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85", bgColor: '' },
				{ bgUrl: '', bgColor: '#cd5a91' },
				{ bgUrl: '', bgColor: '#89609e' },
				{ bgUrl: '', bgColor: '#b04632' },
				{ bgUrl: '', bgColor: '#519839' },
				{ bgUrl: '', bgColor: '#0079bf' },
				{ bgUrl: '', bgColor: '#d29034' },
			]
		}
	},

	methods: {
		cardBgStyle(idx) {
			const bg = this.bgs[idx]
			if (bg.bgUrl) return `background-image: url('${bg.bgUrl}'); background-size:cover; background-position: center;`
			return `background-color: ${bg.bgColor}`
		},
		changeBgStyle(idx) {
			const clickedBg = this.bgs[idx]
			this.board.style = clickedBg
		},

		async createBoard() {
			if (!this.board.title) return
			const board = await this.$store.dispatch({ type: 'addBoard', title: this.board.title, style: this.board.style })
			this.$router.push(`/board/${board._id}`)
			await this.$store.dispatch({type: 'loadBoard' , boardId: board._id})
			this.$emit('closeMenu')
			this.$store.commit({ type: 'closeBlack' })
		},
	},
	computed: {
		user() {
			return this.$store.getters.loggedinUser
		},
		bgStyle() {
			if (this.board.style.bgUrl) return `background-image: url('${this.board.style.bgUrl}'); background-size:cover; background-position: center;`
			return `background-color: ${this.board.style.bgColor}`
		},
		blackBgStyle() {
			if (this.board.style.bgColor) return `background-color: transparent`
		}
	},
	created(){
		this.$store.commit({ type: 'openBlack' })
	}
}
</script>

<style>
</style>