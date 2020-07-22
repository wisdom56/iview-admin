
<style>
    .list-group-item i{
        cursor: pointer;
    }
    .statistics-table .el-table__header tr th{
        padding: 0;
    }
    .ivu-tooltip, .ivu-tooltip-rel {
        display: inline-block;
        width: 100%;
    }
    .ivu-tooltip-inner {
        max-width: 400px;
        min-height: 34px;
        padding: 8px 12px;
        color: #fff;
        text-align: left;
        text-decoration: none;
        background-color: rgba(70,76,91,.9);
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        white-space: nowrap;
    }

</style>
<template>
    <div>
            <!-- <div class="page-box">
                <Card>
                    <Row class="mb-10">
                        <i-col span="12" >
                            <Tooltip transfer placement="top-start">
                                <div slot="content" style="width: 100%;overflow: auto ;white-space: normal !important;">
                                    {{cardName}}
                                </div>
                                <menu-content-layout-title style="width: 100%;height: 24px;overflow: hidden;white-space:nowrap;text-overflow:ellipsis">{{cardName}}</menu-content-layout-title>
                            </Tooltip>
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
                            @row-dblclick="onDblClick"
                            :filter-method="tableFilterHandler"
                            v-loading="tableData.loading"
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
                </Card>
                <order-modal :show.sync="showOrderModal" :order-no="modalOrderNo" :business-type="businessType"></order-modal>
            </div> -->
    </div>

</template>

