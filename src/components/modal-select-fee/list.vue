<template>
    <div>
        <el-table
                :data="tableData[0].list"
                height="'calc(100vh - 350px)'"
                border
                style="width: 100%"
                size="mini"
                @row-dblclick="onRowDblClick"
                highlight-current-row
                @current-change="selectionChange"
                oncontextmenu="return false;"
                ref="multipleTable"
                sortable="custom">
            <el-table-column
                    v-for="(item, key) in tableData[0].columnList" :key="key"
                    :prop="item.key"
                    :label="item.title"
                    :width="item.width"
                    :sortable="item.sortable!==undefined?'custom': false"
                    :show-overflow-tooltip="true">
                <!-- <template slot-scope="scope">
                    <template v-if="item.title !== '冻结' ">
                        {{$util.tableRowFormat(scope.row, item)}}
                    </template>
                    <template v-if="item.title === '冻结' ">
                        <Tag :color="scope.row.freezeFlag === '0' ? 'blue' : 'red' ">
                            {{$util.tableRowFormat(scope.row, item)}}
                        </Tag>
                    </template>
                </template> -->
            </el-table-column>
        </el-table>
        <Page class="mt-10" :total="tableData[0].total" :page-size="tableData[0].size" :page-size-opts="tableData[0].pageOptionsList" @on-change="onGridPageChange" @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer placement="top"></Page>
    </div>
</template>

<script>
// import api from '@/api/codec/fee_setting';
// import businessCodeApi from '@/api/codec/business_code';
// import businessTypeList from '@/views/codec/fee_setting/businessTypeList';
// import _ from 'lodash'
export default {
  name: 'fee_setting',
  props: {
    businessType: {
      type: String,
      default: 'HD'
    },
    searchKey: {
      type: String,
      default: ''
    },
    tableHeight: {
      type: String,
      default: 'calc(100vh - 350px)'
    }
  },
  data () {
    let _this = this
    return {
      // 币种列表
      defaultCurrencyList: [],
      // 客户属性列表
      chargingObjectList: [
        {
          title: '订舱客户',
          customerProperty: 'a'
        },
        {
          title: '订舱代理',
          customerProperty: 'b'
        },
        {
          title: '场站',
          customerProperty: 'c'
        },
        {
          title: '车队',
          customerProperty: 'd'
        },
        {
          title: '船代',
          customerProperty: 'e'
        },
        {
          title: '海外代理',
          customerProperty: 'f'
        },
        {
          title: '国内代理',
          customerProperty: 'g'
        },
        {
          title: '报关行',
          customerProperty: 'h'
        },
        {
          title: '快递公司',
          customerProperty: 'i'
        },
        {
          title: '部门',
          customerProperty: 'j'
        },
        {
          title: '地面服务',
          customerProperty: 'k'
        },
        {
          title: '其他',
          customerProperty: 'l'
        }
      ],
      tableData: {
        pageNum: 1,
        pages: 1,
        size: this.$store.state.sysSettings.pageSize,
        pageOptionsList: this.$store.state.sysSettings.pageOptionsList,
        total: 0,
        sortList: [],
        filterList: [],
        columnList: [
          {
            title: '业务类型',
            key: 'businessType',
            width: 100,
            type: 'func'
            // func(row, key) {
            //     let name = '';
            //     _this.businessTypeList.forEach(item => {
            //         if (row.businessType === item.code) {
            //             name = item.name;
            //         }
            //     });
            //     return name;
            // }
          },
          {
            title: this.$t('feeSettings.feeCh'),
            key: 'feeCh',
            width: 150
          },
          {
            title: this.$t('feeSettings.feeEh'),
            key: 'feeEh',
            width: 150
          },
          {
            title: this.$t('feeSettings.mnemonicCode'),
            key: 'mnemonicCode',
            width: 100
          },
          {
            title: this.$t('feeSettings.defaultCurrency'),
            key: 'defaultCurrency',
            width: 100
          },
          {
            title: '计费单位',
            key: 'chargeUnit',
            width: 100,
            type: 'func',
            func (row, key) {
              let name = ''
              _this.chargeUnitList.forEach(item => {
                if (row.chargeUnit === item.code) {
                  name = item.name
                }
              })
              return name
            }
          }
        ],
        list: []
      },
      selectRow: null,
      chargeUnitList: []
      // businessTypeList: businessTypeList
    }
  },
  methods: {
    onGridPageChange (pageNum) {
      this.tableData.pageNum = pageNum
      this.initGridData()
    },
    onGridPageSizeChange (size) {
      this.tableData.pageNum = 1
      this.tableData.size = size
      this.initGridData()
    },
    selectionChange (selectRow) {
      this.selectRow = selectRow
      this.$emit('on-select-change', selectRow)
    },
    onRowDblClick (row) {
      this.$emit('on-db-select', row)
    },
    initGridData () {
      // let body = {
      //     pageNum: this.tableData.pageNum,
      //     pageSize: this.tableData.size,
      //     filterList: this.tableData.filterList,
      //     sortList: this.tableData.sortList,
      //     searchKey: this.searchKey,
      //     businessType: this.businessType
      // };
      // api.getFeeSettingList(body).then(({ data }) => {
      //     if (data.returnCode === 200) {
      //         this.tableData.list = data.returnData.pageInfo.list;
      //         this.tableData.total = data.returnData.pageInfo.total;
      //     } else {
      //         this.$Message.warning('数据异常,请重试！');
      //     }
      // });
    },
    // 获取币种列表
    getCurrency () {
      this.defaultCurrencyList = {}
      // businessCodeApi.getCurrency().then(response => {
      //     this.defaultCurrencyList = response.data.returnData;
      // });
    },
    // 获取计费单位
    getChargeUnitList () {
      this.chargeUnitList = {}
      // api.getFeeChargeUnit().then(response => {
      //     if (response.data.returnCode === 200) {
      //         this.chargeUnitList = response.data.returnData;
      //     }
      // });
    }
  },
  created () {
    this.initGridData()
    this.getCurrency()
    this.getChargeUnitList()
  }
}

</script>
<style scoped>
</style>
