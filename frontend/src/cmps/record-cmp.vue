<template>
	<div class="vid-container">
		<video
			id="myVideo"
			class="video-js vjs-default-skin"
			playsinline
		></video>
	</div>
</template>

<script>
/* eslint-disable */
import 'video.js/dist/video-js.css'
import 'videojs-record/dist/css/videojs.record.css'
import videojs from 'video.js'

import 'webrtc-adapter'
import RecordRTC from 'recordrtc'
import axios from 'axios'


// the following imports are only needed when you're recording
// audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js'
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js'
WaveSurfer.microphone = MicrophonePlugin

// register videojs-wavesurfer plugin
import videojs_wavesurfer_css from 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css'
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js'

import Record from 'videojs-record/dist/videojs.record.js'

export default {
	props: {
		isVideo: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			player: '',
			options: {
				controls: true,
				autoplay: false,
				fluid: false,
				loop: false,
				width: 500,
				height: 300,
				bigPlayButton: false,
				controlBar: {
					volumePanel: true
				},
				plugins: {
					// this section is only needed when recording audio-only
					wavesurfer: {
						backend: 'WebAudio',
						waveColor: '#36393b',
						progressColor: 'black',
						debug: true,
						cursorWidth: 1,
						displayMilliseconds: true,
						hideScrollbar: true,
						plugins: [
							// enable microphone plugin
							WaveSurfer.microphone.create({
								bufferSize: 4096,
								numberOfInputChannels: 1,
								numberOfOutputChannels: 1,
								constraints: {
									video: false,
									audio: !this.isVideo
								}
							})
						]
					},
					// configure videojs-record plugin
					record: {
						audio: true,
						video: this.isVideo,
						debug: true,
					}
				}
			}
		}
	},
	methods: {
		upload(blob) {
			// this upload handler is served using webpack-dev-server for
			// this example, see build-config/fragments/dev.js
			var serverUrl = 'https://api.cloudinary.com/v1_1/avivcloud/video/upload'
			var formData = new FormData()
			formData.append('file', blob, blob.name)
			formData.append('upload_preset', 'piahypd8')

			console.log('upload recording ' + blob.name + ' to ' + serverUrl)

			this.$store.commit({ type: 'setMsgTxt', txt: 'Uploading media...' })
			this.$store.dispatch({ type: 'activeMsg' })
			// start upload
			axios.post(serverUrl, formData)
				.then(res => {
					this.closeMedia()
					const type = this.isVideo ? 'video' : 'audio'
					this.$emit('mediaTask', { data: res.data.secure_url, type })
					this.$store.commit({ type: 'setMsgTxt', txt: 'Done!' })
					this.$store.dispatch({ type: 'activeMsg' })
				})
				.catch((err) => {
					this.loading = false
					console.error(err)
				})

		},
		closeMedia() {
			this.$emit('closeMedia')
			this.$store.commit({ type: 'closeBlack' })
		}
	},
	mounted() {
		/* eslint-disable no-console */
		this.player = videojs('#myVideo', this.options, () => {
			console.log('🚀 ~ this.player', this.player)
			// print version information at startup
			var msg = 'Using video.js ' + videojs.VERSION +
				' with videojs-record ' + videojs.getPluginVersion('record') +
				' and recordrtc ' + RecordRTC.version
			videojs.log(msg)
		})
		// device is ready
		this.player.on('deviceReady', () => {
			console.log('device is ready!')
		})
		// user clicked the record button and started recording
		this.player.on('startRecord', () => {
			console.log('started recording!')
		})
		// user completed recording and stream is available
		this.player.on('finishRecord', () => {
			// the blob object contains the recorded data that
			// can be downloaded by the user, stored on server etc.
			console.log('finished recording: ', JSON.parse(JSON.stringify(this.player.recordedData)))
			this.upload(this.player.recordedData)
		})
		// error handling
		this.player.on('error', (element, error) => {
			console.warn(error)
		})
		this.player.on('deviceError', () => {
			console.error('device error:', this.player.deviceErrorCode)
		})
	},
	beforeDestroy() {
		if (this.player) {
			this.player.dispose()
		}
	},
	created() {
		this.options.width = window.innerWidth/2.3
		this.options.height =window.innerWidth/3.6
		this.$store.commit({ type: 'openBlack' })

	},
	components: {
		videojs_wavesurfer_css,
		Wavesurfer,
		Record,
	},
}
</script>