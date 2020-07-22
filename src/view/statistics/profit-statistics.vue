
<style lang="less" scoped>
    .list-group-item i{
        cursor: pointer;
    }
    .statistics-table .el-table__header tr th{
        padding: 0;
    }
    .ivu-card{
        height: 600px;
    }
</style>
<template>
    <div>
        <menu-content-layout menuWidth="250" :menu-tab="false">
            <div slot="menu" class="pd-5">
                <statistics-search-info @on-search="loadData" :loading.sync="tableData.loading" type="profit"></statistics-search-info>
            </div>
            <div class="page-box" slot="content">
                <Card style="height:650px">
                    <Row class="mb-10">
                        <i-col span="12">
                            <menu-content-layout-title class="flex-none" style="width: 150px;">利润统计</menu-content-layout-title>
                        </i-col>
                        <i-col span="5">
                            <Button size="small" type="primary" @click="exportData()">导出</Button>
                        </i-col>
                        <i-col span="5" offset="2">
                            <Input size="small" v-model="keywords"  icon="search" placeholder="全文搜索"/>
                        </i-col>
                    </Row>
                    <!-- show-summary -->
                    <!-- :height="calc(100vh - 150px)" -->
                    <el-table
                            class="statistics-table"
                            :data="tableData3[0].list"
                            height="calc(100vh - 511px)"
                            border
                            style="width: 100%;"
                            size="mini"
                            @select="onRowSelect"
                            @select-all="onRowSelect"
                            @row-contextmenu="onRowContentMenu"
                            @header-dragend="onHeaderDragend"
                            ref="multipleTable"
                            :summary-method="getSummaries"
                            :filter-method="tableFilterHandler"
                            :loading="tableData.loading"
                            @row-dblclick="onDblClick"
                            highlight-current-row
                            @sort-change="onTableSort"
                    >
                        <el-table-column
                                type="selection"
                                width="36">
                        </el-table-column>
                        <el-table-column
                                label="编号"
                                type="index"
                                width="50"
                                align="center">
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
                                    <!-- <template slot-scope="childScope">
                                        <template v-if="itemChild.type !== 'template'">
                                            {{$util.tableRowFormat(childScope.row, itemChild)}}
                                        </template>
                                        <template v-else>
                                            <table-cell-render :row="childScope.row" :option="itemChild"></table-cell-render>
                                        </template>
                                    </template> -->
                                </el-table-column>
                            </template>
                            <!-- <template slot-scope="scope">
                                <template v-if="item.type !== 'template'">
                                    {{$util.tableRowFormat(scope.row, item)}}
                                </template>
                                <template v-else>
                                    <table-cell-render :row="scope.row" :option="item"></table-cell-render>
                                </template>
                            </template> -->
                        </el-table-column>
                    </el-table>
                    <!-- <el-table
                        :data="tableData3[0].list"
                        style="width: 100%">
                        <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址">
                        </el-table-column>
                    </el-table> -->
                </Card>
            </div>
        </menu-content-layout>
    </div>

</template>

