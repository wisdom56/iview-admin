<template>
    <div class="page-box">
        <Card>
            <Row class="mb-10">
                <i-col span="2">
                    <page-title>对账</page-title>
                </i-col>
                <i-col span="4" style="text-align: right;" class="pr-10">
                    <Button size="small" type="primary" @click="addModalShow = true">新增</Button>
                    <Button size="small" type="primary" :disabled="leftTableData.selectedRow === null" @click="editModalShow = true">编辑</Button>
                    <Button size="small" type="primary" :disabled="leftTableData.selectedRow === null" @click="onDel">删除</Button>
                </i-col>
                <i-col span="4">
                    <Button size="small" type="primary" :disabled="leftTableData.selectedRow === null" @click="executeAccount">执行对账</Button>
                </i-col>
            </Row>
            <Row>
                <i-col span="8" class="pr-10">
                    <el-table
                            class="mb-10"
                            :data="leftTableData.list"
                            height="calc(100vh - 180px)"
                            border
                            style="width: 100%"
                            size="mini"
                            @row-contextmenu="onRowContentMenu"
                            @row-click="onRowClick"
                            oncontextmenu="return false;"
                            highlight-current-row
                            @current-change="leftCurrentChange"
                            ref="leftTable"
                    >
                        <el-table-column
                                label="编号"
                                type="index"
                                align="center"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                v-for="(item, key) in leftTableData.columnList" :key="key"
                                :prop="item.key"
                                :label="item.title"
                                :width="item.width"
                                :sortable="item.sortable!==undefined?'custom': false"
                                highlight-current-row
                                :show-overflow-tooltip="true"
                        >
                            <template slot-scope="scope">
                                {{$util.tableRowFormat(scope.row, item)}}
                            </template>
                        </el-table-column>
                    </el-table>