<script>
// import TableOptions from '@/components/table/table-options/index';
// import SearchModalTitle from '@/components/search-modal/search-modal-title/index';
// import api from '@/api/statistics/billStatistics';
// import OrderModal from '../financial-management/financial-order-management/modal';
// import fileDownload from 'js-file-download';
// import config from '@/../build/config';
export default {
  // name: 'profit-detail-statistics',
  // components: {
  //     OrderModal,
  //     SearchModalTitle,
  //     TableOptions,
  // },
  // data () {
  //     return {
  //         showOrderModal: false,
  //         modalOrderNo: '',
  //         businessType: '',
  //         keywords: '',
  //         selection: [],
  //         tableData: {
  //             searchKey: '',
  //             selectedRow: null,
  //             sortList: [],
  //             list: [],
  //             loading: false
  //         },
  //         columns: [
  //             {
  //                 title: '提单号',
  //                 key: 'bodyNo',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 150,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '结算客户',
  //                 key: 'customerName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 150,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '利润',
  //                 key: 'profit',
  //                 align: 'right',
  //                 type: 'numCommas',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '利润率',
  //                 key: 'profitRatio',
  //                 align: 'right',
  //                 type: 'percent',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '比率',
  //                 key: 'ratio',
  //                 align: 'right',
  //                 type: 'percent',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '委托客户',
  //                 key: 'custName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 140,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '其中',
  //                 key: 'other',
  //                 align: 'center',
  //                 width: 200,
  //                 show: true,
  //                 children: [
  //                     {
  //                         title: '美元利润',
  //                         key: 'usdProfit',
  //                         align: 'right',
  //                         type: 'numCommas',
  //                         width: 100,
  //                         show: true,
  //                         sortable: true
  //                     },
  //                     {
  //                         title: '人民币利润',
  //                         key: 'rmbProfit',
  //                         align: 'right',
  //                         type: 'numCommas',
  //                         width: 100,
  //                         show: true,
  //                         sortable: true
  //                     }
  //                 ]
  //             },
  //             {
  //                 title: '应收本位币',
  //                 key: 'amountReceivable',
  //                 align: 'right',
  //                 type: 'numCommas',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '实收本位币',
  //                 key: 'standardMoneyReceipt',
  //                 align: 'right',
  //                 type: 'numCommas',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '应付本位币',
  //                 key: 'amountPayable',
  //                 align: 'right',
  //                 type: 'numCommas',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '实付本位币',
  //                 key: 'standardMoneyPaid',
  //                 align: 'right',
  //                 type: 'numCommas',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '抵/离港日',
  //                 key: 'shipDate',
  //                 align: 'center',
  //                 width: 100,
  //                 show: true,
  //                 type: 'date',
  //                 sortable: true
  //             },
  //             {
  //                 title: '货量',
  //                 key: 'containerWeight',
  //                 align: 'center',
  //                 width: 280,
  //                 show: true,
  //                 children: [
  //                     {
  //                         title: '20\'',
  //                         key: 'x20',
  //                         align: 'center',
  //                         width: 70,
  //                         show: true,
  //                         sortable: true
  //                     },
  //                     {
  //                         title: '40\'',
  //                         key: 'x40',
  //                         align: 'center',
  //                         width: 70,
  //                         show: true,
  //                         sortable: true
  //                     },
  //                     {
  //                         title: '其它箱型',
  //                         key: 'xOther',
  //                         align: 'center',
  //                         width: 90,
  //                         show: true,
  //                         sortable: true
  //                     },
  //                     {
  //                         title: 'Teu',
  //                         key: 'teu',
  //                         align: 'center',
  //                         precision: 1,
  //                         width: 70,
  //                         show: true,
  //                         sortable: true
  //                     },
  //                     {
  //                         title: 'CBM',
  //                         key: 'measurement',
  //                         align: 'center',
  //                         precision: 3,
  //                         width: 80,
  //                         show: true,
  //                         sortable: true
  //                     },
  //                     {
  //                         title: 'KGS',
  //                         key: 'statisticsKgs',
  //                         align: 'center',
  //                         precision: 3,
  //                         width: 80,
  //                         show: true,
  //                         sortable: true
  //                     }
  //                 ]
  //             },
  //             {
  //                 title: '承运人',
  //                 key: 'carrierName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '运输工具',
  //                 key: 'transportName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 130,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '装货港',
  //                 key: 'loadPortName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '卸货港',
  //                 key: 'dischgPortName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '业务流水号',
  //                 key: 'orderNo',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '分单号',
  //                 key: 'interalBlNo',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '业务类型',
  //                 key: 'businessTypeName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '主营业务类型',
  //                 key: 'mainBusinessTypeName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: '销售',
  //                 key: 'canvasserName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             },
  //             {
  //                 title: this.$t('operation.bookContact'),
  //                 key: 'bookContact',
  //                 width: 120,
  //                 sortable: true,
  //                 show: true
  //             },
  //             {
  //                 title: '操作',
  //                 key: 'operName',
  //                 align: 'center',
  //                 type: 'text',
  //                 width: 100,
  //                 show: true,
  //                 sortable: true
  //             }
  //         ],
  //         columnWidthObj: null,
  //         rightClickRow: {},
  //         formData: {},
  //         opt: '',
  //         cardName: ''
  //     };
  // },
  // methods: {
  //     onTableSort(result) {
  //         if (result.order === 'descending') {
  //             let sortItem = {
  //                 sortKey: result.prop,
  //                 sortValue: 'desc'
  //             };
  //             this.tableData.sortList = [sortItem];
  //         } else if (result.order === 'ascending') {
  //             let sortItem = {
  //                 sortKey: result.prop,
  //                 sortValue: 'asc'
  //             };
  //             this.tableData.sortList = [sortItem];
  //         } else {
  //             this.tableData.sortList = [];
  //         }
  //     },
  //     onTableFilter() {
  //         return this.tableData.list.filter(data => {
  //             if(this.keywords.trim() != '') {
  //                 for(let key in data) {
  //                     if(data[key] != null && data[key].toString().toUpperCase().includes(this.keywords.toUpperCase())) {
  //                         return true;
  //                     }
  //                 }
  //             }  else {
  //                 return true;
  //             }
  //         })
  //     },
  //     onDblClick(row) {
  //         if (config['viewOrderStatisticsDetail'] === 'view') {
  //             this.modalOrderNo = row.orderNo;
  //             this.businessType = row.businessType === '01' || row.businessType === '02' || row.businessType === '03'
  //             || row.businessType === '04' ? 'HD' : row.businessType === '05' || row.businessType === '06' ? 'KY' : 'WMS';
  //             this.showOrderModal = true;
  //         }
  //     },
  //     tableFilterHandler(value, row, column) {
  //         const property = column['property'];
  //         return row[property] === value;
  //     },
  //     onHeaderDragend(newVal, oldWidth, column) {
  //         this.columnWidthObj = column;
  //     },
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
  //     onRowContentMenu (row, event) {
  //         this.rightClickRow = row;
  //         this.$refs.tableContextMenu.open(event);
  //     },
  //     // onRowClick (row, event, column) {
  //     //     this.$refs.multipleTable.clearSelection();
  //     //     this.$refs.multipleTable.toggleRowSelection(row);
  //     // },
  //     onSubmit () {
  //         this.initData();
  //     },
  //     loadData () {
  //         let searchForm = this.searchForm;
  //         let opt = this.opt;
  //         this.tableData.loading = true;
  //         api.selectProfitDetailStatistics(searchForm).then(({data}) => {
  //             this.tableData.loading = false;
  //             if (data.returnCode === 200) {
  //                let profitSum = 0;
  //                 data.returnData.forEach(item=>{
  //                     if(item.profit) {
  //                         profitSum = (parseFloat(profitSum) + parseFloat(item.profit)).toFixed(2);
  //                     }
  //                 });
  //                 data.returnData.forEach(item=>{
  //                     if(item.profit && profitSum != 0) {
  //                         item.ratio = (parseFloat(item.profit/profitSum)*100).toFixed(2);
  //                     } else {
  //                         item.ratio = 0;
  //                     }
  //                 });
  //                 this.tableData.list = this.$util.formatReturnData(data.returnData, this.columns);
  //             } else {
  //                 this.$Message.warning('数据异常,请重试！');
  //             }
  //         });
  //     },
  //     initData () {
  //         this.tableData.selectedRow = null;
  //         this.tableData.list = [];
  //         this.keywords = '';
  //         this.searchForm = this.$route.params.searchForm;
  //         this.opt = this.$route.params.opt;
  //         if (this.opt === '客户') {
  //             this.columns[1].show = false;
  //         } else {
  //             this.columns[1].show = true;
  //         }
  //         this.cardName = '【' + this.$route.params.bodyName + '】'+ this.opt + '利润统计(' + this.searchForm.startDate + ' 至 ' + this.searchForm.endDate + ')';
  //         this.loadData();
  //     },
  //     exportData(){
  //         if(this.tableData.list.length<=0){
  //             this.$Message.warning('暂无数据可导出！');
  //             return ;
  //         }
  //         let queryExcelBody = {
  //             type: '6',
  //             tableWord: this.columns,
  //             billStatisticsSearchDto: this.searchForm,
  //             title: this.cardName,
  //             sortList: this.tableData.sortList
  //         };
  //         const timestamp=new Date().getTime();
  //         api.exportData(queryExcelBody).then(response=>{
  //             if(response.status == 200){
  //                 fileDownload(response.data, '利润详情统计_'+ timestamp +'.xls');
  //             }else{
  //                 this.$Message.warning('导出失败！');
  //             }
  //         }).catch(error => {
  //             this.$Notice.error({
  //                 title: '发生错误',
  //             });
  //         });
  //     },
  //     getSummaries(param) {
  //         const { columns, data } = param;
  //         const sums = [];
  //         let columnsObj = {};
  //         this.columns.forEach(item => {
  //             if(item.children !== undefined) {
  //                 item.children.forEach(itemChild => {
  //                     columnsObj[itemChild.key] = itemChild;
  //                 });
  //             } else {
  //                 columnsObj[item.key] = item;
  //             }
  //         });
  //         columns.forEach((column, index) => {
  //             if (index === 1) {
  //                 sums[index] = '总计';
  //                 return;
  //             }
  //             if (column.property === undefined) {
  //                 return;
  //             }
  //             const values = data.map(item => Number(item[column.property]));
  //             if (columnsObj[column.property].align !== undefined) {
  //                 if(columnsObj[column.property].align === 'left') {
  //                     column.className = 'footer-align-left';
  //                 } else if(columnsObj[column.property].align === 'right') {
  //                     column.className = 'footer-align-right';
  //                 } else if(columnsObj[column.property].align === 'center') {
  //                     column.className = 'footer-align-center';
  //                 }
  //             }
  //             if (!values.every(value => isNaN(value))) {
  //                 sums[index] = values.reduce((prev, curr) => {
  //                     const value = Number(curr);
  //                     if (!isNaN(value)) {
  //                         if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'numCommas') {
  //                             let precision = 2;
  //                             if (columnsObj[column.property].precision) {
  //                                 precision = columnsObj[column.property].precision;
  //                             }
  //                             let prevNew = (prev+'').replace(/,/g,'');
  //                             let currNew = (curr+'').replace(/,/g,'');
  //                             return this.$util.formatNumberCommasPrecision((parseFloat(prevNew) + parseFloat(currNew)).toFixed(precision), precision);
  //                         } else if (columnsObj[column.property].precision) {
  //                             let precision = columnsObj[column.property].precision;
  //                             let prevNew = (prev+'').replace(/,/g,'');
  //                             let currNew = (curr+'').replace(/,/g,'');
  //                             return this.$util.formatNumberCommasPrecision((parseFloat(prevNew) + parseFloat(currNew)).toFixed(precision), precision);
  //                         } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'percent') {
  //                             return '100%';
  //                         } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'text') {
  //                             return '';
  //                         } else if (columnsObj[column.property].type !== undefined && columnsObj[column.property].type === 'date'){
  //                             return '';
  //                         } else {
  //                             return (prev + curr);
  //                         }
  //                     } else {
  //                         return '';
  //                     }
  //                 }, 0);
  //                 sums[index] += '';
  //             } else {
  //                 sums[index] = '';
  //             }
  //         });
  //         return sums;
  //     }
  // },
  // created () {
  //     this.columns = this.$util.copy(this.columns);
  //     this.initData();
  // },
  // activated () {
  //     if (this.$route.params.op !== undefined && this.$route.params.op === 'refresh') {
  //         this.initData();
  //     }
  // }
}
</script>
