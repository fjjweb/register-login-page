<template>
	<div class="box">
		<div class="section">
			<div class="bannerText">
				<p>请绑定手机号进行身份认证</p>
			</div>
			<div v-if='!isCode' class="setCode">
				<p>{{tel}}<img src="../../assets/edit.png" alt="编辑" @click="getTel"></p>
				<security-code v-model="code" v-on:changeVal='getNewCode' :length="6" placeholder=' '></security-code>
				<p class="codeFooter" v-if="!againCode">验证码已经发出，{{time}}s后重新获取</p>
				<p class="codeFooter" v-if="againCode" @click="getTel">重新获取</p>
			</div>
			<div v-if='isCode' class="getTel">
				<div class="inputText">
					<security-code v-model="tel" :length="11" placeholder=' '></security-code>
				</div>
				<div class="getCode">
					<button :class="codeColor?'active':''" @click="getCode">获取验证码</button>
				</div>
			</div>
		</div>
		<div class="loading" v-if='loading'>
			<span><img class="Rotation" src="../../assets/loading.png" alt=""></span>
			<div>登录中...</div>
		</div>
		<div class="error" v-if='errorTel'>
			<p>请输入正确的手机号</p>
		</div>
		<div class="error" v-if='error'>
			<p>{{errorStr}}</p>
		</div>
	</div>
</template>
<script>
import SecurityCode  from '@/components/inputCode.vue'
import { goIndex, mobileCode, login } from '@/service/getData.js'
import geturlStr from '@/utils/geturlStr.js'
import ajax from '@/config/ajax.js'
import { baseUrl } from '@/config/env'
export default {
	components: {
		SecurityCode
	},
	data () {
		return {
			loading: false, // 登录loading
			code: '', // 获取的验证码
			tel: '', // 手机号
			codeColor: false, // 获取验证码的样式
			isCode: true, // 是否显示输入验证码
			time: 60, // .时间
			againCode: false, // 再次获取验证码切换
			timer: null, // 定时器
 			id: '',
			error: false, // 验证码输入错误文案
			errorStr: '', // 验证码输入错误提示
			errorTel: '' // tel错误弹框
		}
	},
	created (){
		// 先判断当前url里的参数code有没有
		console.log(geturlStr('code'))
		if(geturlStr('code') !== null){
			goIndex(geturlStr('code')).then(res=>{
				if(res.status == 1){
					this.id = res.wxMember.id
				}
			})
		} else {
			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxea2cdafa1030004b&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'
			// window.location.href = '/wxauth'
		}
	},
	updated () {
		// 手机号长度
		if(this.tel.length === 11) {
			this.codeColor = true
		} else{
			this.codeColor = false
		}
	},
	methods: {
		// 子组件向父组件传的验证码
		getNewCode(val){
			if(val.length === 6){
				login(this.id, this.tel, val).then(res => {
					if(res.status == 1) {
						this.loading = true
						ajax({
								method: 'GET',
								url: 'http://wkmobile-api.99114.cn/front/program/getLoginToken',
								data: {
										mobile: this.tel,
										memberId: res.memberId
								},
								success: function (response) {
									response = JSON.parse(response)
									if(response.code === "0000"){
										this.loading = false
										window.location.href =  'http://webmobile.99114.com?token=' + response.respBody
										// 'http://webmobile.99114.cn?token=' + response.respBody
									}else{
										this.errorStr = '登录失败~~'
										this.error = true
										this.loading = false
										setTimeout(()=>{
											this.error = false
										},2000)
									}
								}
						});
					}else{
						this.loading = false
						this.errorStr = '验证码错误，请重新输入'
						this.error = true
						setTimeout(()=>{
							this.error = false
						},2000)
					}
				})
			}else{
				this.loading = false
			}
		},
		// 重新获取、编辑
		getTel() {
			this.isCode = true
			this.tel = ''
			this.code = ''
			clearInterval(this.timer)
			this.time = 60
			this.againCode = false
			this.timer = null
		},
		// 获取验证码
		getCode() {
			if(this.codeColor){
				if((/^[1][3,4,5,7,8][0-9]{9}$/).test(this.tel)){
					mobileCode(this.tel).then(res => {
						this.isCode = false
						if(res.status == 1) {
							this.timer = setInterval(()=>{
								if(this.time > 0 && this.time <= 60){
									this.time--
								} else {
									clearInterval(this.timer)
									this.time = 60
									this.againCode = true
									this.timer = null
								}
							},1000)
						}
					})
				}else{
					this.errorTel = true
					setTimeout(()=>{
						this.errorTel = false
					},2000)
				}
			}
		}
	}
}
</script>

