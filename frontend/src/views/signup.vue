<template>
	<main class="sign-up">
		<el-form
			:model="ruleForm"
			status-icon
			:rules="rules"
			ref="ruleForm"
			label-width="120px"
			class="sign-up-container"
		>
			<h2>Sign Up</h2>
			<el-form-item label="Username" prop="pass">
				<el-input
					type="text"
					v-model="ruleForm.username"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item label="Full Name" prop="pass">
				<el-input
					type="text"
					v-model="ruleForm.fullname"
					autocomplete="on"
				></el-input>
			</el-form-item>

			<el-form-item label="Password" prop="pass">
				<el-input
					type="password"
					v-model="ruleForm.password"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item label="Confirm" prop="checkPass">
				<el-input
					type="password"
					v-model="ruleForm.checkPass"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<!-- <el-form-item label="Age" prop="age">
				<el-input v-model.number="ruleForm.age"></el-input>
			</el-form-item> -->

			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')"
					>Submit</el-button
				>
				<el-button @click="resetForm('ruleForm')">Reset</el-button>
			</el-form-item>
		</el-form>
	</main>
</template>
<script>
export default {
	data() {
		var checkAge = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('Please input the age'))
			}
			setTimeout(() => {
				if (!Number.isInteger(value)) {
					callback(new Error('Please input digits'))
				} else {
					if (value < 18) {
						callback(new Error('Age must be greater than 18'))
					} else {
						callback()
					}
				}
			}, 1000)
		}
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('Please input the password'))
			} else {
				if (this.ruleForm.checkPass !== '') {
					this.$refs.ruleForm.validateField('checkPass')
				}
				callback()
			}
		}
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('Please input the password again'))
			} else if (value !== this.ruleForm.password) {
				callback(new Error('Two inputs don\'t match!'))
			} else {
				callback()
			}
		}
		return {
			ruleForm: {
				username: 'King4',
				fullname: 'Aviv Ben Shahar',
				password: '123456',
				checkPass: '123456',
				age: ''
			},
			rules: {
				password: [
					{ validator: validatePass, trigger: 'blur' }
				],
				checkPass: [
					{ validator: validatePass2, trigger: 'blur' }
				],
				age: [
					{ validator: checkAge, trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					const userCred = { username: this.ruleForm.username, password: this.ruleForm.password, fullname: this.ruleForm.fullname }
					try {
						const loggedinUser = await this.$store.dispatch({ type: 'signup', userCred })
						if (loggedinUser) this.$router.push('/')
					} catch (error) {
						console.log(error)
					}

				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
		}
	}
}
</script>