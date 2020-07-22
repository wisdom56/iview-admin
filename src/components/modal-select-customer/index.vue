<style lang="less">
    .modal-class {
        .ivu-form {
            .ivu-form-item {
                margin-bottom: 12px;
            }
        }

        .ivu-modal-header {
            padding: 10px 16px;

            .ivu-modal-header-inner {
                font-size: 13px !important;
            }
        }

        .ivu-modal-close {
            top: 4px;
        }
    }
</style>

<template>
    <Modal
            :value="show"
            title='selectCustomer'
            @on-ok="onOk"
            @on-cancel="onCancel"
            :width="800"
            class="modal-class"
            :style="{zIndex: 1050, position: 'absolute'}"
    >
        <Row>
            <i-col span="8">
                <Form :label-width="70" @submit.native.prevent>
                    <FormItem label=" ">
                        <Input size="small" v-model="keywords" type="text" placeholder="请输入字段内容" clearable
                               @on-enter="loadData"></Input>
                    </FormItem>
                </Form>
            </i-col>
            <i-col span="1" class="i-col-middle">
                <Button type="primary" size="small" icon="ios-search" @click="loadData"></Button>
            </i-col>
            <RadioGroup v-model="customerProperty" @on-change="onCustomerPropertyChange">
                <Radio v-for="item in type_list" :label="item.customerProperty" :key="item.customerProperty">
                    {{item.title}}
                </Radio>
            </RadioGroup>
        </Row>
        <Row>
            <!-- height="calc(100vh - 400px)" -->
            <el-table
                    class="no-select"
                    :data="tableData[0].list"
                    height="calc(100vh - 400px)"
                    border
                    style="width: 100%"
                    size="mini"
                    v-loading="tableData[0].loading"
                    oncontextmenu="return false;"
                    ref="singleTable"
                    highlight-current-row
                    sortable="custom"
                    @row-dblclick="onRowDblClick"
                    @sort-change="onTableSort"
                    @current-change="handleCurrentChange">
                <el-table-column
                        label="编号"
                        type="index"
                        align="center"
                        width="55">
                </el-table-column>
                <el-table-column
                        v-for="(item, key) in tableData[0].columnList" :key="key"
                        :prop="item.key"
                        :label="item.title"
                        :width="item.width"
                        :sortable="item.sortable !== undefined ? 'custom' : false"
                        highlight-current-row>
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
        </Row>
        <Page class="mt-10" :total="tableData.total" :page-size="tableData.size"
              :page-size-opts="tableData.pageOptionsList" @on-change="onGridPageChange"
              @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer
              placement="top"></Page>
        <div slot="footer">
            <Button @click="onCancel" size="small" type="text">取消</Button>
            <Button @click="onOk" size="small" type="primary" :disabled="tableData.selectedRow === null">
                确定
            </Button>
        </div>
    </Modal>
</template>
<script>
// import api from '@/api/crm/customer_company'
export default {
  name: 'modal-select-customer',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    businessType: {
      type: String,
      default: ''
    },
    businessKey: {
      type: String,
      default: ''
    },
    restrictCustomerList: {
      type: Array,
      default () {
        return []
      }
    },
    property: {
      type: String,
      default: ''
    },
    showFreeze: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      customerProperty: '',
      personType: this.businessType,
      keywords: null,
      searchFromBegin: false,
      selection: [],
      tableData: [{
        selectedRow: null,
        pageNum: 1,
        pages: 1,
        size: this.$store.state.sysSettings.pageSize,
        pageOptionsList: this.$store.state.sysSettings.pageOptionsList,
        total: 0,
        sortList: [],
        filterList: [],
        columnList: [
          {
            title: 'customerName',
            key: 'customerName',
            width: 250
          },
          {
            title: 'customerAbbreviation',
            key: 'customerAbbreviation',
            width: 250
          },
          {
            title: 'customModel.mnemonicCode',
            key: 'mnemonicCode'
          },
          {
            title: 'customerInfo.freezeFlag',
            key: 'freezeFlag',
            width: 100,
            type: 'format',
            format: {
              '1': '冻结',
              '0': '正常'
            }
          }
        ],
        list: [],
        loading: true
      }],
      type_list: [
        {
          title: '全部',
          customerProperty: ''
        },
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
        },
        {
          title: '换单代理',
          customerProperty: 'm'
        },
        {
          title: '仓储',
          customerProperty: 'n'
        },
        {
          title: '报检',
          customerProperty: 'o'
        },
        {
          title: '提单代理',
          customerProperty: 'p'
        },
        {
          title: '监管车',
          customerProperty: 'q'
        },
        {
          title: '保险',
          customerProperty: 'r'
        }
      ]
    }
  },
  methods: {
    onCustomerPropertyChange (val) {
      this.loadData()
    },
    onChangePage () {
      this.loadData()
    },
    onOk () {
      this.$emit('on-select', this.tableData.selectedRow, this.businessKey)
      this.$emit('update:show', false)
    },
    onCancel () {
      this.$emit('update:show', false)
    },
    onRowDblClick (row) {
      this.$emit('on-select', row, this.businessKey)
      this.$emit('update:show', false)
    },
    loadData () {
      this.tableData.loading = true
      let body = {
        personType: this.personType,
        pageNum: this.tableData.pageNum,
        pageSize: this.tableData.size,
        filterList: this.tableData.filterList,
        sortList: this.tableData.sortList,
        searchKey: this.keywords,
        customerProperty: this.customerProperty
      }
      if (this.showFreeze) {
        body.ignoreFreeze = 'ignoreFreeze'
      }
      if (this.restrictCustomerList && this.restrictCustomerList.length > 0) {
        body.customerIdList = this.restrictCustomerList
      }
      // api.getCustomerCompanyList(body).then(({data}) => {
      //     this.tableData.loading = false;
      //     if (data.returnCode === 200) {
      //         this.tableData.list = data.returnData.pageInfo.list;
      //         this.tableData.total = data.returnData.pageInfo.total;
      //     } else {
      //         this.$Message.warning('数据异常,请重试！');
      //     }
      // });
    },
    initData () {
      this.personType = this.businessType
      this.tableData.selectedRow = null
      this.tableData.sortList = []
      this.tableData.list = []
      this.searchFromBegin = false
      this.keywords = null
      this.tableData.filterList = []
      this.loadData()
    },
    onRowContentMenu (row, event) {
      this.rightClickRow = row
    },
    handleCharging: function () {
      this.$router.push({
        name: 'charging'
      })
    },
    onGridPageChange (pageNum) {
      this.tableData.pageNum = pageNum
      this.loadData()
    },
    onGridPageSizeChange (size) {
      this.tableData.pageNum = 1
      this.tableData.size = size
      this.loadData()
    },
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
      this.loadData()
    },
    handleCurrentChange (val) {
      this.tableData.selectedRow = val
    }
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.initData()
      }
    },
    businessType (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.personType = newVal
      }
    },
    personType (newVal, oldVal) {
      if (newVal !== oldVal && this.show) {
        this.loadData()
      }
    }
  },
  created () {
    this.customerProperty = this.property
  }
}
</script>
