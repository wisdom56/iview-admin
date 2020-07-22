
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
                            height="calc(100vh - 240px)"
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
                            @row-dblclick="onDblClick"
                            highlight-current-row
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
                                @sort-change="onTableSort"
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
                    <el-table
                            class="statistics-table"
                            :data="statisticsData.list"
                            height="92px"
                            border
                            style="width: 100%;"
                            size="mini"
                            @row-contextmenu="onRowContentMenu"
                            @row-click="onRowClick"
                            @header-dragend="onHeaderDragend"
                            ref="multipleTable"
                            :filter-method="tableFilterHandler"
                            v-loading="statisticsData.loading"
                            @row-dblclick="onDblClick"
                    >
                        <el-table-column
                                v-for="(item, key) in statisticsColumns" :key="key"
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
            </div>
    </div>

</template>

<script>
import TableOptions from '@/components/table/table-options/index'
import SearchModalTitle from '@/components/search-modal/search-modal-title/index'
import api from '@/api/statistics/billStatistics'
import fileDownload from 'js-file-download'
import SalesStatisticsSearchInfo from './sales-statistics-search-info'
export default {
  name: 'sales-customer-statistics',
  components: {
    SalesStatisticsSearchInfo,
    SearchModalTitle,
    TableOptions
  },
  data () {
    return {
      cardName: '',
      keywords: '',
      selection: [],
      searchForm: {},
      opt: '',
      tableData: {
        searchKey: '',
        selectedRow: null,
        sortList: [],
        list: [],
        loading: false
      },
      columns: [
        {
          title: '客户',
          key: 'bodyName',
          align: 'center',
          type: 'text',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '票数',
          key: 'group1',
          align: 'center',
          width: 240,
          show: true,
          children: [
            {
              title: '本周/月报',
              key: 'orderCount',
              align: 'center',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '上周/月报',
              key: 'lastOrderCount',
              align: 'center',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        },
        {
          title: '箱量(TEU)',
          key: 'group2',
          align: 'center',
          width: 200,
          show: true,
          children: [
            {
              title: '本周/月报',
              key: 'teu',
              align: 'center',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '上周/月报',
              key: 'lastTeu',
              align: 'center',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        },
        {
          title: '结费(本位币)',
          key: 'group3',
          align: 'center',
          width: 200,
          show: true,
          children: [
            {
              title: '本周/月报',
              key: 'moneyPaid',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '上周/月报',
              key: 'lastMoneyPaid',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        },
        {
          title: '利润(本位币)',
          key: 'group4',
          align: 'center',
          width: 200,
          show: true,
          children: [
            {
              title: '本周/月报',
              key: 'moneyProfit',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '上周/月报',
              key: 'lastMoneyProfit',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        },
        {
          title: '欠费',
          key: 'group5',
          align: 'center',
          width: 200,
          show: true,
          children: [
            {
              title: '美元',
              key: 'usdArrears',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '人民币',
              key: 'rmbArrears',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '本位币',
              key: 'moneyArrears',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            }
          ]
        }
      ],
      statisticsData: {
        searchKey: '',
        selectedRow: null,
        sortList: [],
        list: [{ bodyName: '123' }, { bodyName: '32' }],
        loading: false
      },
      statisticsColumns: [
        {
          title: '币种',
          key: 'currencyChinese',
          align: 'center',
          type: 'text',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '合计',
          key: 'moneyArrears',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '30天内',
          key: 'agingOfAccount1',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '30-60天',
          key: 'agingOfAccount2',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '60-90天',
          key: 'agingOfAccount3',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '90-180天',
          key: 'agingOfAccount4',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '180天以上',
          key: 'agingOfAccount5',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 100,
          sortable: true
        },
        {
          title: '超期欠费总额',
          key: 'overdueArrears',
          align: 'center',
          type: 'numCommas',
          show: true,
          width: 150,
          sortable: true
        }
      ],
      columnWidthObj: null,
      rightClickRow: {}
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
      this.searchForm['custNo'] = row.bodyNo
      this.$router.push({
        name: 'sales-customer-detail-statistics',
        params: {
          searchForm: this.searchForm,
          bodyName: (row.bodyName === null) ? '无' : row.bodyName,
          name: row.bodyName,
          op: 'refresh',
          opt: this.opt
        }
      })
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
    loadData (searchForm, opt) {
      this.tableData.loading = true
      this.statisticsData.loading = true
      this.searchForm = searchForm
      api.selectSalesStatistics(searchForm).then(({ data }) => {
        this.tableData.loading = false
        if (data.returnCode === 200) {
          let arrearsSum = 0
          data.returnData.forEach(item => {
            if (item.moneyArrears) {
              arrearsSum = (parseFloat(arrearsSum) + parseFloat(item.moneyArrears)).toFixed(2)
            }
          })
          data.returnData.forEach(item => {
            if (item.moneyArrears && arrearsSum != 0) {
              item.ratio = (parseFloat(item.moneyArrears / arrearsSum) * 100).toFixed(2)
            }
          })
          this.tableData.list = this.$util.formatReturnData(data.returnData, this.columns)
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
      searchForm['type'] = 'salesArrears'
      api.selectSalesArrearsStatistics(searchForm).then(({ data }) => {
        this.statisticsData.loading = false
        if (data.returnCode === 200) {
          this.statisticsData.list = data.returnData
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
      this.cardName = '【' + this.$route.params.name + '】销售统计'
      if (this.checkObjEmpty(obj)) {
        this.$router.replace({ name: 'sales-statistics' })
        return
      }
      this.tableData.selectedRow = null
      this.tableData.list = []
      this.keywords = ''
      this.searchForm = this.$route.params.searchForm
      this.loadData(this.searchForm)
    },
    exportData () {
      if (this.tableData.list.length <= 0) {
        this.$Message.warning('暂无数据可导出！')
        return
      }
      let queryExcelBody = {
        type: '13',
        tableWord: this.columns,
        billStatisticsSearchDto: this.searchForm,
        title: this.cardName,
        sortList: this.tableData.sortList
      }
      const timestamp = new Date().getTime()
      api.exportData(queryExcelBody).then(response => {
        if (response.status == 200) {
          fileDownload(response.data, '销售详情统计_' + timestamp + '.xls')
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
                let prevNew = (prev + '').replace(/,/g, '')
                let currNew = (curr + '').replace(/,/g, '')
                return this.$util.formatNumberCommas((parseFloat(prevNew) + parseFloat(currNew)).toFixed(2))
              } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'percent') {
                return '100%'
              } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'text') {
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
  activated () {
    if (this.$route.params.op !== undefined && this.$route.params.op === 'refresh') {
      this.initData()
    }
  },
  created () {
    this.columns = this.$util.copy(this.columns)
    this.initData()
  }
}
</script>
