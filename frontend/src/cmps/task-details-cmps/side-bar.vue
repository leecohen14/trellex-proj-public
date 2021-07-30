<template>
	<aside class="details-side-bar" @click.stop="">
		<h3 class="head-lines">Add to card</h3>
		<button
			class="option"
			v-for="(option, idx) in options"
			:key="idx"
			@click="openMenu(idx)"
		>
			<!-- <i :class="option.icon"></i> -->
			<img
				:class="`${option.title}-menu`"
				:src="
					require(`@/assets/details-side-bar-icons/${option.title}-menu.svg`)
				"
				alt=""
			/>

			{{ option.title }}
		</button>

		<basic-menu
			class="menu"
			@closeMenu="openMenu(null)"
			v-if="open !== null"
			:title="openTitle"
		>
			<members-menu v-if="open === 0" @closeMenu="open = null" />
			<labels-menu v-if="open === 1" @closeMenu="open = null" />
			<checklist-menu v-if="open === 2" @closeMenu="open = null" />
			<dates-menu v-if="open === 3" @closeMenu="open = null" />
			<attachment-menu v-if="open === 4" @closeMenu="open = null" />
			<cover-menu v-if="open === 5" @closeMenu="open = null" />
		</basic-menu>
	</aside>
</template>

<script>
import basicMenu from '@/cmps/basic-menu.vue'
import membersMenu from '@/cmps/menus-cmps/members-menu.vue'
import labelsMenu from '@/cmps/menus-cmps/labels-menu.vue'
import checklistMenu from '@/cmps/menus-cmps/checklist-menu.vue'
import datesMenu from '@/cmps/menus-cmps/dates-menu.vue'
import attachmentMenu from '@/cmps/menus-cmps/attachment-menu.vue'
import coverMenu from '@/cmps/menus-cmps/cover-menu.vue'

export default {
	data() {
		return {
			options: [
				{ icon: '', title: 'Members', },
				{ icon: '', title: 'Labels', },
				{ icon: '', title: 'Checklist', },
				{ icon: '', title: 'Dates', },
				{ icon: '', title: 'Attachment', },
				{ icon: '', title: 'Cover', },
			],
			open: null
		}
	},
	computed: {
		openTitle() {
			if (this.open === null) return
			return this.options[this.open].title
		}
	},
	methods: {
		openMenu(idx) {
			this.open = idx
		},
	},
	components: {
		basicMenu,
		labelsMenu,
		membersMenu,
		checklistMenu,
		datesMenu,
		attachmentMenu,
		coverMenu
	},
}
</script>
