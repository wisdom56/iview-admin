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
            title="selectCustomer"
            @on-ok="onOk"
            @on-cancel="onCancel"
            :width="800"
            class="modal-class"
            :style="{zIndex: 1050, position: 'absolute'}"
    >
        <Row>
            <i-col span="8">
                <Form :label-width="70">
                    <FormItem label="modal.selectParty.contentSearch">
                        <Input size="small" v-model="keywords" type="text" placeholder="请输入字段内容" clearable @on-enter="loadData"></Input>
                    </FormItem>
                </Form>
            </i-col>
            <i-col span="1" class="i-col-middle"><Button type="primary" size="small" icon="ios-search" @click="loadData"></Button></i-col>
        </Row>
        <Row>
            <!-- :height="tableHeight" -->
            <el-table
                    :data="tableData[0].list"
                    border
                    height="calc(100vh - 350px)"
                    style="width: 100%"
                    size="mini"
                    highlight-current-row
                    @row-dblclick="onRowDblClick"
                    @current-change="currentChange"
                    @row-click="onRowClick"
                    oncontextmenu="return false;"
                    ref="multipleTable"
                    sortable="custom"
                    header-row-class-name="table-text-center"
                    row-class-name="table-text-center" >
                <el-table-column
                        label="编号"
                        type="index"
                        width="55"
                        align="center">
                </el-table-column>
                <el-table-column
                        v-for="(item, key) in columnList" :key="key"
                        :prop="item.key"
                        :label="item.title"
                        :width="item.width"
                        align="center"
                        :sortable="item.sortable!==undefined?'custom': false"
                        :show-overflow-tooltip="true" >
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
            <Page class="mt-10" :total="tableData.total" @on-change="onGridPageChange" @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer placement="top"></Page>
        </Row><div slot="footer">
            <Button @click="onCancel" size="small" type="text">取消</Button>
            <Button @click="onOk" size="small" type="primary" :disabled="tableData.selectedRow === null">确定</Button>
        </div>
    </Modal>
</template>
<script>
// import api from '@/api/crm/customer_group'
export default {
  name: 'customer-group',
  props: {
    // tableHeight: {
    //   type: String,
    //   default: 'calc(100vh - 350px)'
    // },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      keywords: '',
      columnList: [
        {
          title: 'groupName',
          key: 'groupName',
          width: 100
        },
        {
          title: 'groupAbbreviation',
          key: 'groupAbbreviation',
          width: 100
        },
        {
          title: 'mnemonicCode',
          key: 'mnemonicCode',
          width: 100
        },
        {
          title: 'createdByName',
          key: 'createdByName',
          width: 100
        },
        {
          title: 'createdTime',
          key: 'createdTime',
          width: 100,
          type: 'date'
        }
      ],
      tableData: [{
        pageNum: 1,
        pages: 1,
        size: 10,
        total: 0,
        sortList: [],
        filterList: [],
        list: []
      }],
      selected: null
    }
  },
  methods: {
    onOk () {
      this.$emit('on-select', this.selected)
      this.$emit('update:show', false)
    },
    onCancel () {
      this.$emit('update:show', false)
    },
    init () {
      this.initGridData()
    },
    onRowDblClick (row) {
      this.$emit('on-select', row)
      this.$emit('update:show', false)
    },
    onRowClick (row, event, column) {
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    currentChange (val) {
      this.selected = val
      this.$emit('on-select-change', val)
    },
    initGridData () {
      // let body = {
      //     pageNum: this.tableData.pageNum,
      //     pageSize: this.tableData.size,
      //     filterList: this.tableData.filterList,
      //     sortList: this.tableData.sortList,
      //     searchKey: this.keywords
      // };
      // api.getPageList(body).then(({ data }) => {
      //     if (data.returnCode === 200) {
      //         this.tableData.list = data.returnData.pageInfo.list;
      //         this.tableData.total = data.returnData.pageInfo.total;
      //     } else {
      //         this.$Message.warning('数据异常,请重试！');
      //     }
      // });
    },
    onGridPageChange (pageNum) {
      this.tableData.pageNum = pageNum
      this.initGridData()
    },
    onGridPageSizeChange (size) {
      this.tableData.pageNum = 1
      this.tableData.size = size
      this.initGridData()
    },
    loadData () {
      this.initGridData()
    }
  },
  created () {
    this.init()
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.initGridData()
      }
    }
  }
}
</script>