<script>
import MenuContentLayout from '@/components/menu-content-layout/index'
import TableOptions from '@/components/table/table-options/index'
import SearchModalTitle from '@/components/search-modal/search-modal-title/index'
import MenuContentLayoutTitle from '@/components/menu-content-layout/title/index'
// import api from '@/api/statistics/billStatistics';
import StatisticsSearchInfo from './statistics-search-info'
// import fileDownload from 'js-file-download';
import ICol from '@/components/grid/col'
export default {
  // name: 'profit-statistics',
  components: {
    ICol,
    'statistics-search-info': StatisticsSearchInfo,
    SearchModalTitle,
    TableOptions,
    'menu-content-layout': MenuContentLayout,
    'menu-content-layout-title': MenuContentLayoutTitle
  },
  data () {
    return {
      keywords: '',
      selection: [],
      selectRows2Excel: [],
      searchForm: {},
      opt: '',
      tableData3: [{
        selectedRow: null,
        pageNum: 1,
        pages: 1,
        size: 10,
        total: 0,
        sortList: [],
        filterList: [],
        columnList: [
          {
            title: 'code',
            key: 'code',
            width: 100
          },
          //   {
          //     title: this.$t('companySet.chineseName'),
          //     key: 'chineseName',
          //     width: 100
          //   },
          //   {
          //     title: this.$t('companySet.englishName'),
          //     key: 'englishName',
          //     width: 100
          //   },
          //   {
          //     title: this.$t('bsCode.freezeFlag'),
          //     key: 'freezeFlag',
          //     width: 100,
          //     type: 'format',
          //     format: {
          //       '0': '正常',
          //       '1': '冻结'
          //     }
          //   },
          //   {
          //     title: this.$t('bsCode.remark'),
          //     key: 'remark',
          //     width: 100
          //   },

          {
            title: '创建时间',
            key: 'createdTime',
            width: 150,
            type: 'datetime'
          }
        ],
        list: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        loading: true
      }],
      //   tableData: {
      //     searchKey: '',
      //     selectedRow: null,
      //     sortList: [],
      //     list: [],
      //     loading: false
      //   },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      columns: [
        {
          title: '客户ID',
          key: 'bodyNo',
          align: 'center',
          type: 'text',
          width: 120,
          show: true,
          sortable: true
        },
        {
          title: '客户名称',
          key: 'bodyName',
          align: 'center',
          type: 'text',
          width: 200,
          show: true,
          sortable: true
        },
        {
          title: '票数',
          key: 'orderCount',
          align: 'center',
          type: 'int',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '利润',
          key: 'profit',
          align: 'right',
          type: 'numCommas',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '利润率',
          key: 'profitRatio',
          align: 'right',
          type: 'percent',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '比率',
          key: 'ratio',
          align: 'right',
          type: 'percent',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '其中',
          key: 'other',
          align: 'center',
          width: 200,
          show: true,
          children: [
            {
              title: '美元利润',
              key: 'usdProfit',
              align: 'right',
              type: 'numCommas',
              width: 100,
              show: true,
              sortable: true
            },
            {
              title: '人民币利润',
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
          title: '应收本位币',
          key: 'amountReceivable',
          align: 'right',
          type: 'numCommas',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '实收本位币',
          key: 'standardMoneyReceipt',
          align: 'right',
          type: 'numCommas',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '应付本位币',
          key: 'amountPayable',
          align: 'right',
          type: 'numCommas',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '实付本位币',
          key: 'standardMoneyPaid',
          align: 'right',
          type: 'numCommas',
          width: 100,
          show: true,
          sortable: true
        },
        {
          title: '货量',
          key: 'containerWeight',
          align: 'center',
          width: 280,
          show: true,
          children: [
            {
              title: '20\'',
              key: 'x20',
              align: 'center',
              type: 'int',
              width: 70,
              show: true,
              sortable: true
            },
            {
              title: '40\'',
              key: 'x40',
              align: 'center',
              type: 'int',
              width: 70,
              show: true,
              sortable: true
            },
            {
              title: '其它箱型',
              key: 'xOther',
              align: 'center',
              type: 'int',
              width: 90,
              show: true,
              sortable: true
            },
            {
              title: 'Teu',
              key: 'teu',
              align: 'center',
              precision: 1,
              width: 70,
              show: true,
              sortable: true
            },
            {
              title: 'CBM',
              key: 'measurement',
              align: 'center',
              precision: 3,
              width: 80,
              show: true,
              sortable: true
            },
            {
              title: 'KGS',
              key: 'statisticsKgs',
              align: 'center',
              precision: 3,
              width: 80,
              show: true,
              sortable: true
            }
          ]
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
        if (this.keywords.trim() !== '') {
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
      this.searchForm['bodyNo'] = row.bodyNo
      this.$router.push({
        name: 'profit-detail-statistics',
        params: {
          searchForm: this.searchForm,
          bodyName: (row.bodyName === null) ? '无' : row.bodyName,
          opt: this.opt,
          op: 'refresh'
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
    //     onUpdate(event) {
    //         this.columns.splice(event.newIndex, 0, this.columns.splice(event.oldIndex, 1)[0])
    //     },
    //     orderList () {
    //         this.list = this.list.sort((one,two) =>{return one.order-two.order; })
    //     },
    //     onMove ({relatedContext, draggedContext}) {
    //         const relatedElement = relatedContext.element;
    //         const draggedElement = draggedContext.element;
    //         return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    //     },
    onRowContentMenu (row, event) {
      this.rightClickRow = row
    // this.$refs.tableContextMenu.open(event);
    },
    //     // onRowClick (row, event, column) {
    //     //     this.$refs.multipleTable.clearSelection();
    //     //     this.$refs.multipleTable.toggleRowSelection(row);
    //     //     this.selectRows2Excel = [];
    //     //     for (let i in row){
    //     //         let obj = {
    //     //             id:row[i].bodyNo,
    //     //             name:row[i].bodyName
    //     //         }
    //     //         this.selectRows2Excel.push(obj)
    //     //     }
    //     // },
    //     onSubmit () {
    //         this.initData();
    //     },
    loadData (searchForm, opt) {
      this.tableData.loading = true
      this.searchForm = searchForm
      this.opt = opt.statisticalTypeObj[searchForm.statisticalType]
      //   api.selectProfitStatistics(searchForm).then(({ data }) => {
      //     this.tableData.loading = false
      //     if (data.returnCode === 200) {
      //       let profitSum = 0
      //       data.returnData.forEach(item => {
      //         if (item.profit) {
      //           profitSum = (parseFloat(profitSum) + parseFloat(item.profit)).toFixed(2)
      //         }
      //       })
      //       data.returnData.forEach(item => {
      //         if (item.profit && profitSum != 0) {
      //           item.ratio = (parseFloat(item.profit / profitSum) * 100).toFixed(2)
      //         } else {
      //           item.ratio = 0
      //         }
      //       })
      //       this.columns[0].title = opt.statisticalTypeObj[searchForm.statisticalType] + 'ID'
      //       this.columns[1].title = opt.statisticalTypeObj[searchForm.statisticalType] + '名称'
      //       this.tableData.list = this.$util.formatReturnData(data.returnData, this.columns)
      //     } else {
      //       this.$Message.warning('数据异常,请重试！')
      //     }
      //   })
      this.tableData.loading = false
    },
    initData () {
      this.tableData.selectedRow = null
      this.tableData.list = []
      this.keywords = ''
    },
    onRowSelect (row) {
      this.selectRows2Excel = []
      for (let i in row) {
        let obj = {
          id: row[i].bodyNo,
          name: row[i].bodyName
        }
        this.selectRows2Excel.push(obj)
      }
    },
    exportData () {
      if (this.tableData.list.length <= 0) {
        this.$Message.warning('暂无数据可导出！')
        // return
      }
    //   let queryExcelBody = {
    //     type: '1',
    //     tableWord: this.columns,
    //     billStatisticsSearchDto: this.searchForm,
    //     title: this.opt + '利润统计(' + this.searchForm.startDate + ' 至 ' + this.searchForm.endDate + ')',
    //     sortList: this.tableData.sortList
    //   }
    //  const timestamp = new Date().getTime()
    //   api.exportData(queryExcelBody).then(response => {
    //     if (response.status == 200) {
    //       fileDownload(response.data, '利润统计_' + timestamp + '.xls')
    //     } else {
    //       this.$Message.warning('导出失败！')
    //     }
    //   }).catch(error => {
    //     this.$Notice.error({
    //       title: '发生错误'
    //     })
    //   })
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
    // this.columns = this.$util.copy(this.columns)
    this.initData()
  }
}
</script>
