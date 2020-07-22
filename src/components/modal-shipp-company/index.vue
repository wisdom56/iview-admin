<style lang="less">
    .modal-class {
        .ivu-form {
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
            title="船公司"
            @on-ok="onOk"
            @on-cancel="onCancel"
            :width="800"
            class="modal-class"
            :style="{zIndex: 1050, position: 'absolute'}"
    >
        <Row>
            <i-col span="8">
                <Form :label-width="70">
                    <FormItem :label="$t('modal.selectParty.contentSearch')">
                        <Input size="small" v-model="keywords" type="text" placeholder="请输入字段内容" clearable @on-enter="loadData"></Input>
                    </FormItem>
                </Form>
            </i-col>
            <i-col span="1" class="i-col-middle"><Button type="primary" size="small" icon="ios-search" @click="loadData"></Button></i-col>
        </Row>
        <Row>
            <el-table
                    class="no-select"
                    :data="tableData.list"
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
                    @current-change="handleCurrentChange">
                <el-table-column
                        label="编号"
                        type="index"
                        align="center"
                        width="55">
                </el-table-column>
                <el-table-column
                        v-for="(item, key) in tableData.columnList" :key="key"
                        :prop="item.key"
                        :label="item.title"
                        :width="item.width"
                        :sortable="item.sortable !== undefined ? 'custom' : false"
                        highlight-current-row
                        :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <template v-if="item.title !== '冻结标志' ">
                            {{$util.tableRowFormat(scope.row, item)}}
                        </template>
                        <template v-if="item.title === '冻结标志' ">
                            <Tag
                                    :color="scope.row.freezeFlag === '0' ? 'blue' : 'red' "
                            >{{$util.tableRowFormat(scope.row, item)}}</Tag>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </Row>
        <Page class="mt-10" :total="tableData.total" @on-change="onGridPageChange" @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer placement="top"></Page>
        <div slot="footer">
            <Button @click="onCancel" size="small" type="text">{{$t('i.modal.cancelText')}}</Button>
            <Button @click="onOk" size="small" type="primary" :disabled="tableData.selectedRow === null">{{$t('i.modal.okText')}}</Button>
        </div>
    </Modal>
</template>
<script>
// import businessApi from '@/api/codec/business_code'
export default {
  name: 'modal-shipp-company',
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

    property: {
      type: String,
      default: ''
    },
    customerProperty: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      personType: this.businessType,
      keywords: null,
      searchFromBegin: false,
      selection: [],
      tableData: {
        selectedRow: null,
        pageNum: 1,
        pages: 1,
        size: 10,
        total: 0,
        sortList: [],
        filterList: [],
        columnList: [
          {
            title: this.$t('bsCode.code'),
            key: 'code',
            width: 100
          },
          {
            title: this.$t('companySet.chineseName'),
            key: 'chineseName',
            width: 100
          },
          {
            title: this.$t('companySet.englishName'),
            key: 'englishName',
            width: 100
          },
          {
            title: this.$t('bsCode.freezeFlag'),
            key: 'freezeFlag',
            width: 100,
            type: 'format',
            format: {
              '0': '正常',
              '1': '冻结'
            }
          },
          {
            title: this.$t('bsCode.remark'),
            key: 'remark',
            width: 100
          },

          {
            title: '创建时间',
            key: 'createdTime',
            width: 150,
            type: 'datetime'
          }
        ],
        list: [],
        loading: true
      }

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
      // this.tableData.loading = true;
      // let body = {
      //     pageNum: this.tableData.pageNum,
      //     pageSize: this.tableData.size,
      //     filterList: this.tableData.filterList,
      //     sortList: this.tableData.sortList,
      //     searchKey: this.keywords,
      //     codeType:'SHIPPING_COMPANY'
      // };

      // businessApi.getBusinessCodeList(body).then(({data}) => {
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

    personType (newVal, oldVal) {
      if (newVal !== oldVal && this.show) {
        this.loadData()
      }
    }
  }
}
</script>
