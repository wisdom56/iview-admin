<style lang="less">
    .modal-class {
        .ivu-form{
            .ivu-form-item{
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
            title="选择业务代码"
            @on-ok="onOk"
            @on-cancel="onCancel"
            :width="800"
            class="modal-class"
    >
        <Row>
            <i-col span="8">
                <Form :label-width="70">
                    <FormItem label="全文检索:">
                        <Input size="small" v-model="keywords" type="text" placeholder="请输入字段内容" clearable @on-enter="loadData"></Input>
                    </FormItem>
                </Form>
            </i-col>
            <i-col span="1" class="i-col-middle"><Button type="primary" size="small" icon="ios-search" @click="loadData"></Button></i-col>
            <i-col span="5">
                <Form :label-width="70">
                    <FormItem label="起始搜索:">
                        <i-switch v-model="searchFromBegin" size="small"></i-switch>
                    </FormItem>
                </Form>
            </i-col>
        </Row>
        <Row>
            <el-table
                    class="no-select"
                    :data="tableData[0].list"
                    height="calc(100vh - 511px)"
                    border
                    style="width: 100%"
                    size="mini"
                    v-loading="tableData.loading"
                    oncontextmenu="return false;"
                    ref="singleTable"
                    highlight-current-row
                    sortable="custom"
                    @row-dblclick="onRowDblClick"
                    @sort-change="onTableSort"
                    @current-change="handleCurrentChange"
            >
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
                        :sortable="item.sortable!==undefined?'custom': false"
                        highlight-current-row
                >
                </el-table-column>
            </el-table>
        </Row>
        <Page class="mt-10" :total="tableData.total" :page-size="tableData.size" :page-size-opts="tableData.pageOptionsList" @on-change="onGridPageChange" @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer placement="top"></Page>
        <div slot="footer">
            <Button @click="onCancel" size="small" type="text">{{$t('i.modal.cancelText')}}</Button>
            <Button @click="onOk" size="small" type="primary" :disabled="tableData.selectedRow === null">{{$t('i.modal.okText')}}</Button>
        </div>
    </Modal>
</template>
<script>
// import api from '@/api/codec/business_code'
export default {
  name: 'modal-business-code',
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
    }
  },
  data () {
    return {
      modalShow: this.show,
      keywords: null,
      searchFromBegin: false,
      tableData: [{
        selectedRow: null,
        pageNum: 1,
        pages: 1,
        size: this.$store.state.sysSettings.pageSize,
        pageOptionsList: this.$store.state.sysSettings.pageOptionsList,
        total: 0,
        sortList: [],
        filterList: [{ filterKey: 'code', filterValue: 'PORTCD' }],
        columnList: [
          {
            title: 'code',
            key: 'code',
            width: 150
          },
          {
            title: 'englishName',
            key: 'englishName',
            width: 150
          },
          // {
          //     title: this.$t('modal.businessCode.stateCode'),
          //     key: 'stateCode',
          //     width: 100
          // },
          // {
          //     title: this.$t('modal.businessCode.stateName'),
          //     key: 'stateName',
          //     width: 100
          // },
          // {
          //     title: this.$t('modal.businessCode.countryCode'),
          //     key: 'countryCode',
          //     width: 100
          // },
          // {
          //     title: this.$t('modal.businessCode.countryName'),
          //     key: 'countryName',
          //     width: 100
          // },
          {
            title: 'chineseName',
            key: 'chineseName',
            width: 200
          },
          {
            title: 'remark',
            key: 'remark',
            width: 100
          }
        ],
        list: [],
        loading: true
      }]
    }
  },
  methods: {
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
    //   this.tableData.loading = true
    //   let body = {}
    //   let body = {
    //     pageNum: this.tableData.pageNum,
    //     pageSize: this.tableData.size,
    //     filterList: this.tableData.filterList,
    //     sortList: this.tableData.sortList,
    //     codeType: this.businessType,
    //     searchFromBegin: this.searchFromBegin ? '1' : '0',
    //     searchKey: this.keywords
    //   }
    //   api.getBusinessCodeList(body).then(({ data }) => {
    //     this.tableData.loading = false
    //     if (data.returnCode === 200) {
    //       this.tableData.list = data.returnData.pageInfo.list
    //       this.tableData.total = data.returnData.pageInfo.total
    //     } else {
    //       this.$Message.warning('数据异常,请重试！')
    //     }
    //   })
    },
    initData () {
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
    businessType (val) {
      if (val === 'PORTCD') {
        this.tableData.columnList = [
          {
            title: this.$t('modal.businessCode.code'),
            key: 'code',
            width: 150
          },
          {
            title: this.$t('modal.businessCode.englishName'),
            key: 'englishName',
            width: 150
          },
          {
            title: this.$t('modal.businessCode.stateCode'),
            key: 'stateCode',
            width: 100
          },
          {
            title: this.$t('modal.businessCode.stateName'),
            key: 'stateName',
            width: 100
          },
          {
            title: this.$t('modal.businessCode.countryCode'),
            key: 'countryCode',
            width: 100
          },
          {
            title: this.$t('modal.businessCode.countryName'),
            key: 'countryName',
            width: 100
          },
          {
            title: this.$t('modal.businessCode.chineseName'),
            key: 'chineseName',
            width: 100
          },
          {
            title: this.$t('modal.businessCode.remark'),
            key: 'remark',
            width: 100
          }
        ]
      } else {
        this.tableData.columnList = [
          {
            title: this.$t('modal.businessCode.code'),
            key: 'code',
            width: 150
          },
          {
            title: this.$t('modal.businessCode.englishName'),
            key: 'englishName',
            width: 150
          },
          {
            title: this.$t('modal.businessCode.chineseName'),
            key: 'chineseName',
            width: 100
          },
          {
            title: this.$t('modal.businessCode.remark'),
            key: 'remark',
            width: 100
          }
        ]
      }
    }
  }
}
</script>
