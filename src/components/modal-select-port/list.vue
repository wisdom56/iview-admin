<template>
    <div>
        <el-table
                :data="tableData[0].list"
                height="calc(100vh - 400px)"
                border
                style="width: 100%"
                size="mini"
                @row-dblclick="onRowDblClick"
                highlight-current-row
                @current-change="selectionChange"
                oncontextmenu="return false;"
                ref="multipleTable"
                sortable="custom">
            <el-table-column
                    v-for="(item, key) in tableData[0].columnList" :key="key"
                    :prop="item.key"
                    :label="item.title"
                    :width="item.width"
                    :sortable="item.sortable!==undefined?'custom': false"
                    :show-overflow-tooltip="true">
                <!-- <template slot-scope="scope">
                    <template v-if="item.title !== '冻结' ">
                        {{$util.tableRowFormat(scope.row, item)}}
                    </template>
                    <template v-if="item.title === '冻结' ">
                        <Tag :color="scope.row.freezeFlag === '0' ? 'blue' : 'red' ">
                            {{$util.tableRowFormat(scope.row, item)}}
                        </Tag>
                    </template>
                </template> -->
            </el-table-column>
        </el-table>
        <Page class="mt-10" :total="tableData[0].total" :page-size="tableData[0].size" :page-size-opts="tableData[0].pageOptionsList" @on-change="onGridPageChange" @on-page-size-change="onGridPageSizeChange" size="small" show-total show-elevator show-sizer placement="top"></Page>
    </div>
</template>

<script>
// import api from '@/api/codec/business_code'
export default {
  name: 'codec_port',
  props: {
    codeType: {
      type: String,
      default: 'PORTCD'
    },
    searchKey: {
      type: String,
      default: ''
    },
    tableHeight: {
      type: String,
      default: 'calc(100vh - 400px)'
    }
  },
  data () {
    return {
      tableData: {
        pageNum: 1,
        pages: 1,
        size: this.$store.state.sysSettings.pageSize,
        pageOptionsList: this.$store.state.sysSettings.pageOptionsList,
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
            title: this.$t('bsCode.chineseName'),
            key: 'chineseName',
            width: 100
          },
          {
            title: this.$t('bsCode.englishName'),
            key: 'englishName',
            width: 100
          },
          {
            title: this.$t('bsCode.stateCode'),
            key: 'stateCode',
            width: 100
          },
          {
            title: this.$t('bsCode.stateName'),
            key: 'stateName',
            width: 100
          },
          {
            title: this.$t('bsCode.countryCode'),
            key: 'countryCode',
            width: 100
          },
          {
            title: this.$t('bsCode.countryName'),
            key: 'countryName',
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
            title: '最后修改人',
            key: 'lastModifiedByName',
            width: 100
          },
          {
            title: '最后修改时间',
            key: 'lastModifiedTime',
            width: 150,
            type: 'datetime'
          }
        ],
        list: []
      },
      selectRow: null
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
    selectionChange (selectRow) {
      this.selectRow = selectRow
      this.$emit('on-select-change', selectRow)
    },
    onRowDblClick (row) {
      this.$emit('on-db-select', row)
    },
    initGridData () {
    //   let body = {
    //     pageNum: this.tableData.pageNum,
    //     pageSize: this.tableData.size,
    //     filterList: this.tableData.filterList,
    //     sortList: this.tableData.sortList,
    //     searchKey: this.searchKey,
    //     codeType: this.codeType
    //   }
      // api.getBusinessCodeList(body).then(({ data }) => {
      //     if (data.returnCode === 200) {
      //         this.tableData.list = data.returnData.pageInfo.list;
      //         this.tableData.total = data.returnData.pageInfo.total;
      //     } else {
      //         this.$Message.warning('数据异常,请重试！');
      //     }
      // });
    }
  },
  created () {
    this.initGridData()
  }
}

</script>
<style scoped>
</style>
