<style>
    .ivu-input {
        display: inline-block;
        width: 100%;
        height: 28px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
    }
    .classKh {
        display: inline;
        width:40%;
        height: 28px;
        padding: 4px 0px;
        position: relative;
        vertical-align: middle;
        line-height: normal;
    }
    .div-inline{
        display: inline;
        padding: 4px 7px;
    }
    .ivu-input-wrapper {
        display: inline-block;
        width: 66%;
        position: relative;
        vertical-align: middle;
        line-height: normal;
    }
    .classAll {
        padding:4px 7px ;
    }
    /* .ivu-layout-sider{
        width: 240px   ! important ;
        min-width: 240px  ! important ;
    }
    .padding{
        padding: 2px 7px;
    }
    .ivu-menu {
        min-height: 580px;
} */
</style>
<template>
<div>
    <collospe-menu-layout :menu-width="220">
            <div slot="menu">
                <div class="classAll" >
                    <div id="123" class="classKh">客户检索:</div><div class="div-inline"><Input  size="small" v-model="keywords" clearable/></div>
                </div>
                <Menu :active-name="activeMenu"  accordion class="left-menu-scrollbar" slot="menu" theme="light" width="auto">
                    <MenuItem :key="key" :name="item.id" :title="item.customerAbbreviation"
                              v-for="(item, key) in menuList"
                              v-if="item.show">
                        <i class="iconfont icon-customer"></i>
                        <span>{{item.customerAbbreviation}}</span>
                        <Spin size="large" fix v-if="spinShow"></Spin>
                    </MenuItem>
                </Menu>
                <Scroll :on-reach-bottom="handleReachBottom">
                    <Card dis-hover v-for="(item, index) in list1" :key="index" style="margin: 32px 0">
                        Content {{ item }}
                    </Card>
                </Scroll>
            </div>
            <div class="page-box" slot="content">
                <Card>
                    <div>
                        <Table border ref="selection" :columns="columns4" :data="data1"></Table>
                        <!-- <Button @click="handleSelectAll(true)">Set all selected</Button>
                        <Button @click="handleSelectAll(false)">Cancel all selected</Button> -->
                    </div>
                </Card>
            </div>
        </collospe-menu-layout>
</div>
</template>
<script>
import CollospeMenuLayout from '@/components/collospe-menu-layout/index'
export default {
  components: {
    CollospeMenuLayout
  },
  data () {
    return {
      keywords: '',
      menuList: [],
      activeMenu: null,
      columns4: [],
      data1: [],
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      spinShow: true
    }
  },
  methods: {
    initMenuData () {
      // this.$Spin.show()
      this.spinShow = true
      let allCustomer = {
        id: -1,
        customerName: '全部',
        customerAbbreviation: '全部',
        show: true
      }
      this.menuList = [allCustomer]
      let addObj = {
        id: 13,
        cusromerName: '接口调用添加公司',
        customerAbbreviation: '接口调用添加公司',
        show: true
      }
      let abbdata = [
        {
          id: 1,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 2,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 3,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 4,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 5,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 6,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 7,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 8,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 9,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        },
        {
          id: 10,
          cusromerName: '接口调用添加公司',
          customerAbbreviation: '接口调用添加公司',
          show: true
        }
      ]
      this.menuList.push(addObj)
      //   for (let index in data.returnData) {
      //     data.returnData[index]['show'] = true
      //   }
      // this.menuList = this.menuList.concat(data.returnData)
      //   if (this.menuList.length > 0) {
      //     this.$nextTick(() => {
      //       if (this.activeMenu == null) {
      //         this.activeMenu = this.menuList[0].id
      //       }
      //       this.initGridData()
      //     })
      //   }
      this.menuList = this.menuList.concat(abbdata)
      //   setTimeout(() => {
      //     this.$Spin.hide()
      //   }, 3000)
      setTimeout(() => {
        this.spinShow = false
      }, 3000)
    //   let customerBody = {
    //     settlementType: 1
    //   }
    //   customerInfoApi
    //     .getCustomerInfoListByKeywords(customerBody)
    //     .then(({ data }) => {
    //       if (data.returnCode === 200) {
    //         let allCustomer = {
    //           id: -1,
    //           customerName: '全部',
    //           customerAbbreviation: '全部',
    //           show: true
    //         }
    //         this.menuList = [allCustomer]
    //         for (let index in data.returnData) {
    //           data.returnData[index]['show'] = true
    //         }
    //         this.menuList = this.menuList.concat(data.returnData)
    //         if (this.menuList.length > 0) {
    //           this.$nextTick(() => {
    //             if (this.activeMenu == null) {
    //               this.activeMenu = this.menuList[0].id
    //             }
    //             this.initGridData()
    //           })
    //         }
    //       } else {
    //         this.$util.msgWarning(this.$t(data.returnMsg))
    //       }
    //       this.menuLoading = false
    //     })
    },
    // keywords (val) {
    //   this.activeMenu = null
    //   if (val !== null && val !== '') {
    //     const fieldList = ['customerName', 'customerCode', 'customerAbbreviation', 'mnemonicCode']
    //     this.menuList.forEach(item => {
    //       item.show = false
    //       fieldList.forEach(field => {
    //         let baseStr = item[field] + ''
    //         if (baseStr !== '' && baseStr.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >= 0) {
    //           item.show = true
    //         }
    //       })
    //     })
    //   } else {
    //     for (let index in this.menuList) {
    //       this.menuList[index].show = true
    //     }
    //   }
    // },
    onMenuSelect (item) {
      this.activeMenu = item
      this.initGridData()
    },
    changeDivCss () {

    },
    handleReachBottom () {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1]
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i)
          }
          resolve()
        }, 2000)
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    }
  },
  created () {},
  mounted () {
    this.initMenuData()
  }
}
</script>
