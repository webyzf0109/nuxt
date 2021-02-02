<template>
  <div id="app" ref="app">
    <van-overlay :show="overlayShow">
      <div
        style="width:100%;text-align:center;height: 50px;line-height:50px;position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;">
        <van-loading text-color="#ffffff" color="#ffffff" style="color:#ffffff!important">加载中...</van-loading>
      </div>
    </van-overlay>
    <!--订单查询-->
    <div class="orderSearch" @click="onToSearch">订单查询</div>
    <div class="complaint" @click="onToComplaint">投诉</div>
    <!--顶图-->
    <div ref="header" class="img-header" v-if="configData.topPath">
      <img v-for="item in configData.topPath.split(',')" :src="item" alt="" class="img-header">
    </div>

    <section class="formModel-box" :style="{background:configData.bgColor}">
      <section class="formModel-box-nei">
        <!--下单跑马灯-->
        <van-swipe v-cloak class="swiper-box" :show-indicators="false" :touchable="false" :autoplay="1500" vertical>
          <van-swipe-item v-for="(item, index) in cmccList" :key="index">
            <van-icon color="#e71c21" name="volume-o" size="20px" class="i-vant-icon"/>
            <span class="swiper-box-item" v-cloak>
                    1分钟前 {{ item.certificateName }} {{ item.mobile }} 领取了此卡
                </span>
          </van-swipe-item>
        </van-swipe>
        <div class="formElement1" v-cloak>
          <!--form表单标题-->
          <div class="form-title" v-if="configData && !configData.idCard">根据国家实名制要求,请准确提供身份证信息</div>
          <!--form表单-->
          <div class="lastBox1" ref="lastBox">
            <van-cell-group class="formBox">
              <van-field :style="{'border-color':configData.color}" class="form" label-class="form-label" required
                         clearable label="姓名" placeholder="请输入姓名(已加密)"
                         v-model="ruleForm.certificateName" @click="onNameFocus" @input="onNameBlur" ref="name"/>
            </van-cell-group>
            <van-cell-group class="formBox">
              <van-field v-if="configData && !configData.idCard" maxlength="18" class="form"
                         :style="{'border-color':configData.color}"
                         label-class="form-label" required clearable label="身份证" v-model="ruleForm.certificateNumber"
                         placeholder="请输入身份证号(已加密)" ref="idCard" @click="onIdCardFocus"/>
            </van-cell-group>

            <van-cell-group class="formBox">
              <van-field maxlength="11" class="form phone" :style="{'border-color':configData.color}"
                         label-class="form-label" v-model="ruleForm.mobilePhone"
                         required clearable label="联系电话" placeholder="请输入联系电话(已加密)" ref="mobile"
                         @click="onMobileFocus"/>
            </van-cell-group>

            <van-cell-group class="formBox">
              <van-field v-if="configData && configData.sms" maxlength="6" class="form phone"
                         :style="{'border-color':configData.color}"
                         label-class="form-label" v-model="ruleForm.sms" required label="短信验证码" placeholder="请输入短信验证码"
                         ref="msg" @click="onMsgFocus">
                <template #button>
                  <van-button
                    :style="{color:configData.color,'font-weight':'bold',background:'none',border:'none',outline:'none'}"
                    :disabled="smsLoading" @click="onSendSms" size="small" type="primary" v-cloak>
                    {{ smsTitle }}
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>


            <van-cell-group class="formBox">
              <van-field :style="{'border-color':configData.color}" class="formStreet form" required readonly clickable
                         loading right-icon="arrow-down"
                         :value="userArea" placeholder="请选择省市区" @click="onShowPickerProvince"/>
            </van-cell-group>

            <van-cell-group class="formBox">
              <van-field :style="{'border-color':configData.color}"
                         v-if="(configData && configData.lock==0) && !configData.kept" required class="form  titlea"
                         readonly clickable
                         label="免费抢靓号" @click="onShowNumbers" right-icon="arrow-down" :value="ruleForm.orderMobile"
                         placeholder="快挑一个靓号吧,免费的哦"/>
            </van-cell-group>


            <van-cell-group class="formBox">
              <van-field :style="{'border-color':configData.color}" required class="form formStreet"
                         label-class="form-label" v-model="ruleForm.address"
                         clearable placeholder="街道/镇+村/小区/写字楼+门牌号" ref="address"/>
            </van-cell-group>
            <div class="areaBox-notice">(支持全国配送,新疆、西藏仅限省内配送)</div>

          </div>
          <Button :disabled="loading" class="button" ref="button" id="submitButton" @click="onTradeOrder" :style="{
                background: configData.color,
              }">{{orderSearchShow?'0.1元领取 包邮到家':'免费领取 包邮到家'}}
            <van-loading v-if="loading" type="spinner" color="#ffffff"/>
          </Button>
          <!--协议部分-->
          <div class="xieyi-box">
            <van-radio-group class="radio" icon-size="18" v-model="radio">
              <van-radio :checked-color="configData.color?configData.color:'#ff5e00'" v-if="radio == 1"
                         @click="radioChange" name="1"></van-radio>
              <van-radio :checked-color="configData.color?configData.color:'#ff5e00'" v-else @click="radioChange"
                         name="2"></van-radio>
            </van-radio-group>
            <div class="rules">
              <span>我已阅读并同意</span>
              <span class="xieyi" @click="onLoadProtocolYinsi" :style="{color:configData.color}"> 《隐私权政策》</span>
              <span class="xieyi" @click="onLoadProtocolPersonInfo" :style="{color:configData.color}"> 《个人信息收集证明》</span>
              和
              <span class="xieyi" @click="onLoadProtocol" :style="{color:configData.color}"> 《入网协议》</span>
            </div>
          </div>
        </div>

      </section>


    </section>


    <!--介绍图片  不带折叠-->
    <div class="imgList" v-if="configData.pageStyle&&configData.fold==0"
         :style="{background: configData.bgColor?configData.bgColor:configData.color}">
      <img v-for="(item,index) in configData.pageStyle.imgList" @click="onLoadDetail(index,item)" :key="index"
           :src="item" alt="">
    </div>

    <!--介绍图片  带折叠-->
    <div class="imgList" v-if="configData.pageStyle&&configData.fold>0" :style="{
              background: configData.bgColor,
              'text-align': 'center'
            }">
      <img
        :class="[index==configData.fold-1?'drop':'',index==configData.fold+1?'drop2':'',(index==configData.fold||index==configData.fold+1) && !detailShow ?'detailHide':'detailShow',index==configData.fold-1 && detailShow?'detailHide':'detailShow']"
        v-for="(item,index) in configData.pageStyle.imgZheList" :key="index" :src="item"
        @click="onLoadDetail(index,item)" alt="">
    </div>


    <!--评论-->
    <!-- <comment-element v-cloak v-if="configData.pageStyle && false"></comment-element> -->

    <!--底部悬浮按钮-->
    <div class="footer" v-if="configData.pageStyle" :class="activeShow ? 'footer-active' : 'footer-none'"
         @click="onToForm">
      <img :src="configData.pageStyle.buttonPath" alt/>
    </div>

    <!--弹窗部分-->
    <!--选号-->
    <van-action-sheet v-model="showMobileList" title="请选择号码" @cancel="onCancel">

      <div style="height:60px;">
        <van-field maxlength="4" class="form search" label-class="form-label" v-model="numberKeyword" clearable
                   right-icon="search" placeholder="生日、幸运数字等(4位)" ref="idCard" @input="onNumberSelect"/>
      </div>

      <div class="numberList" v-if="mobileList && mobileList.length > 0">
        <div class="numberItem" v-cloak v-for="(item, index) in mobileList" :key="index"
             @click="onLockNumber(item)">
                    <span v-if="item.btPhoneVo.flag">
                        <span v-cloak>{{ item.btPhoneVo.one }}</span>
                        <span :style="{
                          color: '#f00000',
                          'margin-left': item.btPhoneVo.one ? '-4px' : '0px'
                        }" v-cloak>{{ item.btPhoneVo.second }}</span>
                        <span style="margin-left:-4px" v-cloak>{{
                        item.btPhoneVo.three
                      }}</span>
                    </span>
          <span v-else v-cloak>{{ item.btPhoneVo.phone }}</span>
          <img v-if="item.btPhoneVo.flag" class="liang" src="https://kswk.kol.top/icon-liang.png" alt=""/>
          <section style="color:#f00000;font-size:10px;position:absolute;top:22px;"
                   v-if="item.btPhoneVo.flag">
            限时免费
          </section>
        </div>
      </div>
      <div v-if="mobileList && mobileList.length == 0" v-cloak>
        暂未找到符合搜索条件的号码，请更换条件后再试
      </div>

      <div class="refesh-button" v-cloak @click="onNumberSelect">
        <span>换一组</span>
        <van-loading class="refesh-loading" v-if="refeshLoading" type="spinner" color="#0e7df0"/>
      </div>
    </van-action-sheet>

    <!-- 选择省份  配送地 -->
    <van-action-sheet v-model="showPickerProvince" title="请选择省份">
      <div class="provinceBox province-box">
        <div :class="activeProvince==index?'active':''" v-for="(item, index) in columnsProvince" :key="index" v-cloak
             @click="onConfirmProvince(item,index)">
          {{ item.name }}
        </div>
      </div>
      <div class="provinceBox city-box">
        <div :class="activeCity==index?'active':''" v-for="(item, index) in columnsCity" :key="index" v-cloak
             @click="onConfirmCity(item,index)">
          {{ item.name }}
        </div>
      </div>
      <div class="provinceBox area-box">
        <div :class="activeArea==index?'active':''" v-for="(item, index) in columnsArea" :key="index" v-cloak
             @click="onConfirmArea(item,index)">
          {{ item.name }}
        </div>
      </div>
    </van-action-sheet>

    <!--浮动gif-->
    <img class="lazy-loaded float-gif" src="https://kswk.kol.top/img-hua-icon.gif" alt=""
         @click="popShow = true">
    <van-popup v-model="popShow" class="pop-box" v-cloak>
      <img class="lazy-loaded pop-img" src="https://kswk.kol.top/img-hua-popNew.png" alt="" @click="
          popShow = false;
          onToForm();
        "/>
      <img class="lazy-loaded" @click="popShow = false"
           style="margin:20px auto;display:block;width:35px;height:35px;"
           src="https://kswk.kol.top/img-hua-popRemove.png" alt=""/>
    </van-popup>


    <!-- 其他说明 -->
    <van-dialog v-model="cmccOtherShow" class="cmccOther-dialog" title="其他说明">
      <div v-html="cmccOtherDetail"></div>
    </van-dialog>
  </div>
