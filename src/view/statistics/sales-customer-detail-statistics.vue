
<style>
    .list-group-item i{
        cursor: pointer;
    }
    .statistics-table .el-table__header tr th{
        padding: 0;
    }
    .ivu-tooltip, .ivu-tooltip-rel {
        display: inline-block;
        width: 100%;
    }
    .ivu-tooltip-inner {
        max-width: 400px;
        min-height: 34px;
        padding: 8px 12px;
        color: #fff;
        text-align: left;
        text-decoration: none;
        background-color: rgba(70,76,91,.9);
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        white-space: nowrap;
    }
</style>
<template>
    <div>
        <div class="page-box">
            <Card>
                <Row class="mb-10">
                    <i-col span="12">
                        <Tooltip transfer placement="top-start">
                            <div slot="content" style="width: 100%;overflow: auto ;white-space: normal !important;">
                                {{cardName}}
                            </div>
                            <menu-content-layout-title style="width: 100%;height: 24px;overflow: hidden;white-space:nowrap;text-overflow:ellipsis">{{cardName}}</menu-content-layout-title>
                        </Tooltip>
                    </i-col>
                    <i-col span="5">
                        <Button size="small" type="primary" @click="exportData()" v-show="false">导出</Button>
                    </i-col>
                    <i-col span="5" offset="2">
                        <Input size="small" v-model="keywords"  icon="search" placeholder="全文搜索"/>
                    </i-col>
                </Row>
                <el-table
                        class="statistics-table"
                        :data="onTableFilter()"
                        height="calc(100vh - 150px)"
                        border
                        style="width: 100%;"
                        size="mini"
                        @row-contextmenu="onRowContentMenu"
                        @header-dragend="onHeaderDragend"
                        ref="multipleTable"
                        :summary-method="getSummaries"
                        show-summary
                        :filter-method="tableFilterHandler"
                        v-loading="tableData.loading"
                        highlight-current-row
                        @sort-change="onTableSort"
                >
                    <el-table-column
                            type="selection"
                            width="36">
                    </el-table-column>
                    <el-table-column
                            v-for="(item, key) in columns" :key="key"
                            v-if="item.show"
                            :prop="item.key"
                            :label="item.title"
                            :width="item.width"
                            :sortable="item.sortable!==undefined?item.sortable: false"
                            :fixed="item.fixed"
                            :align="item.align"
                            header-align="center"
                            :show-overflow-tooltip="true"
                    >
                        <template v-if="item.children !== undefined">
                            <el-table-column
                                    v-if="itemChild.show"
                                    v-for="(itemChild, keyChild) in item.children" :key="keyChild"
                                    :prop="itemChild.key"
                                    :label="itemChild.title"
                                    :width="itemChild.width"
                                    :sortable="itemChild.sortable!==undefined?itemChild.sortable: false"
                                    :align="itemChild.align"
                                    header-align="center"
                                    :show-overflow-tooltip="true"
                            >
                                <template slot-scope="childScope">
                                    <template v-if="itemChild.type !== 'template'">
                                        {{$util.tableRowFormat(childScope.row, itemChild)}}
                                    </template>
                                    <template v-else>
                                        <table-cell-render :row="childScope.row" :option="itemChild"></table-cell-render>
                                    </template>
                                </template>
                            </el-table-column>
                        </template>

                        <template slot-scope="scope">
                            <template v-if="item.type !== 'template'">
                                {{$util.tableRowFormat(scope.row, item)}}
                            </template>
                            <template v-else>
                                <table-cell-render :row="scope.row" :option="item"></table-cell-render>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <!--<table-options style="bottom: 54px;" name="test" :data.sync="columns" :base-data="columns" :column-width-obj="columnWidthObj"></table-options>-->
            </Card>
            <order-modal :show.sync="showOrderModal" :order-no="modalOrderNo" :business-type="businessType"></order-modal>
        </div>
    </div>

</template>

