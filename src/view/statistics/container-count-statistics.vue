
<style>
    .list-group-item i{
        cursor: pointer;
    }
    .statistics-table .el-table__header tr th{
        padding: 0;
    }
</style>
<template>
    <div>
        <menu-content-layout menuWidth="250" :menu-tab="false">
            <div slot="menu" class="pd-5">
                <statistics-search-info @on-search="loadData" :loading.sync="tableData.loading" type="container"></statistics-search-info>
            </div>
            <div class="page-box" slot="content">
                <Card>
                    <Row class="mb-10">
                        <i-col span="12">
                            <menu-content-layout-title class="flex-none" style="width: 150px;">箱量统计</menu-content-layout-title>
                        </i-col>
                        <i-col span="5">
                            <Button size="small" type="primary" @click="exportData()">导出</Button>
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
                    <!--<context-menu ref="tableContextMenu">
                    </context-menu>-->
                    <!--<table-options style="bottom: 54px;" name="test" :data.sync="columns" :base-data="columns" :column-width-obj="columnWidthObj"></table-options>-->
                </Card>
            </div>
        </menu-content-layout>
    </div>

</template>

<script>
import TableOptions from '@/components/table/table-options/index'
import SearchModalTitle from '@/components/search-modal/search-modal-title/index'
import api from '@/api/statistics/billStatistics'
import StatisticsSearchInfo from './statistics-search-info'
import fileDownload from 'js-file-download'
export default {
  name: 'container-count-statistics',
  components: {
    StatisticsSearchInfo,
    SearchModalTitle,
    TableOptions
  },
  data () {
    return {
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
          title: '客户ID',
          key: 'bodyNo',
          align: 'center',
          type: 'text',
          width: 80,
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
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '20\'GP',
          key: 'x20GP',
          align: 'center',
          width: 70,
          show: true,
          sortable: true
        },

        {
          title: '20\'RF',
          key: 'x20RF',
          align: 'center',
          width: 70,
          show: true
        },
        {
          title: '40\'GP',
          key: 'x40GP',
          align: 'center',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '40\'RF',
          key: 'x40RF',
          align: 'center',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '40\'HC',
          key: 'x40HC',
          align: 'center',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '40\'RH',
          key: 'x40RH',
          align: 'center',
          width: 70,
          show: true,
          sortable: true
        },
        {
          title: '其它',
          key: 'other1',
          align: 'center',
          show: true,
          children: [
            {
              title: '20\'',
              key: 'x20Special',
              align: 'center',
              width: 70,
              show: true,
              sortable: true
            },
            {
              title: '40\'',
              key: 'x40Special',
              align: 'center',
              width: 70,
              show: true,
              sortable: true
            },
            {
              title: '特殊',
              key: 'otherSpecial',
              align: 'center',
              width: 70,
              show: true,
              sortable: true
            }
          ]
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
          title: '比率',
          key: 'ratio',
          align: 'right',
          type: 'percent',
          width: 70,
          show: true,
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
      this.searchForm['bodyNo'] = row.bodyNo
      this.$router.push({
        name: 'container-count-detail-statistics',
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
      // this.$refs.tableContextMenu.open(event);
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
      this.searchForm = searchForm
      this.opt = opt.statisticalTypeObj[searchForm.statisticalType]
      api.selectContainerCountStatistics(searchForm).then(({ data }) => {
        this.tableData.loading = false
        if (data.returnCode === 200) {
          let teuSum = 0
          data.returnData.forEach(item => {
            if (item.teu) {
              teuSum = (parseFloat(teuSum) + parseFloat(item.teu)).toFixed(2)
            }
          })
          data.returnData.forEach(item => {
            if (item.teu && teuSum != 0) {
              item.ratio = (parseFloat(item.teu / teuSum) * 100).toFixed(2)
            } else {
              item.ratio = 0
            }
          })
          this.columns[0].title = opt.statisticalTypeObj[searchForm.statisticalType] + 'ID'
          this.columns[1].title = opt.statisticalTypeObj[searchForm.statisticalType] + '名称'
          this.tableData.list = this.$util.formatReturnData(data.returnData, this.columns)
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
    },
    initData () {
      this.tableData.selectedRow = null
      this.tableData.list = []
      this.keywords = ''
    },
    exportData () {
      if (this.tableData.list.length <= 0) {
        this.$Message.warning('暂无数据可导出！')
        return
      }
      let queryExcelBody = {
        type: '5',
        tableWord: this.columns,
        billStatisticsSearchDto: this.searchForm,
        title: this.opt + '箱量统计(' + this.searchForm.startDate + ' 至 ' + this.searchForm.endDate + ')',
        sortList: this.tableData.sortList
      }
      const timestamp = new Date().getTime()
      api.exportData(queryExcelBody).then(response => {
        if (response.status == 200) {
          fileDownload(response.data, '箱量统计_' + timestamp + '.xls')
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
          sums[index] = '总量'
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
  created () {
    this.columns = this.$util.copy(this.columns)
    this.initData()
  }
}
</script>