</template>

<script>
  import { findListSwagger, getCmccConfigRemark, loadConfig, lockNumber, numberSelectLock,tradeOrder } from '../api/cmcc'
  import { getAreaPca, getQueryVariable, initMapJs } from '../utils/util'
  import {nameCheck,phoneCheck,idNoCheck} from '../utils/validator'

  export default {
    data() {
      return {
        configData: {},
        detailShow: false,
        popShow: false,
        ruleForm: {
          certificateName: '',
          certificateNumber: '',
          mobilePhone: '',
          sms: '',
          goodsProvinceCode: '',
          goodsProvince: '',
          goodsCityCode: '',
          goodsCity: '',
          sendProvinceCode: '',
          sendProvince: '',
          sendCityCode: '',
          sendCity: '',
          sendDistrictCode: '',
          sendDistrict: '',
          orderMobile: '',
          numberLockSequence: '',
          numberCheckCode: '',
          linkNum: '',
          address: ''
        },
        showPickerGoodsProvince: false,
        columnsGoodsProvince: [],
        columnsGoodsCity: [],
        showPickerProvince: false,
        columnsProvince: [],
        columnsCity: [],
        columnsArea: [],
        showMobileList: false,
        mobileList: [],
        numberKeyword: '',
        lockInfo: {},
        cmccList: [],
        refeshLoading: false,
        activeShow: false,
        length: 10,


        //form
        loading: false,
        radio: '1',
        smsLoading: false,
        smsTitle: '发送验证码',
        //其他说明
        cmccOtherShow: false,
        cmccOtherDetail: '',

        //省市区选中
        activeProvince: false,
        activeCity: false,
        activeArea: false,
        userArea: '',
        overlayShow: true,
        orderSearchShow: false
      }
    },
    // 使用 async ... await  ， 与Promise选择一种即可
    mounted() {
      this.overlayShow = false
      //轮播图数据
      // this.findListSwagger();
      //获取省份
      this.findExpressProvince()
      //ip城市查询
      if (this.configData.ip == 1) {
        initMapJs(this)
      }
    },

    async asyncData({ query }) {
      let { data } = await loadConfig({
        num: query.no
      })
      if (process.browser) {
        document.title = data.configName
        sessionStorage.setItem('token', data.token)
      }
      //设置样式图片
      let imgList = data.buttonPath.split(',')
      let imgZheList = JSON.parse(JSON.stringify(imgList))

      imgZheList.splice(data.fold, 0, 'https://kswk.kol.top/img-ydllb-drop.png')
      imgZheList.splice(data.fold - 1, 0, 'https://kswk.kol.top/img-ydllb-drop.png')
      imgZheList.pop()

      imgList.pop()
      data.pageStyle = {
        buttonPath: data.buttonPath.split(',')[data.buttonPath.split(',').length - 1],
        imgList: imgList,
        imgZheList: imgZheList
      }
      //动态加载js
      if (data.jsPath) {
        let ksscript = document.createElement('script')
        ksscript.setAttribute('charset', 'utf-8')
        ksscript.src = data.jsPath
        let s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(ksscript, s)
      }

      return {
        configData: data
      }
    },
    methods: {

      /** 去查询订单页面 **/
      onToSearch() {
        if (getQueryVariable('no') == 'LZaALnwc') {
          location.href = 'orderSearch.html'
        } else {
          location.href = 'https://dev.coc.10086.cn/38857911/web/coc2020/cardqueryorder/'
        }
      },
      //去投诉
      onToComplaint() {
        location.href = 'complaintList.html?url=' + window.location.href
      },
      /** 获取轮播图数据 */
      async findListSwagger() {
        let { data } = await findListSwagger({
          type: 1
        })
        this.cmccList = data
      },
      /** 初始化地区 */
      initArea(type, category) {
        if (type == 'goods') {
          this.ruleForm.goodsCity = ''
          this.ruleForm.goodsCityCode = ''
          this.ruleForm.sendCity = ''
          this.ruleForm.sendCityCode = ''
          this.ruleForm.sendDistrict = ''
          this.ruleForm.sendDistrictCode = ''
        } else {
          switch (category) {
            case 1:
              this.ruleForm.sendCity = ''
              this.ruleForm.goodsCityCode = ''
              this.ruleForm.sendCityCode = ''
              this.ruleForm.sendDistrict = ''
              this.ruleForm.sendDistrictCode = ''
              break
            case 2:
              this.ruleForm.sendDistrict = ''
              this.ruleForm.sendDistrictCode = ''
              break
          }
        }
      },
      /** 获取省份 */
      findExpressProvince() {
        let columnsProvince = []
        getAreaPca().forEach((item, index) => {
          columnsProvince.push(item)
        })
        this.columnsProvince = columnsProvince
        if (this.configData.ip != 1) {
          this.ruleForm.sendProvince = this.columnsProvince[0].name
          this.ruleForm.sendProvinceCode = this.columnsProvince[0].code
          this.ruleForm.goodsProvinceCode = this.columnsProvince[0].code
          this.findExpressCity(this.columnsProvince[0].code)
        }
      },
      /** 点击省份 */
      onConfirmProvince(val, index) {
        this.activeProvince = index
        this.activeCity = false
        this.activeArea = false
        this.onClearOrderMobile()
        this.ruleForm.goodsProvinceCode = val.code
        this.ruleForm.sendProvinceCode = val.code
        this.ruleForm.sendProvince = val.name
        this.initArea('send', 1)
        this.findExpressCity(val.code)
        this.userArea = this.ruleForm.sendProvince + ' / ' + this.ruleForm.sendCity + ' / ' + this.ruleForm.sendDistrict
      },
      /** 获取城市--配送地 */
      findExpressCity(provinceCode, cityCode, cityName) {
        this.activeProvince = this.columnsProvince.findIndex((val) => {
          return val.code == provinceCode
        })

        let columnsCity = this.columnsProvince.filter((item) => {
          return item.code == provinceCode
        })
        this.columnsCity = columnsCity[0].childList
        if (cityCode) {
          this.activeCity = this.columnsCity.findIndex((val) => {
            return val.code == cityCode
          })
          if (this.ruleForm.goodsCityCode) {
            return
          } else {
            this.ruleForm.goodsCityCode = cityCode
          }
          if (this.ruleForm.sendCityCode) {
            return
          } else {
            this.ruleForm.sendCityCode = cityCode
            this.ruleForm.sendCity = cityName
            this.findExpressArea(cityCode)
          }
        } else {
          this.ruleForm.sendCityCode = this.columnsCity[0].code
          this.ruleForm.sendCity = this.columnsCity[0].name
          this.ruleForm.goodsCityCode = this.columnsCity[0].code

          this.findExpressArea(this.columnsCity[0].code)
        }

      },
      /** 点击城市--配送地 */
      async onConfirmCity(val, index) {
        this.activeCity = index
        this.activeArea = false
        this.ruleForm.sendCityCode = val.code
        this.ruleForm.goodsCityCode = val.code
        this.ruleForm.sendCity = val.name
        this.onClearOrderMobile()
        this.initArea('send', 2)
        this.findExpressArea(val.code)
        this.userArea = this.ruleForm.sendProvince + ' / ' + this.ruleForm.sendCity + ' / ' + this.ruleForm.sendDistrict
        //自动选号
        if (this.configData.lock == 1) {
          let { data } = await numberSelectLock({
            cityCode: this.ruleForm.goodsCityCode,
            linkNum: getQueryVariable('no'),
            numberKeyword: this.numberKeyword,
            provinceCode: this.ruleForm.goodsProvinceCode
          })
          this.ruleForm.numberLockSequence = data.numberLockSequence
          this.ruleForm.numberCheckCode = data.numberCheckCode
          this.ruleForm.orderMobile = data.orderMobile
        }
      },
      /** 获取区--配送地 */
      findExpressArea(cityCode) {
        let columnsArea = this.columnsCity.filter((item) => {
          return item.code == cityCode
        })
        this.columnsArea = columnsArea[0].childList
      },
      /** 点击区--配送地 */
      onConfirmArea(val, index) {
        this.activeArea = index
        this.ruleForm.sendDistrictCode = val.code
        this.ruleForm.sendDistrict = val.name
        this.userArea = this.ruleForm.sendProvince + ' / ' + this.ruleForm.sendCity + ' / ' + this.ruleForm.sendDistrict
        this.showPickerProvince = false
      },


      /**点击号码配送省 */
      onShowPickerProvince() {
        this.showPickerProvince = true
        setTimeout(() => {
          document.querySelector('.province-box').scrollTop = 40 * this.activeProvince - 160
        }, 100)
      },

      //选号
      async onNumberSelect() {
        let { data } = await numberSelectLock({
          cityCode: this.ruleForm.goodsCityCode,
          linkNum: getQueryVariable('no'),
          numberKeyword: this.numberKeyword,
          provinceCode: this.ruleForm.goodsProvinceCode
        })
        this.numberSelect(data)
      },
      /** 选号回调 */
      numberSelect(event) {
        this.showMobileList = true
        this.mobileList = event
      },

      /** 锁号 */
      async onLockNumber(item) {
        this.ruleForm.numberCheckCode = item.checkCode
        let { data } = await lockNumber({
          checkCode: item.checkCode,
          cityCode: this.ruleForm.goodsCityCode,
          linkNum: getQueryVariable('no'),
          lockNumber: item.btPhoneVo.phone,
          provinceCode: this.ruleForm.goodsProvinceCode,
          unlockNumber: this.lockInfo && this.lockInfo.unlockNumber
            ? this.lockInfo.unlockNumber
            : '',
          sequence: this.ruleForm && this.ruleForm.numberLockSequence
            ? this.ruleForm.numberLockSequence
            : ''
        })
        this.showMobileList = false
        this.ruleForm.orderMobile = item.btPhoneVo.phone
        this.ruleForm.numberLockSequence = data
        this.lockInfo = {
          unlockNumber: item.number
        }
      },


      /**监听滚动信息 */
      handleScroll() {
        var scroll_top = 0
        if (document.documentElement && document.documentElement.scrollTop) {
          scroll_top = document.documentElement.scrollTop
        } else if (document.body) {
          scroll_top = document.body.scrollTop
        }
        this.length = scroll_top
        if (this.length > this.$refs.header.offsetHeight && this.length < (this.$refs.header.offsetHeight + 481)) {
          this.activeShow = false
        } else {
          if (this.length <= this.$refs.header.offsetHeight) {
            this.activeShow = false
          } else {
            this.activeShow = true
          }
        }
      },
      /**去页面最下角 */
      onToForm() {
        let height = this.$refs.lastBox.offsetTop - 100
        if (this.length < height) {
          this.goDown(height, 'down')
        } else {
          this.goDown(height, 'up')
        }
      },
      goDown(height, type) {
        let setTimeFive = setInterval(() => {
          if (type == 'down') {
            if (this.length > height) {
              clearInterval(setTimeFive)
            }
          } else {
            if (this.length < height + 70) {
              clearInterval(setTimeFive)
            }
          }
          this.length = type == 'down' ? this.length + 20 : this.length - 20
          if (document.documentElement && document.documentElement.scrollTop) {
            document.documentElement.scrollTop = this.length
          } else if (document.body) {
            document.documentElement.scrollTop = this.length
            document.body.scrollTop = this.length
          }

        }, 5)
      },

      /** 获取套餐说明 */
      async getCmccOtherXY() {
        let { data } = await getCmccConfigRemark({
          linkNum: getQueryVariable('no')
        })
        this.cmccOtherDetail = data
        this.cmccOtherShow = true
      },

      /** 查询套餐详情 */
      onLoadDetail(index, item) {
        if (this.configData.fold > 0) {
          let length = this.configData.pageStyle.imgZheList.length
          if (index == this.configData.fold - 1) {
            this.detailShow = true;
          } else if (index == this.configData.fold + 1) {
            this.detailShow = false;
          }
        }
        if (this.configData.popImg.indexOf(item) > -1) {
          this.getCmccOtherXY()
        }
      },

      onCancel() {
      },
      search() {
      },

      /** 清除选中号码 */
      onClearOrderMobile() {
        this.ruleForm.orderMobile = ''
      },
      /** 选中权益 */
      radioChange() {
        if (this.radio != '1') {
          this.radio = '1'
        } else {
          this.radio = '3'
        }
      },
      /** 姓名聚焦 */
      onNameFocus() {
        this.$refs.name.focus()
      },
      /** 姓名失焦 */
      onNameBlur() {
        if (this.configData.idCard) {
          if (nameCheck(this.ruleForm.certificateName) == 'ok') {
            this.configData.idCard = !this.configData.idCard
          }
        }
      },
      /** 身份证聚焦 */
      onIdCardFocus() {
        this.$refs.idCard.focus()
      },
      /** 电话聚焦 */
      onMobileFocus() {
        this.$refs.mobile.focus()
      },
      /** 验证码聚焦 */
      onMsgFocus() {
        this.$refs.msg.focus()
      },
      /** 打开选号  */
      onShowNumbers() {
        if (this.ruleForm.sendCityCode) {
          this.onNumberSelect()
        } else {
          vant.Dialog.alert({
            title: '提示',
            message: '请先选择号码归属地省市再进行选号'
          })
        }
      },
      /** 打开协议 */
      onLoadProtocol() {
        vant.Dialog.alert({
          className: 'tencentKing',
          title: '用户入网协议',
          messageAlign: 'left',
          message: cmccflowerXY()
        })
      },
      /** 打开隐私权协议 **/
      onLoadProtocolYinsi() {
        vant.Dialog.alert({
          className: 'tencentKing',
          title: '隐私权政策',
          messageAlign: 'left',
          message: cmccflowerYS()
        })
      },
      /** 打开个人信息收集证明 **/
      onLoadProtocolPersonInfo() {
        vant.Dialog.alert({
          className: 'tencentKing',
          title: '个人信息收集证明',
          messageAlign: 'left',
          message: cmccflowerPersonInfo()
        })
      },
      /** 发送验证码 */
      async onSendSms() {
        if (phoneCheck(this.ruleForm.mobilePhone) !== 'ok') {
          vant.Dialog.alert({
            title: '提示',
            message: phoneCheck(this.ruleForm.mobilePhone)
          })
          return
        }
        this.smsLoading = true;
        try{
          let {data} = await sendSMS({
            phone: this.ruleForm.mobilePhone
          })
          this.smsTitle = 60
          if (this.configData.content) {
            new Function(this.configData.content)()
          }
          let str = setInterval(() => {
            this.smsTitle = this.smsTitle - 1
            if (this.smsTitle == 0) {
              this.smsLoading = false
              clearInterval(str)
              this.smsTitle = '短信验证码'
            }
          }, 1000)
        }catch(error){
          this.smsLoading = false
          vant.Dialog.alert({
            title: '温馨提示',
            message: '网络不好请重试'
          })
        }
      },
      /** 下单 */
      async onTradeOrder() {
        if (this.radio != '1') {
          vant.Dialog.alert({
            title: '提示',
            message: '请勾选入网协议'
          })
          return
        }
        if (this.loading) {
          return
        }
        if (nameCheck(this.ruleForm.certificateName) != 'ok') {
          vant.Dialog.alert({
            title: '提示',
            message: nameCheck(this.ruleForm.certificateName)
          })
          return
        }

        if (
          idNoCheck(
            this.ruleForm.certificateNumber,
            this.configData.minAge,
            this.configData.maxAge
          ) != 'ok'
        ) {
          vant.Dialog.alert({
            title: '提示',
            message: idNoCheck(
              this.ruleForm.certificateNumber,
              this.configData.minAge,
              this.configData.maxAge
            )
          })
          return
        }

        let phoneCheckMessage = phoneCheck(this.ruleForm.mobilePhone)
        if (phoneCheckMessage != 'ok') {
          vant.Dialog.alert({
            title: '提示',
            message: phoneCheckMessage
          })
          return
        }
        if (this.configData.sms == 1) {
          if (this.ruleForm.sms) {
            if (this.ruleForm.sms.length != 6) {
              vant.Dialog.alert({
                title: '提示',
                message: '请填写6位短信验证码'
              })
              return
            }
          } else {
            vant.Dialog.alert({
              title: '提示',
              message: '请填写短信验证码'
            })
            return
          }
        }

        if (!this.ruleForm.sendProvince) {
          vant.Dialog.alert({
            title: '提示',
            message: '请选择省份'
          })
          return
        }
        if (!this.ruleForm.sendCity) {
          vant.Dialog.alert({
            title: '提示',
            message: '请选择城市'
          })
          return
        }
        if (!this.ruleForm.sendDistrict) {
          vant.Dialog.alert({
            title: '提示',
            message: '请选择区'
          })
          return
        }

        if ((this.configData && this.configData.lock == 0) && !this.configData.kept) {
          if (!this.ruleForm.orderMobile) {
            vant.Dialog.alert({
              title: '提示',
              message: '请选择号码'
            })
            return
          }
        }

        if (!this.ruleForm.address) {
          vant.Dialog.alert({
            title: '提示',
            message: '请填写具体地址'
          })
          return
        }
        if (this.ruleForm.address.length < 6) {
          vant.Dialog.alert({
            title: '提示',
            message: '填写地址太短'
          })
          return
        }
        this.loading = true

        try{
          let {data} = await tradeOrder({
            address: this.ruleForm.address,
            certificateName: this.ruleForm.certificateName,
            certificateNumber: this.ruleForm.certificateNumber,
            goodsCityCode: this.ruleForm.goodsCityCode,
            linkNum: getQueryVariable('no'),
            mobilePhone: this.ruleForm.mobilePhone,
            numberCheckCode: this.ruleForm.numberCheckCode,
            numberLockSequence: this.ruleForm.numberLockSequence,
            orderMobile: this.ruleForm.orderMobile,
            sendDistrictCode: this.ruleForm.sendDistrictCode,
            sms: this.ruleForm.sms,
            kept: this.configData.kept//存单
          })
          this.loading = false
          if (this.configData.kept) {
            location.href = 'successfully.html?pageId=' + data.succPageId
            return
          }
          if (data.realNameAuth == true) {
            location.href = 'upload.html?orderNo=' + data.commonOrderId + '&pageId=' + this.configData.succPageId
            return
          }

          try {
            if (this.configData.content) {
              new Function(this.configData.content)()
            }
          } catch (error) {

          } finally {
            if (this.configData.apiType) {
              saveToutiao(this, data.id)
            }
            location.href = 'successfully.html?pageId=' + this.configData.succPageId
          }
        }catch(err){
          this.loading = false
        }

      }

    }
  }
</script>
