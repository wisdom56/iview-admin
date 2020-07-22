<template>
    <div>
        <Modal title="其他账号" :value="show" :mask-closable="false" @on-ok="onOk" @on-cancel="onCancel" width="900">
            <div class="form-flex lh-default">
                <div class="flex-none w80-label">全文检索:</div>
                <div class="flex-none w200 pr-10">
                    <Input v-model="keywords" placeholder="" @on-click="inputChange" @on-enter="initGridData()" icon="search" size="small"/>
                </div>
            </div>
            <div>
                <el-table :data="tableData.list" height="calc(50vh - 80px)" border highlight-current-row style="width: 100%" size="mini" v-loading="tableData.loading" @row-dblclick="rowDblclick" @row-click="onRowClick" @current-change="handleCurrentChange" sortable="custom" ref="multipleTable" @sort-change="onTableSort">
                    <el-table-column
                            label="编号"
                            type="index"
                            align="center"
                            width="50">
                    </el-table-column>
                    <el-table-column v-for="(item, key) in tableData.columnList" :key="key" :prop="item.key" :label="item.title" :width="item.width" :sortable="item.sortable!==undefined?'custom': false" :show-overflow-tooltip="true">
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
                <div style="margin: 1px;overflow: hidden">
                    <div style="float: right;">
                        <Page class="mt-10" :total="tableData.total" :page-size="tableData.size" :page-size-opts="tableData.pageOptionsList" @on-change="onGridPageChange" @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer placement="top"></Page>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button @click="onCancel" size="small" type="text">{{$t('i.modal.cancelText')}}</Button>
                <Button @click="onOk" size="small" type="primary" :disabled="tableData.selectedRow === null">{{$t('i.modal.okText')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
// import { fetchAccountList } from '@/api/setting/account';
export default {
  name: 'modal-user',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      keywords: '',
      tableData: {
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
            key: 'userName',
            title: '用户名',
            width: 100
          },
          {
            key: 'realName',
            title: '真实姓名',
            width: 200
          },
          {
            key: 'email',
            title: '邮箱',
            width: 230
          },
          {
            key: 'mobile',
            title: '手机',
            width: 200
          }
        ],
        loading: true,
        list: []
      },
      selectRows: []
    }
  },
  methods: {
    onGridPageChange (pageNum) {
      this.tableData.pageNum = pageNum
      this.initGridData()
    },
    onGridPageSizeChange (size) {
      this.tableData.pageNum = 1
      this.tableData.size = size
      this.initGridData()
    },
    onRowClick (row, event, column) {
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    onCancel () {
      this.$emit('update:show', false)
    },
    onOk () {
      this.$emit('on-select', this.tableData.selectedRow, this.showType)
      this.$emit('update:show', false)
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
      this.initGridData()
    },
    rowDblclick (row, event) {
      this.$emit('on-select', this.tableData.selectedRow, this.showType)
      this.$emit('update:show', false)
    },
    inputChange () {
      this.initGridData()
    },
    handleCurrentChange (val) {
      this.tableData.selectedRow = val
    },
    initData () {
      this.tableData.loading = true
      this.tableData.selectedRow = null
      this.tableData.sortList = []
      this.tableData.list = []
      this.keywords = null
      this.tableData.filterList = []
      this.initGridData()
    },
    initGridData () {
      // let body = {
      //     pageNum: this.tableData.pageNum,
      //     pageSize: this.tableData.size,
      //     searchKey: this.keywords,
      //     filterList: this.tableData.filterList,
      //     sortList: this.tableData.sortList
      // };
      // fetchAccountList(body).then(({data}) => {
      //     this.tableData.loading = false;
      //     if (data.returnCode === 200) {
      //         this.tableData.list = data.returnData.pageInfo.list;
      //         this.tableData.total = data.returnData.pageInfo.total;
      //     } else {
      //         this.$Message.warning('数据异常,请重试！');
      //     }
      // });
    }
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.initData()
      }
    }
  }
}
</script>

<style scoped>
</style>
