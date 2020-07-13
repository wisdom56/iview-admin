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
</style>
<template>
    <Menu active-name="1-2" :open-names="['1']">
        <div class="classAll" >
            <div class="classKh">客户检索:</div><div class="div-inline"><Input  size="small" v-model="keywords" clearable/></div>
        </div>
        <MenuItem v-for="(item, key) in menuList" v-if="item.show" :key="key" :name="item.id" :title="item.customerAbbreviation">
            <i class="iconfont icon-customer"></i>
            <span>{{item.customerAbbreviation}}</span>
        </MenuItem>
        <MenuItem name="1">中国航空航天有限公司</MenuItem>
        <MenuItem name="2">清华大学</MenuItem>
        <MenuItem name="3">北京大学</MenuItem>
        <MenuItem name="4">国家铁路有限公司</MenuItem>
        <MenuItem name="5">中粮集团</MenuItem>
        <MenuItem name="6">雅虎中国</MenuItem>
        <MenuItem name="7">麻辣兔头有限公司</MenuItem>
        <MenuItem name="8">香辣蟹有限公司</MenuItem>
        <MenuItem name="9">双份芝士焗火腿</MenuItem>
        <MenuItem name="10">三层皇堡</MenuItem>
        <MenuItem name="11">青岛盈智科技有限公司</MenuItem>
        <MenuItem name="12">中创物流</MenuItem>
    </Menu>
</template>
<script>
export default {

  data () {
    return {
      keywords: '',
      menuList: [],
      activeMenu: null,
      menuLoading: false
    }
  },
  methods: {
    initMenuData () {
      this.menuLoading = true
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

      this.menuLoading = false
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
    }
  },
  created () {},
  mounted () {
    this.initMenuData()
  }
}
</script>