<!--                    <Page class="mt-10"-->
<!--                          :total="leftTableData.total"-->
<!--                          :page-size="leftTableData.size"-->
<!--                          :page-size-opts="leftTableData.pageOptionsList" @on-change="onGridPageChange"-->
<!--                          @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer-->
<!--                          placement="top"></Page>-->
                </i-col>
                <i-col span="16">
                    <el-table
                            :data="rightTableData.list"
                            height="calc(100vh - 180px)"
                            border
                            style="width: 100%"
                            size="mini"
                            @row-contextmenu="onRowContentMenu"
                            oncontextmenu="return false;"
                            highlight-current-row
                            @current-change="rightCurrentChange"
                            ref="rightTable"
                    >
                        <el-table-column
                                label="编号"
                                type="index"
                                align="center"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                v-for="(item, key) in rightTableData.columnList" :key="key"
                                :prop="item.key"
                                :label="item.title"
                                :width="item.width"
                                :sortable="item.sortable!==undefined?'custom': false"
                                highlight-current-row
                                :show-overflow-tooltip="true"
                        >
                            <template slot-scope="scope">
                                {{$util.tableRowFormat(scope.row, item)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </i-col>
            </Row>
            <execute-check-account-modal :show.sync="executeModalShow" :scheme-data="leftTableData.selectedRow"></execute-check-account-modal>
            <modal-checking-account :show.sync="addModalShow" @on-change="onChange"></modal-checking-account>
            <modal-checking-account-edit :show.sync="editModalShow" :data="this.leftTableData.selectedRow" @on-change="onChange"></modal-checking-account-edit>
        </Card>
    </div>

</template>
<script>
import math from 'mathjs'
import XLSX from 'xlsx'
import ModalCheckingAccount from '@/components/modal/modal-checking-account/index'
import ModalCheckingAccountEdit from '@/components/modal/modal-checking-account-edit/index'
import PageTitle from '@/components/page/title/index'
import api from '@/api/financial/checkingAccount'
import apiBusinessCode from '@/api/codec/business_code'
import ExecuteCheckAccountModal from '@/views/statistics/execute-check-account-modal'
export default {
  components: {
    ExecuteCheckAccountModal,
    ModalCheckingAccount,
    ModalCheckingAccountEdit,
    PageTitle
  },
  name: 'checking-account',
  data () {
    return {
      executeModalShow: false,
      addModalShow: false,
      editModalShow: false,
      file: null,
      data: [],
      fieldList: [],
      currencyList: [
        {
          value: '0',
          label: 'USD'
        },
        {
          value: '1',
          label: 'CNY'
        }
      ],
      leftTableData: {
        pageNum: 1,
        pages: 1,
        size: this.$store.state.sysSettings.pageSize,
        pageOptionsList: this.$store.state.sysSettings.pageOptionsList,
        total: 0,
        sortList: [],
        filterList: [],
        selectedRow: null,
        columnList: [
          {
            title: this.$t('checkBill.billCustomer'),
            key: 'customerName',
            width: 100
          },
          {
            title: this.$t('checkBill.schemeName'),
            key: 'schemeName'
          },
          {
            title: '业务类型',
            key: 'businessType',
            width: 100,
            type: 'format',
            format: {
              'HD': '货代进出口业务',
              'KY': '仁川空运进出口'
            }
          }
        ],
        list: []
      },
      rightTableData: {
        columnList: [
          {
            title: this.$t('checkBill.columnName'),
            key: 'columnName',
            width: 150
          },
          {
            title: this.$t('checkBill.currency'),
            key: 'currency',
            width: 100,
            type: 'func',
            func: (row, key) => {
              if (this.leftTableData.selectedRow.configData.columnNumber === row.id) {
                return ''
              } else {
                return this.currencyObj[row[key]] !== undefined ? this.currencyObj[row[key]] : ''
              }
            }
          },
          {
            title: this.$t('checkBill.formula'),
            key: 'formula'
          }
        ],
        list: []
      },
      currencyObj: {}
    }
  },
  methods: {
    onRowClick () {
    },
    leftCurrentChange (row) {
      if (row !== null) {
        let formula = JSON.parse(row.formula)
        row['columnsList'] = formula
        let configData = JSON.parse(row.config)
        row['configData'] = configData
        this.rightTableData.list = formula
      }
      this.leftTableData.selectedRow = row
    },
    rightCurrentChange (row) {
      this.rightTableData.selectedRow = row
    },
    onRowContentMenu (row, event) {
    },
    // onRowClick(row, event, column) {
    //
    // },
    onDel () {
      let id = this.leftTableData.selectedRow.id
      api.delScheme(id).then(({ data }) => {
        if (data.returnCode === 200) {
          this.onChange()
        }
      })
    },
    executeAccount () {
      if (!this.leftTableData.selectedRow.businessType) {
        this.$util.msgWarning('请设置对账业务类型！')
        return
      }
      this.executeModalShow = false
      this.executeModalShow = true
    },
    handleUpload (file) {
      this.file = file
      this._file(this.file)
      return false
    },
    _file (file) {
      /* Boilerplate to set up FileReader */
      const reader = new FileReader()
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        /* Convert array of arrays */
        // 表格的表格范围，可用于判断表头是否数量是否正确
        // 遍历每张表读取
        for (var sheet in wb.Sheets) {
          if (wb.Sheets.hasOwnProperty(sheet)) {
            this.data = this.data.concat(XLSX.utils.sheet_to_json(wb.Sheets[sheet]))
            break // 如果只取第一张表，就取消注释这行
          }
        }
        console.log(this.data)
        /* this.onCalc(); */
      }
      reader.readAsBinaryString(file)
    },
    loadData () {
      this.leftTableData.loading = true
      let body = {
        pageNum: this.leftTableData.pageNum,
        pageSize: 0,
        filterList: this.leftTableData.filterList,
        sortList: this.leftTableData.sortList,
        searchKey: this.keywords
      }
      api.getSchemeList(body).then(({ data }) => {
        this.leftTableData.loading = false
        if (data.returnCode === 200) {
          this.leftTableData.list = data.returnData.pageInfo.list
          this.leftTableData.total = data.returnData.pageInfo.total
        } else {
          this.$Message.error('操作失败')
        }
      }).catch(error => {
        this.$Notice.error({
          title: '发生错误'
        })
      })
    },
    initData () {
      this.leftTableData.selectedRow = null
      this.leftTableData.sortList = []
      this.leftTableData.filterList = []
      this.leftTableData.list = []
      this.keywords = null
      this.rightTableData.selectedRow = null
      this.rightTableData.list = []
      this.loadData()
    },
    onChange () {
      this.rightTableData.list = []
      this.leftTableData.selectedRow = null
      this.rightTableData.selectedRow = null
      this.loadData()
    },
    onGridPageChange (pageNum) {
      this.leftTableData.pageNum = pageNum
      this.loadData()
    },
    onGridPageSizeChange (size) {
      this.leftTableData.pageNum = 1
      this.leftTableData.size = size
      this.loadData()
    }
  },
  created () {
    this.initData()
    apiBusinessCode.getCurrency().then(({ data }) => {
      if (data.returnCode === 200) {
        for (let index in data.returnData) {
          let item = data.returnData[index]
          this.currencyObj[item.code] = item.englishName
        }
      } else {
        this.notifyInfo('获取币种信息数据异常,请重试！')
      }
    })
  },
  watch: {
    formula (val) {
      console.log(val)
    }
  }
}
</script>
