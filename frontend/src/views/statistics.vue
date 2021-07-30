<template>
	<transition
		enter-active-class="animate__animated animate__zoomIn animate__faster"
	>
		<section v-if="board" class="statistics" @click.stop="closeStat">
			<header class="statistics-header">
				<h1>Statistics</h1>
				<p>
					<span> Members: {{ board.members.length }} </span> |
					<span> Groups: {{ sumOf.groups }} </span> |
					<span> Tasks: {{ sumOf.tasks }} </span> |
					<span> labels: {{ board.labels.length }} </span>
				</p>
			</header>
			<main class="charts">
				<bar-chart
					class="members-chart"
					:boardMap="boardMapByMembers"
					:type="'members'"
				/>
				<doughnut-chart
					class="labels-chart"
					:boardMap="boardMapByLabels"
					:type="'labels'"
				/>
				<bar-chart
					class="groups-chart"
					:boardMap="boardMapByGroups"
					:type="'groups'"
				/>
			</main>
		</section>
	</transition>
</template>

<script>
import doughnutChart from '../cmps/statistics/doughnut-chart.vue'
import barChart from '../cmps/statistics/bar-chart.vue'
export default {
	data() {
		return {
			board: null
		}
	},
	methods: {
		closeStat() {
			const { boardId } = this.$route.params
			this.$store.commit({ type: 'closeBlack' })
			this.$router.push(`/board/${boardId}`)
		}
	},










	computed: {
		boardMapByLabels() {
			const labelAppearencesMap = this.board.groups.reduce((boardLabelsMap, group) => {
				const labelAppearencesMap = group.tasks.reduce((groupLabelsMap, task) => {
					task.labelIds?.forEach(labelId => {
						groupLabelsMap[labelId] ??= 0
						groupLabelsMap[labelId]++
					})
					return groupLabelsMap
				}, {})
				for (let labelId in labelAppearencesMap) {
					boardLabelsMap[labelId] ??= 0
					boardLabelsMap[labelId]++
				}
				return boardLabelsMap
			}, {})
			return labelAppearencesMap
		},

























		boardMapByMembers() {
			const boardMap = this.board.groups.reduce((acc, group) => {
				const groupMap = group.tasks.reduce((acc, task) => {
					task.members?.forEach(member => {
						acc[member._id] ??= 0
						acc[member._id]++
					})
					return acc
				}, {})
				for (let memberId in groupMap) {
					acc[memberId] ??= 0
					acc[memberId]++
				}
				return acc
			}, {})
			return boardMap
		},
		boardMapByGroups() {
			let boardMap = this.board.groups.reduce((acc, group) => {
				acc[group.id] = group.tasks.length
				return acc
			}, {})
			return boardMap
		},
		sumOf() {
			const t = this.boardMapByGroups
			let tasks = 0
			let groups = 0
			for (let g in t) {
				tasks += t[g]
				groups++
			}
			return { tasks, groups }
		}
	},
	async created() {
		this.board = this.$store.getters.board
		this.$store.commit({ type: 'openBlack' })
	},
	components: {
		doughnutChart,
		barChart,
	}
}
</script>