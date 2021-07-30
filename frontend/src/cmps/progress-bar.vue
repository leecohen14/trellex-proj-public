<template>
	<section class="progress-bar">
		<el-progress :percentage="percentage" v-if="percentage < 100" />
		<el-progress :percentage="percentage" status="success" v-else />
		<!-- <el-progress :percentage="percentage" />
		<el-progress :percentage="percentage" status="success" />
		<el-progress :percentage="percentage" status="warning"></el-progress>
		<el-progress :percentage="percentage" status="exception"></el-progress> -->
	</section>
</template>

<script>
export default {
	props: {
		percentage: {
			type: Number,
			default: 0
		},
	},
};
</script>
