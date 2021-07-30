<template>
	<div class="card-list-container" v-if="groups">
		<Container
			drag-class="card-ghost"
			drop-class="card-ghost-drop"
			:get-child-payload="getParentPayload"
			:drop-placeholder="dropPlaceholderOptions"
			group-name="1"
			@drop="onDrop(groups, $event)"
		>
			<Draggable
				class="outter"
				v-for="(group, idx) in groups"
				:key="group.id"
			>
				{{ group.title }}
				<Container
					drag-class="card-ghost"
					drop-class="card-ghost-drop"
					:get-child-payload="getChildPayload(group)"
					:drop-placeholder="dropPlaceholderOptions"
					group-name="2"
					@drop="onDrop(group.tasks, $event)"
				>
					<Draggable
						class="innner"
						v-for="(task, $index) in group.tasks"
						:key="task.id"
					>
						<Card :title="task.title" />
					</Draggable>
				</Container>
			</Draggable>
		</Container>
	</div>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "./applyDrag"
import Card from "./Card.vue"
export default {
	name: "dnd",
	components: {
		Card,
		Container,
		Draggable
	},
	data() {
		return {
			dropPlaceholderOptions: {
				className: "drop-preview",
				animationDuration: "150",
				showOnTop: false
			},
			groups: null
		}
	},
	methods: {
		onDrop(items, dropResult) {
			// TODO - save to store
			const newItems = applyDrag(items, dropResult)
			console.log('🚀 ~ newItems', JSON.parse(JSON.stringify(newItems)))
		},
		getChildPayload(group, index) {
			return group.tasks[index]
		},
		getParentPayload(index) {
			return this.groups[index]
		},
	},
	async created() {
		const board = await this.$store.dispatch({ type: 'loadBoard', boardId: 'b101' })
		this.groups = board.groups
	},
};
</script>
<style scoped>
.card-list-container > * {
	display: flex;
}
.outter {
	display: flex;
	/* flex-direction: column; */
	width: 40%;
	height: 100%;
	border: 1px solid #dcebf4;
	border-radius: 6px;
	padding: 1rem 1rem 0 1rem;
	margin-top: 5rem;
	margin-right: 2.5rem;
	margin-left: 1rem;
}
.card-ghost {
	transition: transform 0.18s ease;
	transform: rotateZ(5deg);
}
.card-ghost-drop {
	transition: transform 0.18s ease-in-out;
	transform: rotateZ(0deg);
}
</style>