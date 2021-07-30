<script>
import { Doughnut } from "vue-chartjs"
import { utilService } from '../../services/util.service.js'
export default {
	extends: Doughnut,
	props: {
		boardMap: Object,
		type: String
	},
	data() {
		return {
			labels: [],
		}
	},
	methods: {
		getArraysForLabels() {
			const labels = []
			const data = []
			const colors = []
			for (let labelId in this.boardMap) {
				const label = this.labels.find(l => l.id === labelId)
				labels.push(label.title || '')
				data.push(this.boardMap[labelId])
				colors.push(label.color)
			}
			return { labels, data, colors }
		},
	},
	mounted() {
		// Overwriting base render method with actual data.
		let arrays = {}
		if (this.type === 'labels') {
			arrays = this.getArraysForLabels()
		}
		const options = {
			title: {
				display: true,
				text: (this.type === 'labels') ? 'Labels' : 'Members',
				fontColor: 'white',
				fontSize: 24,
				fontWeight: 'bold'
			},
			legend: {
				display: true,
				position: "bottom",
				labels: {
					fontColor: "#ffffff",
					fontSize: 16,
					fontWeight: 'bold'
				}
			},
			animation: {
				animateScale: true,
				animateRotate: true
			},
			layout: {
				// minHeight:300,
				padding: {
					// top:10,
					// bottom: 10

				}
			},
		}

		this.renderChart({
			labels: arrays.labels,
			datasets: [
				{
					label: `board stat`,
					backgroundColor: arrays.colors,
					// borderWidth: 2,
					data: arrays.data,

				}],
		}, options)
	},
	created() {
		this.labels = this.$store.getters.board.labels
	}
}
</script>
