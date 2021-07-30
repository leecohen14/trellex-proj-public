<script>
import { Bar } from "vue-chartjs"
import { utilService } from '../../services/util.service.js'
export default {
	extends: Bar,
	props: {
		boardMap: Object,
		type: String
	},
	data() {
		return {
			groups: [],
			members: []
		}
	},
	methods: {
		getArraysForGroups() {
			const labels = []
			const data = []
			for (let groupId in this.boardMap) {
				const group = this.groups.find(g => g.id === groupId)
				labels.push(group.title)
				data.push(this.boardMap[groupId])
			}
			const colors = labels.map((g) => utilService.getRandomColor())
			return { labels, data, colors }
		},
		getArraysForMembers() {
			const labels = []
			const data = []
			for (let memberId in this.boardMap) {
				const member = this.members.find(m => m._id === memberId)
				labels.push(member.fullname)
				data.push(this.boardMap[memberId])
			}
			const colors = labels.map((l) => utilService.getRandomColor())
			return { labels, data, colors }
		},
	},
	mounted() {
		// Overwriting base render method with actual data.
		let arrays = {}
		if (this.type === 'groups') {
			arrays = this.getArraysForGroups()
		}else if (this.type === 'members'){
			arrays = this.getArraysForMembers()
		}
		const options = {
			title: {
				display: true,
				text: (this.type === 'groups') ? 'Groups' : 'Members',
				fontColor: 'white',
				fontSize: 24,
				fontWeight: 'bold'
			},
			legend: {
				display: false,
				labels: {
					font: {
						size: 40,
						// familiy: 'Arial'
					}
				}
			},
			layout: {
				// minHeight:300,
			},
			tooltips: {
				// titleFontSize: 45,
				// bodyFontSize: 30
			},
			scales: {
				xAxes: [
					{
						ticks: {
							fontSize: 15, // the words undex x axes
							fontWeight: 'bold',
							fontColor: '#ffffff',
							fontStyle: "bold"
						}
					}
				],
				yAxes: [
					{
						ticks: {
							stepSize: 1,
							beginAtZero: true,
							fontSize: 15, // yAxes
							fontColor: '#ffffff',
							fontStyle: "bold"

						}
					}
				]
			}
		}
		var c = document.getElementById("bar-chart").getContext("2d");
		var my_gradient2 = c.createLinearGradient(0, 0, 0, 170);
		my_gradient2.addColorStop(0, "#2ade23b6");
		my_gradient2.addColorStop(0.8, "#28d21eb6");
		my_gradient2.addColorStop(1, "#5fcb3bb6");
		arrays.colors = arrays.labels.map((c,idx) => my_gradient2)
		this.renderChart({
			labels: arrays.labels,
			datasets: [
				{
					label: "tasks",
					backgroundColor: arrays.colors,
					data: arrays.data,
					borderWidth: 2,
					borderColor: "#ffffff",
					borderRadius: 5,

				}],
		}, options)
	},
	created() {
		this.groups = this.$store.getters.board.groups
		this.members = this.$store.getters.board.members
	}
}
</script>