<style scoped lang='scss'>
.active{
	background: #FF6600!important;
}
qjz {
	display: -webkit-flex;
	align-items: center;
	justify-content: center;
}
.box{
	width: 100%;
	height: 100%;
	display: -webkit-flex;
	flex-direction: column;
	overflow-x: hidden;
}
.section{
	flex: 1;
	overflow-x: hidden;
	overflow-y: scroll;
	.bannerText{
		height: 2.5rem;
		@extend qjz;
		padding-top: 3rem;
		p{
			font-family: PingFangSC-Regular;
			font-size: 1.3rem;
			color: #333333;
			letter-spacing: 0;
		}
	}
	.inputText{
		height: auto;
		width: 100%;
	}
	.getCode{
		width: 100%;
		height: 8rem;
		button{
			margin: 2rem 15%;
			width: 70%;
			height: 4rem;
			background: #CCCCCC;
			border-radius: 4px;
			border: none;
			outline: none;
			font-family: PingFangSC-Regular;
			font-size: 1.5rem;
			color: #FFFFFF;
			letter-spacing: 0;
		}
	}
}
.error {
	width: 20rem;
	background: rgba(0,0,0,0.50);
	border-radius: 4px;
	position: fixed;
	top: 50%;
	left: 50%;
	display: -webkit-flex;
	flex-direction: column;
	transform: translate(-50%, -100%); 
	p{
		font-family: PingFangSC-Regular;
		font-size: 1.4rem;
		color: #FFFFFF;
		letter-spacing: 0;
		text-align: center;
	}
}
.loading {
	width: 10rem;
	height: 10rem;
	background: rgba(0,0,0,0.50);
	border-radius: 4px;
	position: fixed;
	top: 50%;
	left: 50%;
	display: -webkit-flex;
	flex-direction: column;
	transform: translate(-50%, -100%); 
	span{
		flex-basis: 70%;
		@extend qjz;
		img{
			width: 4rem;
			height: auto;
		}
	}
	div{
		flex-basis: 30%;
		font-family: PingFangSC-Regular;
		font-size: 1.4rem;
		color: #FFFFFF;
		letter-spacing: 0;
		text-align: center;
	}
}
.getTel{
	margin-top: 2rem;
}
.setCode{
	width: 100%;
	text-align: center;
	p{
		font-family: PingFangSC-Regular;
		font-size: 1.3rem;
		color: #333333;
		letter-spacing: 0;
	}
	img{
		width: 1.3rem;
		height: auto;
		margin-left: .5rem;
	}
	.codeFooter{
		margin-top: 1.5rem;
		font-family: PingFangSC-Regular;
		font-size: 1.3rem;
		color: #999999;
		letter-spacing: 0;
		text-align: center;
	}
}
@-webkit-keyframes rotation{
from {-webkit-transform: rotate(0deg);}
to {-webkit-transform: rotate(360deg);}
}

.Rotation{
-webkit-transform: rotate(360deg);
animation: rotation 3s linear infinite;
-moz-animation: rotation 3s linear infinite;
-webkit-animation: rotation 3s linear infinite;
-o-animation: rotation 3s linear infinite;
}
</style>