<script>
import TableOptions from '@/components/table/table-options/index'
import SearchModalTitle from '@/components/search-modal/search-modal-title/index'
import api from '@/api/statistics/billStatistics'
import OrderModal from '../financial-management/financial-order-management/modal'
import fileDownload from 'js-file-download'
export default {
  name: 'arrears-detail-statistics',
  components: {
    OrderModal,
    SearchModalTitle,
    TableOptions
  },
  data () {
    return {
      showOrderModal: false,
      modalOrderNo: '',
      businessType: '',
      keywords: '',
      selection: [],
      tableData: {
        searchKey: '',
        selectedRow: null,
        sortList: [],
        list: [],
        loading: false
      },
      columns: [
        {
          title: '提单号',
          key: 'blNo',
          align: 'center',
          type: 'text',
          width: 150,
          show: true,
          sortable: true
        },
        {
          title: '分单号',
          key: 'interalBlNo',
          align: 'center',
          type: 'text',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '订舱客户',
          key: 'custName',
          align: 'center',
          type: 'text',
          width: 140,
          show: true,
          sortable: true
        },
        {
          title: '船东',
          key: 'shipName',
          align: 'center',
          type: 'text',
          width: 140,
          show: true,
          sortable: true
        },
        {
          title: '订舱代理',
          key: 'bookAgentName',
          align: 'center',
          type: 'text',
          width: 120,
          show: true,
          sortable: true
        },
        {
          title: '业务类型描述',
          key: 'businessType',
          align: 'center',
          type: 'text',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '目的地',
          key: 'destPort',
          align: 'center',
          type: 'text',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '离/抵港日',
          key: 'shipDate',
          align: 'center',
          type: 'date',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: 'RNO.A',
          key: 'seriNo',
          type: 'text',
          width: 100,
          show: true
        },
        {
          title: 'RNO.B',
          key: 'refNo',
          type: 'text',
          width: 100,
          show: true
        },
        {
          title: '转账日',
          key: 'bankTransferDate',
          align: 'center',
          type: 'date',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '部门',
          key: 'canvasserDept',
          align: 'center',
          type: 'text',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '销售',
          key: 'canvasserName',
          align: 'center',
          type: 'text',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '操作',
          key: 'operName',
          align: 'center',
          type: 'text',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: 'TEU',
          key: 'teu',
          align: 'center',
          precision: 1,
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '箱量描述',
          key: 'containerQty',
          align: 'center',
          type: 'text',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '件数',
          key: 'pkgsSum',
          align: 'center',
          type: 'numCommas',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '重量',
          key: 'gwSum',
          align: 'center',
          type: 'numCommas',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '尺码',
          key: 'cbmSum',
          align: 'center',
          type: 'numCommas',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '美元',
          key: 'usdGroup',
          align: 'center',
          width: 70,
          show: true,
          children: [
            {
              title: '应收',
              key: 'usdReceivable',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '应付',
              key: 'usdPayable',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '利润',
              key: 'usdProfit',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        },
        {
          title: '人民币',
          key: 'rmbGroup',
          align: 'center',
          width: 70,
          show: true,
          children: [
            {
              title: '应收',
              key: 'rmbReceivable',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '应付',
              key: 'rmbPayable',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '利润',
              key: 'rmbProfit',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        },
        {
          title: '本位币利润',
          key: 'moneyProfit',
          align: 'right',
          type: 'numCommas',
          width: 100,
          show: true,
          sortable: true
        }
      ],
      columnWidthObj: null,
      rightClickRow: {},
      formData: {},
      opt: '',
      cardName: ''
    }
  },
  methods: {
    onTableSort (result) {
      if (result.order === 'descending') {
        let sortItem = {
          sortKey: result.prop,
          sortValue: 'desc'
        }
        this.tableData.sortList = [sortItem]
      } else if (result.order === 'ascending') {
        let sortItem = {
          sortKey: result.prop,
          sortValue: 'asc'
        }
        this.tableData.sortList = [sortItem]
      } else {
        this.tableData.sortList = []
      }
    },
    onTableFilter () {
      return this.tableData.list.filter(data => {
        if (this.keywords.trim() != '') {
          for (let key in data) {
            if (data[key] != null && data[key].toString().toUpperCase().includes(this.keywords.toUpperCase())) {
              return true
            }
          }
        } else {
          return true
        }
      })
    },
    onDblClick (row) {
      loggerD(row)
      this.modalOrderNo = row.orderNo
      this.businessType = row.businessType === '01' || row.businessType === '02' || row.businessType === '03' ||
                row.businessType === '04' ? 'HD' : row.businessType === '05' || row.businessType === '06' ? 'KY' : 'WMS'
      this.showOrderModal = true
    },
    tableFilterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    onHeaderDragend (newVal, oldWidth, column) {
      this.columnWidthObj = column
    },
    onUpdate (event) {
      this.columns.splice(event.newIndex, 0, this.columns.splice(event.oldIndex, 1)[0])
    },
    orderList () {
      this.list = this.list.sort((one, two) => { return one.order - two.order })
    },
    onMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    onRowContentMenu (row, event) {
      this.rightClickRow = row
    },
    // onRowClick (row, event, column) {
    //     this.$refs.multipleTable.clearSelection();
    //     this.$refs.multipleTable.toggleRowSelection(row);
    // },
    onSubmit () {
      this.initData()
    },
    loadData () {
      let searchForm = this.searchForm
      let opt = this.opt
      this.tableData.loading = true
      api.selectSalesCustomerDetailStatistics(searchForm).then(({ data }) => {
        this.tableData.loading = false
        if (data.returnCode === 200) {
          this.tableData.list = this.$util.formatReturnData(data.returnData, this.columns)
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
    },
    checkObjEmpty (obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false
        }
      }
      return true
    },
    initData () {
      let obj = this.$route.params
      if (this.checkObjEmpty(obj)) {
        this.$router.replace({ name: 'sales-statistics' })
        return
      }
      this.tableData.selectedRow = null
      this.tableData.list = []
      this.keywords = ''
      this.searchForm = this.$route.params.searchForm
      this.opt = this.$route.params.opt
      this.cardName = '【' + this.$route.params.bodyName + '】客户销售统计'
      this.loadData()
    },
    exportData () {
      if (this.tableData.list.length <= 0) {
        this.$Message.warning('暂无数据可导出！')
        return
      }
      let queryExcelBody = {
        type: '14',
        tableWord: this.columns,
        billStatisticsSearchDto: this.searchForm,
        title: this.opt + '销售统计(' + this.searchForm.startDate + ' 至 ' + this.searchForm.endDate + ')',
        sortList: this.tableData.sortList
      }
      const timestamp = new Date().getTime()
      api.exportData(queryExcelBody).then(response => {
        if (response.status == 200) {
          fileDownload(response.data, '销售客户详情统计_' + timestamp + '.xls')
        } else {
          this.$Message.warning('导出失败！')
        }
      }).catch(error => {
        this.$Notice.error({
          title: '发生错误'
        })
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      let columnsObj = {}
      this.columns.forEach(item => {
        if (item.children !== undefined) {
          item.children.forEach(itemChild => {
            columnsObj[itemChild.key] = itemChild
          })
        } else {
          columnsObj[item.key] = item
        }
      })
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '总计'
          return
        }
        if (column.property === undefined) {
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (columnsObj[column.property].align !== undefined) {
          if (columnsObj[column.property].align === 'left') {
            column.className = 'footer-align-left'
          } else if (columnsObj[column.property].align === 'right') {
            column.className = 'footer-align-right'
          } else if (columnsObj[column.property].align === 'center') {
            column.className = 'footer-align-center'
          }
        }
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'numCommas') {
                let precision = 2
                if (columnsObj[column.property].precision) {
                  precision = columnsObj[column.property].precision
                }
                let prevNew = (prev + '').replace(/,/g, '')
                let currNew = (curr + '').replace(/,/g, '')
                return this.$util.formatNumberCommasPrecision((parseFloat(prevNew) + parseFloat(currNew)).toFixed(precision), precision)
              } else if (columnsObj[column.property].precision) {
                let precision = columnsObj[column.property].precision
                let prevNew = (prev + '').replace(/,/g, '')
                let currNew = (curr + '').replace(/,/g, '')
                return this.$util.formatNumberCommasPrecision((parseFloat(prevNew) + parseFloat(currNew)).toFixed(precision), precision)
              } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'percent') {
                return '100%'
              } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'text') {
                return ''
              } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'date') {
                return ''
              } else {
                return (prev + curr)
              }
            } else {
              return ''
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  },
  created () {
    this.columns = this.$util.copy(this.columns)
    this.initData()
  },
  activated () {
    if (this.$route.params.op !== undefined && this.$route.params.op === 'refresh') {
      this.initData()
    }
  }
}
</script>
