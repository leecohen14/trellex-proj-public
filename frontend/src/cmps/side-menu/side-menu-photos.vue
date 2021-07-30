<template>
	<main class="menu-photos">
		<button class="back-btn" @click="openMenu(1)">
			<img :src="require('@/assets/back-arrow.svg')" alt="" />
		</button>

		<el-input
			class="input"
			@input="searchPhotosDe"
			v-model="imgSearch"
			placeholder="Photos"
			prefix-icon="el-icon-search"
		>
		</el-input>
		<div class="photos" v-loading="loading">
			<img
				v-for="(img, idx) in imgs"
				:key="idx"
				:src="img.minImgUrl"
				alt=""
				@click="setImgBg(idx)"
			/>
		</div>
	</main>
</template>

<script>
import { unsplashService } from "../../../src/services/unsplash.service.js"

export default {
	data() {
		return {
			imgSearch: '',
			imgs: this.savedPhotos(),
			searchPhotosDe: null,

			loading: false
		}
	},
	created() {
		this.searchPhotosDe = this.debounce(this.searchPhotos, 1200)
	},

	methods: {
		openMenu(idx) {
			this.$emit('openMenu', idx)
		},
		setImgBg(idx) {
			const currImage = this.imgs[idx]
			const boardStyle = this.$store.getters.board.style
			boardStyle.bgUrl = currImage.fullImgUrl
			boardStyle.bgColor = null
			this.$store.commit({ type: 'setBoardStyle', boardStyle })
			this.$store.dispatch({ type: 'saveBoard' })
		},
		async searchPhotos() {
			this.loading = true
			this.imgs = await unsplashService.searchPhotos(this.imgSearch)
			if (!this.imgs?.length) this.imgs = this.savedPhotos()
			console.log('this.imgs :>> ', this.imgs);
			this.loading = false
		},
		debounce(func, wait = 500, ...args) {
			let timeout
			return function executedFunction() {
				const later = () => {
					clearTimeout(timeout)
					func(...args)
				}

				clearTimeout(timeout)
				timeout = setTimeout(later, wait)
			}
		},
		savedPhotos() {
			return [
				{
					"idx": 0,
					"id": "R98l5I6OFQY",
					"fullImgUrl": "https://images.unsplash.com/photo-1587502624372-45627391a31f?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MXwxfHNlYXJjaHwxfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1587502624372-45627391a31f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MXwxfHNlYXJjaHwxfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 1,
					"id": "okVXy9tG3KY",
					"fullImgUrl": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwyfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwyfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 2,
					"id": "OD9EOzfSOh0",
					"fullImgUrl": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwzfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwzfHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 3,
					"id": "oQl0eVYd_n8",
					"fullImgUrl": "https://images.unsplash.com/photo-1439405326854-014607f694d7?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw0fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1439405326854-014607f694d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw0fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 4,
					"id": "IZ01rjX0XQA",
					"fullImgUrl": "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw1fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw1fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 5,
					"id": "Adl90-aXYwA",
					"fullImgUrl": "https://images.unsplash.com/photo-1503756234508-e32369269deb?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw2fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1503756234508-e32369269deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw2fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 6,
					"id": "7uXn7nudorc",
					"fullImgUrl": "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw3fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw3fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 7,
					"id": "rZBmXd-oqW8",
					"fullImgUrl": "https://images.unsplash.com/photo-1564419429381-98dbcf916478?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MXwxfHNlYXJjaHw4fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1564419429381-98dbcf916478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MXwxfHNlYXJjaHw4fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 8,
					"id": "cfR-V1QuEKw",
					"fullImgUrl": "https://images.unsplash.com/photo-1457195740896-7f345efef228?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw5fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1457195740896-7f345efef228?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHw5fHxzZWF8ZW58MHx8fHwxNjI2OTUyMjIz&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 9,
					"id": "a5uptAdUmjE",
					"fullImgUrl": "https://images.unsplash.com/photo-1548032885-b5e38734688a?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxMHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1548032885-b5e38734688a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxMHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 10,
					"id": "3dK05zuot8c",
					"fullImgUrl": "https://images.unsplash.com/photo-1545733099-152483684cb5?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxMXx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1545733099-152483684cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxMXx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 11,
					"id": "I7oLRdM9YIw",
					"fullImgUrl": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxMnx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxMnx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 12,
					"id": "6ArTTluciuA",
					"fullImgUrl": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxM3x8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxM3x8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 13,
					"id": "eXHeq48Z-Q4",
					"fullImgUrl": "https://images.unsplash.com/photo-1476673160081-cf065607f449?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxNHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1476673160081-cf065607f449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxNHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 14,
					"id": "CUmCByAhXyQ",
					"fullImgUrl": "https://images.unsplash.com/photo-1545229765-7ff613f80127?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxNXx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1545229765-7ff613f80127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxNXx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 15,
					"id": "KMn4VEeEPR8",
					"fullImgUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxNnx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxNnx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 16,
					"id": "YmQ0-nmWcV0",
					"fullImgUrl": "https://images.unsplash.com/photo-1553570739-330b8db8a925?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxN3x8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1553570739-330b8db8a925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxN3x8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 17,
					"id": "LlDQPnErFxo",
					"fullImgUrl": "https://images.unsplash.com/photo-1524275804141-5e9f2bc5a71d?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxOHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1524275804141-5e9f2bc5a71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwxOHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				},
				{
					"idx": 18,
					"id": "xe-ss5Tg2mo",
					"fullImgUrl": "https://images.unsplash.com/photo-1520155346-36773ab29479?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwzfHxtYWNrYm9va3xlbnwwfHx8fDE2MjcyMjkyNTk&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://www.imore.com/sites/imore.com/files/styles/large/public/field/image/2019/08/best-led-lightstrip-hero.jpg"
				},
				{
					"idx": 19,
					"id": "RVX2STx44UI",
					"fullImgUrl": "https://images.unsplash.com/photo-1550757750-4ce187a65014?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwyMHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=85",
					"minImgUrl": "https://images.unsplash.com/photo-1550757750-4ce187a65014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDgxMTN8MHwxfHNlYXJjaHwyMHx8c2VhfGVufDB8fHx8MTYyNjk1MjIyMw&ixlib=rb-1.2.1&q=80&w=400"
				}
			]
		}

	}
}
</script>

<style>
</style>