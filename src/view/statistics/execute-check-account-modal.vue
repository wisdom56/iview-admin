<style>
    .el-table .warning-row-cell {
        background: rgba(255, 0, 0, 0.16) !important;
    }

    .el-table .success-row-cell {
        background: #f0f9eb;
    }
</style>
<template>
    <div>
        <Modal
                v-model="currentModalShow"
                width="80"
                title="执行对账"
        >
            <div v-if="schemeData != null">
                <Row class="lh-default">
                    <i-col span="5" class="flex">
                        <div class="flex-none pr-5">方案说明:</div>
                        <div class="flex-auto">{{this.schemeData.schemeName}}</div>
                    </i-col>
                    <i-col span="5" class="flex">
                        <div class="flex-none pr-5">对账客户:</div>
                        <div class="flex-auto overflow-ellipsis">{{this.schemeData.customerName}}</div>
                        <div class="flex-auto"><Button @click="showCustomerModal=true" class="btn-square"><Icon type="person"></Icon></Button></div>
                    </i-col>
                    <i-col span="3" class="flex">
                        <div class="flex-none pr-5">页号:</div>
                        <div class="flex-auto">{{schemeData.configData.pageNumber}}</div>
                    </i-col>
                    <i-col span="11" class="flex">
                        <div class="flex-none pr-5">核对模式:</div>
                        <div class="flex-auto">
                            <RadioGroup v-model="checkData.checkKey">
                                <Radio label="0">核对主单</Radio>
                                <Radio label="1">核对分单</Radio>
                                <Radio label="2">RENO.A</Radio>
                                <Radio label="3">RENO.B</Radio>
                            </RadioGroup>
                        </div>
                    </i-col>
                </Row>
                <Row class="lh-default">
                    <i-col span="5" class="flex">
                        <div class="flex-none pr-5">导入提单号截取方式:</div>
                        <div class="flex-auto">{{onSplitBlStyle(schemeData.configData.sheetOpt)}}</div>
                    </i-col>
                    <i-col span="5" class="flex">
                        <div class="flex-none pr-5">系统提单号截取方式:</div>
                        <div class="flex-auto">{{onSplitBlStyle(schemeData.configData.systemOpt)}}</div>
                    </i-col>
                    <i-col span="5" class="flex">
                        <div class="flex-none pr-5">发票类型:</div>
                        <div class="flex-auto">
                            <Select size="small" v-model="checkData.invoiceType" style="width:100%;">
                                <Option v-for="(item,key) in invoiceTypeList" :key="key" :value="item.invoiceTypeCode">{{item.invoiceTypeName}}</Option>
                            </Select>
                        </div>
                        <div class="flex-none pl-10">
                            <Button @click="exportReconciliations()" size="small" type="primary">导出</Button>
                        </div>
                    </i-col>
                    <i-col span="2" offset="2" class="align-right">

                    </i-col>
                </Row>
                <div class="flex">
                    <div class="flex-auto" style="overflow: hidden;">
                        <el-table
                                class="statistics-table"
                                :data="tableData.list"
                                height="60vh"
                                border
                                style="width: 100%;"
                                size="mini"
                                highlight-current-row
                                ref="multipleTable"
                                v-loading="tableData.loading"
                                :row-class-name="tableRowStatus"
                                @current-change="handleCurrentChange"
                                :cell-class-name="formatCellStyle"
                                @selection-change="handleSelectionChange"
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
                                            v-for="(itemChild, keyChild) in item.children" :key="keyChild"
                                            v-if="itemChild.show"
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
                                    {{$util.tableRowFormat(scope.row, item)}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="flex-none flex pl-10" style="flex-direction: column;width: 250px;">
                        <div class="flex-none">
                            <div>核对方式:</div>
                            <RadioGroup v-model="checkData.checkType" style="line-height: 24px;">
                                <Row>
                                    <i-col span="12">
                                        <Radio label="1">核对应收</Radio>
                                    </i-col>
                                    <i-col span="12">
                                        <Radio label="2">核对应付</Radio>
                                    </i-col>
                                </Row>
                                <!--<Row>
                                    <i-col span="16">
                                        <Radio label="0">核对未付欠费差</Radio>
                                    </i-col>
                                    <i-col span="8">
                                        <Radio label="1">核对应收</Radio>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="16">
                                        <Radio label="2">核对应收应付差</Radio>
                                    </i-col>
                                    <i-col span="8">
                                        <Radio label="3">核对应付</Radio>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="16">
                                        <Radio label="4">核对应付应收差</Radio>
                                    </i-col>
                                </Row>-->
                            </RadioGroup>
                        </div>
                        <div class="flex-none pt-5" style="position: relative;">
                            <el-table
                                    style="width: 100%"
                                    height="30vh"
                                    size="mini"
                                    border
                                    :data="currentRow.feeList"
                            >
                                <el-table-column
                                        width="80"
                                        label="费种"
                                        header-align="center"
                                        align="center"
                                        prop="feeType"
                                        :show-overflow-tooltip="true"
                                >
                                </el-table-column>
                                <el-table-column
                                        width="70"
                                        label="币种"
                                        header-align="center"
                                        align="center"
                                        prop="moneyType"
                                        :show-overflow-tooltip="true"
                                >
                                </el-table-column>
                                <el-table-column
                                        width="auto"
                                        label="金额"
                                        header-align="center"
                                        align="right"
                                        prop="value"
                                        :show-overflow-tooltip="true"
                                >
                                </el-table-column>
                            </el-table>
                        </div>
                        <Tree :data="deptTree" show-checkbox class="flex-auto mt-10" style="overflow-y: auto; height: calc(30vh - 430px);"></Tree>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <Row>
                    <i-col span="12" class="flex">
                        <Upload
                                :before-upload="handleUpload"
                                action
                                class="flex-none"
                        >
                            <Button @click="onFileCheck" size="small" type="primary">文件对账</Button>
                        </Upload>
                        <Button :disabled="createPayOrderBtnDisabled" v-if="checkData.checkType !== '2'" class="ml-10" style="height: 24px;" @click="onCreateOrder('collect')" size="small" type="ghost">生成收费联系单</Button>
                        <Button :disabled="createPayOrderBtnDisabled" v-if="checkData.checkType !== '1'" class="ml-10" style="height: 24px;" @click="onCreateOrder('pay')" size="small" type="ghost">生成付费联系单</Button>
                    </i-col>
                    <i-col span="12" class="align-right">
                        <Button style="height: 24px;" @click="onCancel" size="small" type="ghost">{{$t('i.modal.cancelText')}}</Button>
                    </i-col>
                </Row>

            </div>
            <modal-select-customer :show.sync="showCustomerModal" @on-select="onCustomerSelect"  business-type="PORTCD"></modal-select-customer>
        </Modal>
    </div>
</template>
<script>
import math from 'mathjs'
import XLSX from 'xlsx'
import api from '@/api/financial/checkingAccount'
import ModalSelectCustomer from '@/components/modal/modal-select-customer/index'
import deptApi from '@/api/statistics/billStatistics'
import invoiceApi from '@/api/codec/invoice_type'
import fileDownload from 'js-file-download'
import apiBill from '@/api/statistics/billStatistics'
export default {
  name: 'execute-check-account-modal',
  components: {
    ModalSelectCustomer
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    schemeData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showCustomerModal: false,
      currentModalShow: this.show,
      currentSchemeData: this.schemeData,
      checkData: {
        checkKey: '0',
        checkType: '1',
        invoiceType: 'P0'
      },
      data: [],
      dataObj: {},
      blNoList: [],
      invoiceTypeList: [],
      deptList: null,
      selection: [],
      checkFieldObj: {},
      chargeDetailList: [],
      deptTree: [
        {
          title: '对账部门',
          expand: true,
          children: []
        }
      ],
      tableData: {
        searchKey: '',
        selectedRow: null,
        sortList: [],
        list: [],
        loading: false
      },
      columns: [],
      columnHeader: [
        {
          title: '对账状态',
          key: 'status',
          align: 'center',
          sortable: true,
          type: 'text',
          width: 100,
          show: true
        },
        {
          title: '提单号',
          key: 'blNo',
          align: 'center',
          width: 200,
          show: true
        },
        {
          title: '离港日',
          key: 'shipDate',
          align: 'center',
          width: 100,
          type: 'date',
          show: true
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          align: 'center',
          width: 100,
          type: 'func',
          show: true,
          func: (row, key) => {
            switch (row[key]) {
              case '-3':
                return '已拒绝'
                break
              case '0':
                return '未审核'
                break
              case '1':
                return '待审批'
                break
              case '-1':
                return '已审批未转账'
                break
              case '-2':
                return '已转账'
                break
            }
          }
        }
        /* {
                        title: '提示',
                        key: 'status',
                        align: 'center',
                        width: 70,
                        show: true
                    } */],
      columnFooter: [
        {
          title: '制单人',
          key: 'originatorName',
          align: 'center',
          width: 70,
          show: true
        },
        {
          title: '制单部门',
          key: 'deptName',
          align: 'center',
          width: 70,
          show: true
        },
        {
          title: '订舱客户',
          key: 'customerName',
          align: 'center',
          width: 70,
          show: true
        },
        {
          title: '订舱代理',
          key: 'customerName',
          align: 'center',
          width: 70,
          show: true
        }
      ],
      currentRow: {
        feeList: []
      },
      orderNoList: [],
      createPayOrderBtnDisabled: true,
      detailIdsMap: {},
      detailIds: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      let detailIds = []
      if (val.length === 0) {
        this.createPayOrderBtnDisabled = true
        return
      }
      for (let index in val) {
        let item = val[index]
        if (item['status'] != undefined && item['status'] === '成功') {
          item.feeList.forEach(feeItem => {
            if (feeItem['detailIds']) {
              let ids = feeItem['detailIds'].split(',')
              detailIds = detailIds.concat(ids)
            }
          })
        } else {
          this.createPayOrderBtnDisabled = true
          return
        }
        this.createPayOrderBtnDisabled = false
      }
      this.detailIds = this.$util.arrayUnique(detailIds)
    },
    onCreateOrder (type) {
      this.currentModalShow = false
      if (type === 'pay') {
        this.$router.push({
          name: 'financial-order-create-pay-order-batch',
          query: {
            customerCode: this.schemeData.customerId,
            businessType: this.schemeData.businessType
          },
          params: {
            detailIds: this.detailIds
          }
        })
      } else {
        this.$router.push({
          name: 'financial-order-create-collect-order-batch',
          query: {
            customerCode: this.schemeData.customerId,
            businessType: this.schemeData.businessType
          },
          params: {
            detailIds: this.detailIds
          }
        })
      }
    },
    formatCellStyle (data) {
      let str = (data.column.property + '').substring(0, 11)
      let index = (data.column.property + '').substring(11)
      if (str === 'checkSystem') {
        if (data.row['checkSystem' + index] !== undefined && Number(data.row['checkImport' + index]) === Number(data.row[str + index])) {
          return null
        } else {
          return 'warning-row-cell'
        }
      }
      if (data.column.property === 'status') {
        if (data.row['status'] !== undefined && data.row['status'] === '成功') {
          return null
        } else {
          return 'warning-row-cell'
        }
      }
      if (data.column.property === 'auditStatus') {
        // 审核状态是 已审批未转账标记
        if (data.row['auditStatus'] !== undefined && data.row['auditStatus'] === '-1' && this.checkData.checkType !== '1') {
          return null
        } else {
          return 'warning-row-cell'
        }
      }
      return null
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    formatData () {
      let departmentList = []
      let departmentAllTrue = true
      this.deptTree[0].children.forEach(item => {
        if (item.checked) {
          departmentList.push(item.code)
        } else {
          departmentAllTrue = false
        }
      })
      if (!departmentAllTrue) {
        if (departmentList.length === 0) {
          return 'department'
        } else if (departmentList.length > 0) {
          this.deptList = departmentList
        } else {
          this.deptList = null
        }
      } else {
        this.deptList = null
      }
    },
    onCustomerSelect (row) {
      this.schemeData.customerId = row.customerId
      this.schemeData.customerName = row.customerAbbreviation
    },
    onSplitBlStyle (val) {
      if (val.type == '0') {
        return '完全核对'
      } else if (val.type == '1') {
        return '左侧截取 ' + val.leftCount + ' 位'
      } else if (val.type == '2') {
        return '右侧截取 ' + val.rightCount + ' 位'
      } else if (val.type == '3') {
        return '中间截取 从第 ' + val.start + ' 截取 ' + val.count + ' 位'
      }
    },
    onSplitBlCalc (val) {
      let opt = {}
      val = val.trim()
      opt = this.schemeData.configData.sheetOpt
      if (opt.type === '0') {
        return val
      } else if (opt.type === '1') {
        return val.substring(0, opt.leftCount)
      } else if (opt.type === '2') {
        return val.substring(val.length - val.count, val.count)
      } else {
        return val.substring(opt.start, opt.count)
      }
    },
    tableRowStatus ({ row, rowIndex }) {
      for (let index in this.checkFieldObj) {
        let item = this.checkFieldObj[index]
        // 审核状态是 非 已审批未转账标记,提示失败
        if (this.$route.query.type == 'pay') {
          if ((row['auditStatus'] !== '-1' && row['auditStatus'] !== '-2') && row.isApprove === 1) {
            row.status = '失败'
            return ''
          }
        } else {
          if ((row['auditStatus'] !== '-1' && row['auditStatus'] !== '-2') && row.isApproveCollect === 0) {
            row.status = '失败'
            return ''
          }
        }

        if (Number(row[item]) !== Number(row[index])) {
          row.status = '失败'
          return ''
        }
      }
      row.status = '成功'
      return ''
    },
    exportReconciliations () {
      let list = this.tableData.list
      if (list.length <= 0) {
        this.$Message.warning('暂无数据！')
        return
      }
      var data = []
      for (var i = 0; i < list.length; i++) {
        var arr = {}
        this.columns.forEach(columns => {
          var column = columns.key
          // 无子项的row
          if (columns.children == undefined || columns.children.length <= 0) {
            // 判断返回的结果中有无包含列明的数据。有则取出value 无则为空
            if (list[i].hasOwnProperty(column)) {
              arr['' + column] = list[i][column]
              if (columns.type == 'date') {
                arr['' + column] = list[i][column] == null ? '' : this.$util.timestampToDate(list[i][column])
              }
              if (column == 'auditStatus') {
                arr['' + column] = list[i][column] == null ? '' : this.getAuditStatus(list[i][column])
              }
            } else {
              if (columns.type == 'numCommas') {
                arr['' + column] = 0.00
              } else {
                arr['' + column] = ''
              }
            }
          } else {
            columns.children.forEach(c => {
              if (c.type == 'numCommas') {
                if (list[i][c.key] == undefined || list[i][c.key] == null) {
                  arr['' + c.key] = 0.00
                } else {
                  arr['' + c.key] = list[i][c.key]
                }
              } else {
                arr['' + c.key] = 0.00
              }
            })
          }
        })
        data.push(arr)
      }
      let queryExcelBody = {
        type: '11',
        tableWord: this.columns,
        billStatisticsSearchDto: null,
        reconciliations: data
      }
      const timestamp = new Date().getTime()
      apiBill.exportData(queryExcelBody).then(response => {
        if (response.status == 200) {
          fileDownload(response.data, '对账详情_' + timestamp + '.xls')
        } else {
          this.$Message.warning('导出失败！')
        }
      }).catch(error => {
        this.$Notice.error({
          title: '发生错误'
        })
      })
    },
    getAuditStatus (obj) {
      switch (obj + '') {
        case '-3':
          return '已拒绝'
          break
        case '0':
          return '未审核'
          break
        case '1':
          return '待审批'
          break
        case '-1':
          return '已审批未转账'
          break
        case '-2':
          return '已转账'
          break
      }
    },
    onFileCheck () {

    },
    onExecute () {
      for (let i = 0; i < this.blNoList.length; i++) {
        this.blNoList[i] = this.blNoList[i].toString().trim()
      }
      let systemOpt = this.schemeData.configData.systemOpt
      if (this.formatData() == 'department') {
        this.$Message.warning('对账中部门至少选择一个！')
        this.tableData.loading = false
        return
      }
      let body = {
        blNoList: this.blNoList,
        searchType: systemOpt.type,
        leftCount: systemOpt.leftCount,
        rightCount: systemOpt.rightCount,
        start: systemOpt.start,
        count: systemOpt.count,
        checkType: this.checkData.checkType,
        checkKey: this.checkData.checkKey,
        invoiceType: this.checkData.invoiceType,
        customerCode: this.schemeData.customerId
      }
      if (this.deptList !== null) {
        body['deptList'] = this.deptList
      }
      /* obj={'提单号':{'币种': [{数据}]}} */
      api.executeCheck(body).then(({ data }) => {
        let regexStr = /\{(.+?)\}/g
        if (data.returnCode === 200) {
          let obj = {}
          // 数据转map,便于比对
          for (let i = 0; i < this.blNoList.length; i++) {
            let flag = false
            let returnList = data.returnData
            returnList.forEach(item => {
              if (item['amountReceivable'] != 0) {
                // 应收 = 应收 - 预结
                item['amountReceivable'] = (parseFloat(item['amountReceivable']) - parseFloat(item['amountPreSettlement'])).toFixed(2)
              }
              if (item['amountPayable'] != 0) {
                // 应付 = 应付 - 预结
                item['amountPayable'] = (parseFloat(item['amountPayable']) - parseFloat(item['amountPreSettlement'])).toFixed(2)
              }
            })
            returnList.forEach(item => {
              if (item.blNo != undefined && item.blNo != null && this.blNoList[i] == item.blNo) {
                flag = true
                if (obj[item.blNo] === undefined) {
                  obj[item.blNo] = {}
                }
                // 按币种分离到Map
                if (obj[item.blNo][item.currency] === undefined) {
                  obj[item.blNo][item.currency] = [] // 创建提单号分组下的币种分类数组
                }
                obj[item.blNo][item.currency].push(item)
              }
            })
            if (!flag) { // 找不到对应提单号创建空对象
              let blNo = this.blNoList[i]
              obj[blNo] = {}
            }
          }
          let schemeConfig = JSON.parse(this.schemeData.config)
          for (let index in obj) { // 遍历提货单Obj
            if (Object.keys(obj[index]).length > 0) { // 如果有币种则取币种中第一个费种item信息
              let currencyKey = Object.keys(obj[index])[0]
              this.dataObj[index]['orderNo'] = obj[index][currencyKey][0]['orderNo']
              this.dataObj[index]['blNo'] = obj[index][currencyKey][0]['blNo']
              this.dataObj[index]['shipDate'] = obj[index][currencyKey][0]['shipDate']
              this.dataObj[index]['amountValue'] = 0
              this.dataObj[index]['amountPreSettlement'] = 0
              this.dataObj[index]['amountArrears'] = 0
              this.dataObj[index]['originatorName'] = obj[index][currencyKey][0]['originatorName']
              this.dataObj[index]['deptName'] = obj[index][currencyKey][0]['deptName']
              this.dataObj[index]['customerName'] = obj[index][currencyKey][0]['customerName']
              this.dataObj[index]['deptName'] = obj[index][currencyKey][0]['deptName']
              this.dataObj[index]['auditStatus'] = obj[index][currencyKey][0]['auditStatus']
              this.dataObj[index]['detailIds'] = obj[index][currencyKey][0]['detailIds']
              this.dataObj[index]['isApprove'] = obj[index][currencyKey][0]['isApprove']
              this.dataObj[index]['isApproveCollect'] = obj[index][currencyKey][0]['isApproveCollect']
            } else {
              this.dataObj[index]['orderNo'] = null
              this.dataObj[index]['blNo'] = index
              this.dataObj[index]['shipDate'] = null
              this.dataObj[index]['amountValue'] = 0
              this.dataObj[index]['amountPreSettlement'] = 0
              this.dataObj[index]['amountArrears'] = 0
              this.dataObj[index]['originatorName'] = null
              this.dataObj[index]['deptName'] = null
              this.dataObj[index]['customerName'] = null
              this.dataObj[index]['deptName'] = null
              this.dataObj[index]['auditStatus'] = null
              this.dataObj[index]['detailIds'] = null
              this.dataObj[index]['isApprove'] = null
              this.dataObj[index]['isApproveCollect'] = null
            }

            let item = obj[index] // 提单号item
            let feeObj = {} // 每个提单费种的信息
            for (let currencyIndex in item) { // 遍历币种Map
              let currencyItem = item[currencyIndex]
              if (feeObj[currencyIndex] === undefined) {
                feeObj[currencyIndex] = {}
              }
              for (let feeIndex in currencyItem) {
                let feeItem = currencyItem[feeIndex]
                if (feeObj[currencyIndex][feeItem.feeCh] === undefined) {
                  feeObj[currencyIndex][feeItem.feeCh] = feeItem
                }
              };
            }
            // 统计'全部' 费种 为本币种所有费种的累加和
            let feeSumObj = {
            }
            for (let currencyIndex in item) {
              let currencyItem = item[currencyIndex]
              if (feeSumObj[currencyIndex] === undefined) {
                feeSumObj[currencyIndex] = {
                  amountReceivable: 0,
                  amountPayable: 0,
                  amountReceipt: 0,
                  amountPaid: 0,
                  amountPreSettlement: 0,
                  detailIds: ''
                }
              }
              for (let feeIndex in currencyItem) {
                let feeItem = currencyItem[feeIndex]
                feeSumObj[feeItem.currency].amountReceivable = (parseFloat(feeSumObj[feeItem.currency].amountReceivable) + parseFloat(feeItem['amountReceivable'])).toFixed(2)
                feeSumObj[feeItem.currency].amountPayable = (parseFloat(feeSumObj[feeItem.currency].amountPayable) + parseFloat(feeItem['amountPayable'])).toFixed(2)
                feeSumObj[feeItem.currency].amountReceipt = (parseFloat(feeSumObj[feeItem.currency].amountReceipt) + parseFloat(feeItem['amountReceipt'])).toFixed(2)
                feeSumObj[feeItem.currency].amountPaid = (parseFloat(feeSumObj[feeItem.currency].amountPaid) + parseFloat(feeItem['amountPaid'])).toFixed(2)
                feeSumObj[feeItem.currency].amountPreSettlement = (parseFloat(feeSumObj[feeItem.currency].amountPreSettlement) + parseFloat(feeItem['amountPreSettlement'])).toFixed(2)
                feeSumObj[feeItem.currency].detailIds += feeItem['detailIds'] + ','
              }
              feeSumObj[currencyIndex].detailIds = feeSumObj[currencyIndex].detailIds.substr(0, feeSumObj[currencyIndex].detailIds.length - 1)
            }
            // 增加'全部'费种
            for (let currencyIndex in feeSumObj) {
              feeObj[currencyIndex]['全部'] = feeSumObj[currencyIndex]
            }
            let formulaFeeObj = {}
            let formulaFeeList = []// 记录公式中使用过的费种信息;
            for (let columnIndex in this.schemeData.columnsList) { // 遍历列表
              let columnItem = this.schemeData.columnsList[columnIndex]
              if (schemeConfig.columnNumber != columnItem.id) {
                let formula = columnItem.formula
                let formulaFieldList = formula.match(regexStr)
                // 获得公式中所有匹配字段
                if (formulaFieldList != null) {
                  formulaFieldList.forEach(formulaFieldItem => { // 公式字段遍历替换数据
                    let feeKey = formulaFieldItem.substring(1, formulaFieldItem.length - 1).trim()
                    let feeItem = {}
                    if (feeObj[columnItem.currency] !== undefined && feeObj[columnItem.currency][feeKey] !== undefined) {
                      feeItem = feeObj[columnItem.currency][feeKey]
                    }
                    if (formulaFeeObj[columnItem.currency] === undefined) {
                      formulaFeeObj[columnItem.currency] = {}
                    }
                    let calcValue = this.calcCheckType(this.checkData.checkType, feeItem)
                    formula = formula.replaceAll(formulaFieldItem, calcValue)
                    formulaFeeObj[columnItem.currency][feeKey] = {
                      feeType: feeKey,
                      moneyType: columnItem.currency,
                      value: calcValue,
                      detailIds: feeItem.detailIds
                    }
                    formulaFeeList.push({
                      feeType: feeKey,
                      moneyType: columnItem.currency,
                      value: calcValue,
                      detailIds: feeItem.detailIds
                    })
                  })
                }
                let result = math.eval(formula)
                this.dataObj[index]['checkSystem' + columnIndex] = parseFloat(result).toFixed(2)
                this.dataObj[index]['checkDiffValue' + columnIndex] = parseFloat(this.dataObj[index]['checkImport' + columnIndex]).toFixed(2) - parseFloat(result).toFixed(2)
                if (feeSumObj[columnItem.currency] !== undefined) {
                  this.dataObj[index]['preSettlement' + columnIndex] = feeSumObj[columnItem.currency].amountPreSettlement // 计算预结
                  this.dataObj[index]['arrears' + columnIndex] = parseFloat(feeSumObj[columnItem.currency].amountReceivable) - parseFloat(feeSumObj[columnItem.currency].amountReceipt) // 欠费
                } else {
                  this.dataObj[index]['preSettlement' + columnIndex] = 0
                  this.dataObj[index]['arrears' + columnIndex] = 0
                }
              }
            }
            this.dataObj[index]['feeList'] = formulaFeeList
          }
          let list = []
          for (let index in this.dataObj) {
            list.push(this.dataObj[index])
          }
          this.tableData.list = list
          this.$nextTick(function () {
            this.tableData.list.forEach(item => {
              if (item['status'] != undefined && item['status'] == '成功') {
                this.$refs.multipleTable.toggleRowSelection(item)
              }
            })
          })
          this.tableData.loading = false
        }
      })
    },
    formatColumns () {
      if (this.schemeData != null) {
        let columns = []
        let schemeConfig = JSON.parse(this.schemeData.config)
        for (let index in this.schemeData.columnsList) {
          let item = this.schemeData.columnsList[index]
          if (schemeConfig.columnNumber != item.id) {
            this.checkFieldObj['checkImport' + index] = 'checkSystem' + index
            columns.push(
              {
                title: `${item.columnName}(${item.currency})`,
                key: 'check' + index,
                align: 'center',
                show: true,
                children: [
                  {
                    title: '导入',
                    key: 'checkImport' + index,
                    align: 'right',
                    type: 'numCommas',
                    width: 80,
                    show: true
                  },
                  {
                    title: '系统',
                    key: 'checkSystem' + index,
                    align: 'right',
                    type: 'numCommas',
                    width: 80,
                    show: true
                  },
                  {
                    title: '差值',
                    key: 'checkDiffValue' + index,
                    align: 'right',
                    type: 'numCommas',
                    width: 80,
                    show: true
                  }
                ]
              }
            )
          }
        }
        this.columns = this.columnHeader.concat(columns).concat(this.columnFooter)
      }
    },
    onCancel () {
      this.currentModalShow = false
    },
    handleUpload (file) {
      this.tableData.loading = true
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
        this.data = []
        // 遍历每张表读取
        for (var sheet in wb.Sheets) {
          if (wb.Sheets.hasOwnProperty(sheet)) {
            this.data = this.data.concat(XLSX.utils.sheet_to_json(wb.Sheets[sheet]))
            break // 如果只取第一张表，就取消注释这行
          }
        }
        let schemeConfig = JSON.parse(this.schemeData.config)
        let blNoField = ''
        for (let index in this.schemeData.columnsList) {
          if (schemeConfig.columnNumber == this.schemeData.columnsList[index].id) {
            blNoField = this.schemeData.columnsList[index].columnName
            break
          }
        }
        this.dataObj = {}
        this.blNoList = []
        for (let index in this.data) {
          let item = this.data[index]
          if (item[blNoField] !== undefined) {
            let blNo = this.onSplitBlCalc(item[blNoField])
            if (this.dataObj[blNo] == undefined) {
              this.dataObj[blNo] = {}
            } else {
              /*  this.$notify({
                                      title: this.$t('common.prompt'),
                                      message: blNo+'提单数据重复！',
                                      type: 'warning'
                                  }); */
            }

            for (let fieldIndex in this.schemeData.columnsList) { // 遍历列表
              let fieldItem = this.schemeData.columnsList[fieldIndex]
              if (schemeConfig.columnNumber != fieldItem.id) {
                if (item[fieldItem.columnName] == undefined || item[fieldItem.columnName] == null) {
                  this.dataObj[blNo]['checkImport' + fieldIndex] = 0.00
                } else {
                  this.dataObj[blNo]['checkImport' + fieldIndex] = parseFloat(item[fieldItem.columnName]).toFixed(2)
                }
                this.dataObj[blNo]['blNo'] = blNo
              }
            }
            this.blNoList.push(blNo)
          } else {
            this.$Message.warning('导入文件与对账方案提单号列命名不匹配！')
            this.tableData.loading = false
            return
          }
        }
        this.onExecute()
      }
      reader.readAsBinaryString(file)
    },
    initData () {
      this.tableData.list = []
      let checkType = '1'
      if (this.$route.query && this.$route.query.type && this.$route.query.type == 'pay') {
        checkType = '2'
      } else {
        checkType = '1'
      }
      this.checkData = {
        checkKey: '0',
        checkType: checkType,
        invoiceType: 'P0'
      }
      this.currentRow = {
        feeList: []
      }
      this.formatColumns()
      deptApi.getMyDepartment().then(({ data }) => {
        if (data.returnCode === 200) {
          let list = []
          data.returnData.forEach(item => {
            let map = {
              title: item.departname,
              code: item.id,
              expand: true,
              checked: true
            }
            list.push(map)
          })
          this.deptTree[0].children = list
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
      invoiceApi.getAvaliableInvoiceTypeList().then(({ data }) => {
        if (data.returnCode === 200) {
          this.invoiceTypeList = data.returnData
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
    },
    calcCheckType (checkType, obj) {
      if (obj.amountReceivable === undefined) {
        return 0
      }
      if (checkType === '0') { /* 核对未付欠费差 = (账单应收 - 账单实收) - ( 账单应付 - 账单实付 ) */
        return ((parseFloat(obj.amountReceivable) - parseFloat(obj.amountReceipt)) - (parseFloat(obj.amountPayable) - parseFloat(obj.amountPaid))).toFixed(2)
      } else if (checkType === '1') { /* 核对应收 = 账单应收 */
        return (parseFloat(obj.amountReceivable)).toFixed(2)
      } else if (checkType === '2') { /* 核对应付 = 账单应付 */
        return (parseFloat(obj.amountPayable)).toFixed(2)
      } else if (checkType === '3') { /* 核对应收应付差 = 账单应收 - 账单应付 */
        return (parseFloat(obj.amountReceivable) - parseFloat(obj.amountPayable)).toFixed(2)
      } else if (checkType === '4') { /* 核对应付应收差 = 账单应付 - 账单应收 */
        return (parseFloat(obj.amountPayable) - parseFloat(obj.amountReceivable)).toFixed(2)
      } else {
        return 0
      }
    }
  },
  created () {
    this.initData()
  },
  watch: {
    show (newVal) {
      this.currentModalShow = newVal
      this.initData()
    },
    currentModalShow (newVal) {
      this.$emit('update:show', newVal)
    },
    schemeData: {
      handler: function (val) {
        this.formatColumns()
      },
      deep: true
    }
  }
}
</script>
