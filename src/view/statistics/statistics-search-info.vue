
<style lang="less" scoped>
.ivu-select-placeholder{
    display: inline;
}
.div-inline{
    display: inline;
}
.flex-auto1{
    width: 180px;
    float: left;
   padding-left: 7px;
}
.flex-auto{
    float: left;
    flex: auto;
    width: 100px;
}
.flex-none{
    float: left;
    flex: auto;
}
.ivu-scroll-content{
    padding-left: 8px;
}
.btn-square{
    float:left;
    width: 25px;
    height: 24px;
}
</style>

<template>
    <div>
        <Scroll  height="650">
        <!-- <Card> -->
        <div class="flex mt-5 mb-5" >
            <div class="flex-auto1">统计查询</div>
                <Button size="small" type="primary" @click="onSubmit">查询</Button>
        </div>
        <Divider />
        <Form :label-width="70">
            <FormItem label="查询方案:">
                <div class="flex mt-5 mb-5">
                        <Select v-model="searchFormSettings.searchSchemeId" size="small" class="select1" clearable style="width:75%">
                            <Option v-for="item in searchFormSettings.searchSchemeObj" :value="item.id" :key="item.id">{{ item.settingsName }}</Option>
                        </Select>
                        <Button size="small" class="select1butn"  @click.natvie="searchFormSettings.searchSchemeShow=!searchFormSettings.searchSchemeShow"><i class="iconfont icon-shezhi1"></i></Button>
                </div>
            </FormItem>
        </Form>
        <div class="align-right" v-if="searchFormSettings.searchSchemeShow">
            <Button size="small" type="primary" @click="onSearchSchemeNew">新建</Button>
            <Button size="small" type="primary" @click="onSearchSchemeEdit" :disabled="searchFormSettings.searchSchemeId == null || searchFormSettings.searchSchemeId == ''">保存</Button>
            <Button size="small" type="error" @click="onSearchSchemeDel" :disabled="searchFormSettings.searchSchemeId == null || searchFormSettings.searchSchemeId == ''">删除</Button>
            <Modal
                    v-model="searchFormSettings.searchSchemeModal.show"
                    title="保存搜索方案"
            >
                <Form :label-width="70">
                    <FormItem label="方案名称:">
                        <Input size="small" v-model="searchFormSettings.searchSchemeModal.name" />
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="onSaveCancel" size="small" type="text">取消</Button>
                    <Button @click="onSaveOk" size="small" type="primary">确定</Button>
                </div>
            </Modal>
        </div>
        <Divider />
        <Form :model="searchForm" :label-width="70">
            <FormItem label="屏蔽信息:">
                <Checkbox label="平账信息" :disabled="type!=='arrears' && type!=='unpaid'" v-model="searchForm.equalAccountHide">平账信息</Checkbox>
                <Checkbox label="账龄分析" :disabled="type!='arrears' && type!='unpaid'" v-model="searchForm.agingHide">账龄分析</Checkbox>
            </FormItem>
            <FormItem label="统计日期:">
                <RadioGroup v-model="searchForm.statisticalDateType">
                    <Radio :label="0">业务日期</Radio>
                    <Radio :label="1">财务日期</Radio>
                    <Radio :label="2" v-if="type=='container'">预计离港日</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="开始日期:">
                <DatePicker size="small" v-model="searchForm.startTime" format="yyyy-MM-dd" type="date"
                            placement="bottom-end" placeholder="统计日期" style="width: 100%;"></DatePicker>
            </FormItem>
            <FormItem label="结束日期:">
                <DatePicker size="small" v-model="searchForm.endTime" format="yyyy-MM-dd" type="date" placement="bottom-end"
                            placeholder="统计日期" style="width: 100%;"></DatePicker>
            </FormItem>
           <Divider />
            <FormItem label="统计类型:">
                <Select v-model="searchForm.statisticalType" size="small" @on-change="onStatisticalType">
                    <Option v-for="item in searchFormSettings.statisticalType" :value="item.value" :key="item.value" v-if="onTypeHide(item, type)">
                        {{item.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="统计条件:">
            </FormItem>
            <Tree :data="searchFormSettings.conditionTree" show-checkbox></Tree>
            <FormItem label="客户约号:">
                <Input size="small" v-model="searchForm.agreement" clearable placeholder="请输入客户约号"/>
            </FormItem>
            <FormItem label="筛选客户:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.customerList.length == 0 ? '全部客户':'部分客户'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onCustomerListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.customerTableShow=!searchFormSettings.customerTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.customerTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.customerList.length > 0" v-show="searchFormSettings.customerTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.customerList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.customerList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="客户名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onCustomerListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <FormItem label="筛选航线:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.shippingLineList.length == 0 ? '全部航线':'部分航线'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onShippingLineAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.shippingLineTableShow=!searchFormSettings.shippingLineTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.shippingLineTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.shippingLineList.length > 0" v-show="searchFormSettings.shippingLineTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.shippingLineList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.shippingLineList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="航线名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onShippingLineDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <FormItem label="筛选销售:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.canvasserList.length == 0 ? '全部销售':'部分销售'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onCanvasserListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.canvasserTableShow=!searchFormSettings.canvasserTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.canvasserTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.canvasserList.length > 0" v-show="searchFormSettings.canvasserTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.canvasserList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.canvasserList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="销售姓名"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onCanvasserListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <FormItem label="筛选商务:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.reviewerList.length == 0 ? '全部商务':'部分商务'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onReviewerListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.reviewerTableShow=!searchFormSettings.reviewerTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.reviewerTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.reviewerList.length > 0" v-show="searchFormSettings.reviewerTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.reviewerList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.reviewerList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="商务名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onReviewerListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <FormItem label="筛选客服:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.serviceList.length == 0 ? '全部客服':'部分客服'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onServiceListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.serviceTableShow=!searchFormSettings.serviceTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.serviceTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.serviceList.length > 0" v-show="searchFormSettings.serviceTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.serviceList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.serviceList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="商务名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onServiceListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <FormItem label="筛选操作:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.originatorList.length == 0 ? '全部操作':'部分操作'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onOriginatorListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.originatorTableShow=!searchFormSettings.originatorTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.originatorTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.originatorList.length > 0" v-show="searchFormSettings.originatorTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.originatorList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.originatorList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="商务名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onOriginatorListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <FormItem label="筛卸货港:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.destPortList.length == 0 ? '全部港口':'部分港口'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onDestPortAdd()" >
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.destPortTableShow=!searchFormSettings.destPortTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.destPortTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.destPortList.length > 0" v-show="searchFormSettings.destPortTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.destPortList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.destPortList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="卸货港"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="类型"
                            prop="type"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onDestPortDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <FormItem label="航运公司:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.shippCompanyList.length == 0 ? '全部航运公司':'部分航运公司'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onShippCompanyListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.shippCompanyTableShow=!searchFormSettings.shippCompanyTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.shippCompanyTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.shippCompanyList.length > 0" v-show="searchFormSettings.shippCompanyTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.shippCompanyList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.shippCompanyList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="航运公司名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onShippCompanyListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--订舱代理-->
            <FormItem label="订舱代理:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.bookAgentList.length == 0 ? '全部订舱代理':'部分订舱代理'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onBookAgentListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.bookAgentTableShow=!searchFormSettings.bookAgentTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.bookAgentTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.bookAgentList.length > 0" v-show="searchFormSettings.bookAgentTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.bookAgentList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.bookAgentList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="订舱代理名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onBookAgentListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--场站-->
            <FormItem label="场站:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.loadList.length == 0 ? '全部场站':'部分场站'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onLoadListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.loadTableShow=!searchFormSettings.loadTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.loadTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.loadList.length > 0" v-show="searchFormSettings.loadTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.loadList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.loadList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="场站名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onLoadListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--报关行-->
            <FormItem label="报关行:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.customsBrokerList.length == 0 ? '全部报关行':'部分报关行'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onCustomsBrokerListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.customsBrokerTableShow=!searchFormSettings.customsBrokerTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.customsBrokerTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.customsBrokerList.length > 0" v-show="searchFormSettings.customsBrokerTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.customsBrokerList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.customsBrokerList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="报关行名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onCustomsBrokerListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--车队-->
            <FormItem label="筛选车队:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.convoyList.length == 0 ? '全部车队':'部分车队'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onConvoyListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.convoyTableShow=!searchFormSettings.convoyTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.convoyTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.convoyList.length > 0" v-show="searchFormSettings.convoyTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.convoyList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.convoyList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="车队名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onConvoyListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--地面服务-->
            <FormItem label="地面服务:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.groundServiceList.length == 0 ? '全部地面服务':'部分地面服务'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onGroundServiceListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.groundServiceTableShow=!searchFormSettings.groundServiceTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.groundServiceTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.groundServiceList.length > 0" v-show="searchFormSettings.groundServiceTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.groundServiceList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.groundServiceList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="地面服务名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onGroundServiceListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--海外代理-->
            <FormItem label="海外代理:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.overseaAgentList.length == 0 ? '全部海外代理':'部分海外代理'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onOverseaAgentListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.overseaAgentTableShow=!searchFormSettings.overseaAgentTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.overseaAgentTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.overseaAgentList.length > 0" v-show="searchFormSettings.overseaAgentTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.overseaAgentList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.overseaAgentList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="海外代理名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onOverseaAgentListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--客户集团-->
            <FormItem label="客户集团:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.customerGroupList.length === 0 ? '全部客户集团':'部分客户集团'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onCustomerGroupListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.customerGroupTableShow=!searchFormSettings.customerGroupTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.customerGroupTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.customerGroupList.length > 0" v-show="searchFormSettings.customerGroupTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.customerGroupList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.customerGroupList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="客户集团名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onCustomerGroupListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--来源客户-->
            <FormItem label="来源客户:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.transactionSourceCustomerList.length === 0 ? '全部来源客户':'部分来源客户'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onTransactionSourceListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.transactionSourceShow=!searchFormSettings.transactionSourceShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.transactionSourceShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.transactionSourceCustomerList.length > 0" v-show="searchFormSettings.transactionSourceShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.transactionSourceCustomerList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.transactionSourceCustomerList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="来源客户名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onTransactionSourceListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!--起运港-->
            <FormItem label="装货港:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.portOfLoadList.length == 0 ? '全部装货港':'部分装货港'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onPortOfLoadListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.portOfLoadListTableShow=!searchFormSettings.portOfLoadListTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.portOfLoadListTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.portOfLoadList.length > 0" v-show="searchFormSettings.portOfLoadListTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.portOfLoadList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.portOfLoadList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="装货港"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="类型"
                            prop="type"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onPortOfLoadListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--收货地-->
            <FormItem label="收货地:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.rcvPortList.length == 0 ? '全部收货地':'部分收货地'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onRcvPortListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.rcvPortListTableShow=!searchFormSettings.rcvPortListTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.rcvPortListTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.rcvPortList.length > 0" v-show="searchFormSettings.rcvPortListTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.rcvPortList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.rcvPortList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="收货地"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="类型"
                            prop="type"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onRcvPortListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--船代-->
            <FormItem label="船代:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.shippingAgentList.length == 0 ? '全部船代':'部分船代'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onShippingAgentListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.shippingAgentListTableShow=!searchFormSettings.shippingAgentListTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.shippingAgentListTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.shippingAgentList.length > 0" v-show="searchFormSettings.shippingAgentListTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.shippingAgentList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.shippingAgentList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="船代名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onShippingAgentListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--费种-->
            <FormItem label="费种:" v-if="type !== 'container' && type !== 'profit'">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.feeTypeList.length == 0 ? '全部费种':'部分费种'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onFeeTypeListAdd()">
                            <Icon type="md-add"></Icon>
                        </Button>
                        <Button size="small" class="btn-square" type="text" @click="searchFormSettings.feeTypeListTableShow=!searchFormSettings.feeTypeListTableShow">
                            <i class="iconfont icon-fold" v-if="searchFormSettings.feeTypeListTableShow"></i>
                            <i class="iconfont icon-unfold" v-else></i>
                        </Button>
                    </div>
                </div>
            </FormItem>
            <div v-if="searchForm.feeTypeList.length > 0 && type !== 'container' && type !== 'profit'" v-show="searchFormSettings.feeTypeListTableShow">
                <el-table
                        style="width: 100%"
                        :height="searchForm.feeTypeList.length > 5? '161px':null"
                        size="mini"
                        border
                        :data="searchForm.feeTypeList"
                        highlight-current-row
                >
                    <el-table-column
                            width="auto"
                            label="类别"
                            prop="businessType"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="auto"
                            label="费种名称"
                            prop="name"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                            width="50"
                            label="操作"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <Button @click="onFeeTypeListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </Form>
        <modal-select-customer :show.sync="showCustomerModal" :show-freeze="true" @on-select="onCustomerSelect"></modal-select-customer>
        <modal-business-code :show.sync="showShippingLineModal" @on-select="onShippingLineSelect" business-type="SHIP_ROUTE"></modal-business-code>
        <modal-select-port :show.sync="showDestPortModal" @on-select="onDestPortSelect" business-type="PORTCD" ></modal-select-port>
        <modal-select-shipping-company :show.sync="showShipCompanyModal" @on-select="onShippCompanySelect"></modal-select-shipping-company>
        <select-customer :show.sync="showBookAgentModal" @on-select="onBookAgentSelect" :show-freeze="true" customerProperty="b"></select-customer>
        <select-customer :show.sync="showConvoyModal" @on-select="onConvoySelect" :show-freeze="true" customerProperty="d"></select-customer>
        <select-customer :show.sync="showLoadModal" @on-select="onLoadSelect" :show-freeze="true" customerProperty="c"></select-customer>
        <select-customer :show.sync="showCustomsBrokerModal" @on-select="onCustomsBrokerSelect" :show-freeze="true" customerProperty="h"></select-customer>
        <select-customer :show.sync="showGroundServiceModal" @on-select="onGroundServiceSelect" :show-freeze="true" customerProperty="k"></select-customer>
        <select-customer :show.sync="showOverseaAgentModal" @on-select="onOverseaAgentSelect" :show-freeze="true" customerProperty="f"></select-customer>
        <select-customer :show.sync="showTransactionSourceModal" @on-select="onTransactionSourceSelect" :show-freeze="true"></select-customer>
        <!-- <modal-customer-group :show.sync="showCustomerGroupModal" @on-select="onCustomerGroupSelect" ></modal-customer-group> -->
        <!--装货港-->
        <!-- <modal-select-port :show.sync="showPortOfLoadModal" @on-select="onPortOfLoadSelect" business-type="PORTCD" ></modal-select-port> -->
        <!--收货地-->
        <!-- <modal-select-port :show.sync="showRcvPortModal" @on-select="onRcvPortSelect" business-type="PORTCD" ></modal-select-port> -->
        <!--船代-->
        <!-- <select-customer :show.sync="showShippingAgentModel" @on-select="onShowShippingAgentModelSelect" :show-freeze="true" customerProperty="e"></select-customer> -->
        <!--费种-->
        <!-- <modal-select-fee :show.sync="showFeeTypeListModel" @on-select="onShowFeeTypeSelect" ></modal-select-fee> -->
        <!--销售-->
        <!-- <modal-user :show.sync="showCanvasserModal" @on-select="onCanvasserSelect"></modal-user> -->
        <!--商务-->
        <!-- <modal-user :show.sync="showReviewerModal" @on-select="onReviewerSelect"></modal-user> -->
        <!--客服-->
        <!-- <modal-user :show.sync="showServiceModal" @on-select="onServiceSelect"></modal-user> -->
        <!--操作-->
        <!-- <modal-user :show.sync="showOriginatorModal" @on-select="onOriginatorSelect"></modal-user> -->
        <!-- </Card> -->
        </Scroll>
    </div>
</template>

<script>
// import codeApi from '@/api/codec/business_code'
// import api from '@/api/statistics/billStatistics'
// import settingsApi from '@/api/setting/userDefinedSettings'
import ModalBusinessCode from '@/components/modal-business-code/index'
import ModalSelectCustomer from '@/components/modal-select-customer/index'
import SelectCustomer from '@/components/modal-select-customer/customerIndex'
import ModalShippCompany from '@/components/modal-shipp-company/index'
import modalCustomerGroup from '@/components/modal-customer-group/index'
import modalSelectFee from '@/components/modal-select-fee/index'
// import businessTypeNameList from '@/views/codec/fee_setting/businessTypeList'
import modalSelectPort from '@/components/modal-select-port/index'
import modalSelectShippingCompany from '@/components/modal-select-shipping-company/index'
import modalUser from '@/components/modal-user/index'
//  import config from '@/../build/config'
export default {
  name: 'statistics-search-info',
  components: {
    ModalBusinessCode,
    ModalSelectCustomer,
    SelectCustomer,
    ModalShippCompany,
    modalCustomerGroup,
    modalSelectFee,
    modalSelectPort,
    modalSelectShippingCompany,
    modalUser
  },
  props: {
    type: {
      type: String,
      default: null
    }
  },
  data () {
    let _this = this
    return {
      showTransactionSourceModal: false,
      showCustomerGroupModal: false,
      showCustomerModal: false,
      showShippingLineModal: false,
      showDestPortModal: false,
      showShipCompanyModal: false,
      showBookAgentModal: false,
      showConvoyModal: false,
      showLoadModal: false,
      showCustomsBrokerModal: false,
      showGroundServiceModal: false,
      showOverseaAgentModal: false,
      // 自加
      showOriginCustomerModal: false,
      showCustomerGroupModel: false,
      showPortOfLoadModal: false,
      showRcvPortModal: false,
      showShippingAgentModel: false,
      showFeeTypeListModel: false,
      showCanvasserModal: false,
      showReviewerModal: false,
      showServiceModal: false,
      showOriginatorModal: false,
      searchFormBase: {
        equalAccountHide: true,
        agingHide: true,
        statisticalDateType: 0,
        startTime: null,
        endTime: null,
        statisticalType: 0,
        customerList: [],
        shippingLineList: [],
        destPortList: [],
        auditStatusList: null,
        departmentList: null,
        businessTypeList: null,
        serviceItemList: null,
        freightList: null,
        tradeModeList: null,
        payList: null,
        goodsList: null,
        bookAgentList: [],
        loadList: [],
        customsBrokerList: [],
        convoyList: [],
        groundServiceList: [],
        overseaAgentList: [],
        portOfLoadList: [], // 装货港
        rcvPortList: [], // 收货地
        shippingAgentList: [], // 船代
        feeTypeList: [], // 费种
        shippCompanyList: [],
        orderStatusList: [],
        endStatusList: [],
        agreement: '',
        customerGroupList: [],
        transactionSourceCustomerList: [],
        canvasserList: [],
        reviewerList: [],
        serviceList: [],
        originatorList: []
      },
      searchForm: {
        equalAccountHide: true,
        agingHide: true,
        statisticalDateType: 0,
        startTime: null,
        endTime: null,
        statisticalType: 0,
        customerList: [],
        shippingLineList: [],
        destPortList: [],
        auditStatusList: null,
        departmentList: null,
        businessTypeList: null,
        serviceItemList: null,
        freightList: null,
        tradeModeList: null,
        payList: null,
        goodsList: null,
        bookAgentList: [],
        loadList: [],
        customsBrokerList: [],
        convoyList: [],
        groundServiceList: [],
        overseaAgentList: [],
        portOfLoadList: [], // 装货港
        rcvPortList: [], // 收货地
        shippingAgentList: [], // 船代
        feeTypeList: [], // 费种
        shippCompanyList: [],
        orderStatusList: [],
        endStatusList: [],
        agreement: '',
        customerGroupList: [],
        transactionSourceCustomerList: [],
        canvasserList: [],
        reviewerList: [],
        serviceList: [],
        originatorList: []
      },
      searchFormSettings: {
        statisticalType: [
          {
            value: 0,
            label: '按客户统计'
          },
          {
            value: 1,
            label: '按订舱代理'
          },
          {
            value: 2,
            label: '按船东/航空公司统计'
          },
          {
            value: 3,
            label: '按场站统计'
          },
          {
            value: 4,
            label: '按车队统计'
          },
          {
            value: 5,
            label: '按销售统计'
          },
          {
            value: 6,
            label: '按操作统计'
          },
          {
            value: 7,
            label: '按部门统计',
            typeHide: 'container'
          },
          {
            value: 8,
            label: '按业务类型'
          },
          {
            value: 9,
            label: '按发票类型',
            typeHide: 'container'
          },
          {
            value: 10,
            label: '按约号统计'
          },
          {
            value: 11,
            label: '按客服统计'
          },
          {
            value: 12,
            label: '按商务统计'
          },
          {
            value: 13,
            label: '按来源客户统计'
          },
          {
            value: 14,
            label: '按费种统计',
            typeHide: 'container'
          },
          {
            value: 15,
            label: '按海外代理统计',
            typeHide: 'overseaAgent'
          }
        ],
        statisticalTypeObj: {
          0: '客户',
          1: '订舱代理',
          2: '船东/航空公司',
          3: '场站',
          4: '车队',
          5: '销售',
          6: '操作',
          7: '部门',
          8: '业务',
          9: '发票',
          10: '约号',
          11: '客服',
          12: '商务',
          13: '来源客户',
          14: '费种',
          15: '海外代理',
          16: '当前登录公司'
        },
        conditionTree: [
          {
            title: '账单审批状态',
            code: 'auditStatusList',
            expand: false,
            disabled: _this.type === 'container',
            disableCheckbox: _this.type === 'container',
            children: [
              {
                title: '未审核',
                code: 0,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '等待审核',
                code: 1,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '审核中',
                code: 2,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '审核完成',
                code: -1,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '已转账',
                code: -2,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '已驳回',
                code: -3,
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '部门',
            code: 'departmentList',
            expand: false,
            children: []
          },
          {
            title: '业务类型',
            code: 'businessTypeList',
            expand: false,
            children: []
          },
          {
            title: '服务项目',
            code: 'serviceItemList',
            expand: false,
            children: []
          },
          {
            title: '揽货类型',
            code: 'freightList',
            expand: false,
            children: []
          },
          {
            title: '贸易方式',
            code: 'tradeModeList',
            expand: false,
            children: []
          },
          {
            title: '付费方式',
            code: 'payList',
            expand: false,
            children: []
          },
          {
            title: '货物类型',
            code: 'goodsList',
            expand: false,
            children: []
          },
          {
            title: '订舱状态',
            code: 'orderStatusList',
            expand: false,
            children: [
              {
                title: '正常',
                code: 0,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '已退舱',
                code: 1,
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '完结状态',
            code: 'endStatusList',
            expand: false,
            children: [
              {
                title: '是',
                code: 1,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '否',
                code: 0,
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '主营业务类型',
            code: 'mainBusinessTypeList',
            expand: false,
            children: []
          },
          {
            title: '客户地区',
            code: 'customerAreaList',
            expand: false,
            children: [
              {
                title: '省内',
                code: 'province',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '省外',
                code: 'outside_province',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '国外',
                code: 'overseas',
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '内部往来',
            code: 'intercourseFlagList',
            expand: false,
            children: [
              {
                title: '无',
                code: '0',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '公司间往来',
                code: '1',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '公司内部部门间往来',
                code: '2',
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '业务来源',
            code: 'transactionSourceList',
            expand: false,
            children: [
              {
                title: '业务员',
                code: 1,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '海外代理',
                code: 2,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '公司',
                code: 3,
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '开票状态',
            code: 'billingStatusList',
            disabled: _this.type === 'profit' || _this.type === 'container',
            disableCheckbox: _this.type === 'profit' || _this.type === 'container',
            expand: false,
            children: [
              {
                title: '未开票',
                code: 0,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '部分开票',
                code: 1,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '全部开票',
                code: 2,
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '客户公司类型',
            code: 'companyTypeList',
            expand: false,
            children: [
              {
                title: '直客',
                code: 'zk',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '货代',
                code: 'hd',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '员工',
                code: 'yg',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '海外代理',
                code: 'hwdl',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '其他',
                code: 'qt',
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '协议客户',
            code: 'agreementFlagList',
            expand: false,
            disabled: _this.type === 'container',
            disableCheckbox: _this.type === 'container',
            children: [
              {
                title: '是',
                code: 'YJ',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '否',
                code: 'MD',
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '核销状态',
            code: 'writeOffStatusList',
            disabled: _this.type === 'container',
            disableCheckbox: _this.type === 'container',
            expand: false,
            children: [
              {
                title: '未核销',
                code: 0,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '部分核销',
                code: 1,
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '全部核销',
                code: 2,
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          },
          {
            title: '箱类型',
            code: 'boxFlagList',
            expand: false,
            disabled: _this.type !== 'container',
            disableCheckbox: _this.type !== 'container',
            children: [
              {
                title: '整柜',
                code: '1',
                expand: false,
                checked: true,
                disabled: false
              },
              {
                title: '拼箱',
                code: '2',
                expand: false,
                checked: true,
                disabled: false
              }
            ]
          }
        ],
        customerTableShow: true,
        descriptionTableShow: true,
        shippingLineTableShow: true,
        destPortTableShow: true,
        searchSchemeShow: false,
        searchSchemeModal: {
          name: '',
          show: false,
          type: 'new',
          id: null
        },
        searchSchemeId: '',
        searchSchemeObj: {},
        shippCompanyTableShow: true,
        bookAgentTableShow: true,
        loadTableShow: true,
        customsBrokerTableShow: true,
        convoyTableShow: true,
        groundServiceTableShow: true,
        overseaAgentTableShow: true,
        customerGroupTableShow: true,
        portOfLoadListTableShow: true,
        rcvPortListTableShow: true,
        shippingAgentListTableShow: true,
        feeTypeListTableShow: true,
        transactionSourceShow: true,
        canvasserTableShow: true,
        reviewerTableShow: true,
        serviceTableShow: true,
        originatorTableShow: true
      },
      portTypeFormat: {
        'PORTCD': '海港',
        'AIR_PORT': '空港'
      }
    //   statisticsDetailGroupByCustomer: config.statisticsDetailGroupByCustomer
    }
  },
  methods: {
    onTypeHide (item, type) {
      if (item.typeHide !== undefined) {
        if (typeof item.typeHide === 'string') {
          if (item.typeHide === type) {
            return false
          } else {
            return true
          }
        } else if (typeof item.typeHide === 'object' && typeof item.typeHide.length === 'number') {
          for (let index in item.typeHide) {
            if (item.typeHide[index] === type) {
              return false
            }
          }
        }
        return true
      } else if (item.typeShow !== undefined) {
        if (typeof item.typeShow === 'string') {
          if (item.typeShow === type) {
            return true
          } else {
            return false
          }
        } else if (typeof item.typeShow === 'object' && typeof item.typeShow.length === 'number') {
          for (let index in item.typeShow) {
            if (item.typeShow[index] === type) {
              return true
            }
          }
        }
        return false
      }
      return true
    },
    onCheck () {
      for (let index in this.searchFormSettings.conditionTree) {
        let item = this.searchFormSettings.conditionTree[index]
        let hasTrue = false
        for (let childIndex in item.children) {
          let childItem = item.children[childIndex]
          if (childItem.checked) {
            hasTrue = true
            break
          }
        }
        if (!hasTrue) {
          this.$Message.warning('统计条件中' + item.title + '至少选择一个！')
          return false
        }
      }
      return true
    },
    onSearchSchemeNew () {
      if (!this.onCheck()) {
        return false
      }
      this.searchFormSettings.searchSchemeModal.type = 'add'
      this.searchFormSettings.searchSchemeModal.name = ''
      this.searchFormSettings.searchSchemeModal.show = true
      this.searchFormSettings.searchSchemeModal.id = null
    },
    onSearchSchemeEdit () {
      if (!this.onCheck()) {
        return false
      }
      this.searchFormSettings.searchSchemeModal.type = 'update'
      this.searchFormSettings.searchSchemeModal.name = this.searchFormSettings.searchSchemeObj[this.searchFormSettings.searchSchemeId].settingsName
      this.searchFormSettings.searchSchemeModal.show = true
      this.searchFormSettings.searchSchemeModal.id = this.searchFormSettings.searchSchemeId
    },
    onSearchSchemeDel () {
    //   settingsApi.del(this.searchFormSettings.searchSchemeId).then(({ data }) => {
    //     if (data.returnCode === 200) {
    //       this.initSettings()
    //     } else {
    //       this.$Message.warning('数据异常,请重试！')
    //     }
    //   })
    },
    onSaveOk () {
      if (this.searchFormSettings.searchSchemeModal.name.trim() === '' || this.searchFormSettings.searchSchemeModal.name === null) {
        this.$Message.error('方案名称不能为空！')
        return
      }
      let searchForm = this.$util.copy(this.searchForm)
      let conditionTree = this.$util.copy(this.searchFormSettings.conditionTree)
      delete searchForm.startTime
      delete searchForm.endTime
      let searchBody = {
        searchForm,
        conditionTree
      }
      let body = {
        settingsClass: this.type + 'StatisticsSearch',
        settingsName: this.searchFormSettings.searchSchemeModal.name.trim(),
        settingsContent: JSON.stringify(searchBody)
      }
      if (this.searchFormSettings.searchSchemeModal.type === 'update') {
        body.id = this.searchFormSettings.searchSchemeModal.id
      }
    //   if (this.searchFormSettings.searchSchemeModal.type === 'add') {
    //     settingsApi.add(body).then(({ data }) => {
    //       if (data.returnCode === 200) {
    //         this.$Message.success('操作成功！')
    //         this.initSettings()
    //         this.searchFormSettings.searchSchemeModal.show = false
    //       } else {
    //         this.$Message.warning('数据异常,请重试！')
    //       }
    //     })
    //   } else {
    //     settingsApi.update(body).then(({ data }) => {
    //       if (data.returnCode === 200) {
    //         this.$Message.success('操作成功！')
    //         this.initSettings(body.id)
    //         this.searchFormSettings.searchSchemeModal.show = false
    //       } else {
    //         this.$Message.warning('数据异常,请重试！')
    //       }
    //     })
    //   }
    },
    onSaveCancel () {
      this.searchFormSettings.searchSchemeModal.show = false
    },
    onCustomerSelect (selected) {
      for (let index in this.searchForm.customerList) {
        let item = this.searchForm.customerList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.customerList.push({ id: selected.customerId, name: selected.customerName })
    },
    onCanvasserSelect (selected) {
      for (let index in this.searchForm.canvasserList) {
        let item = this.searchForm.canvasserList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.canvasserList.push({ id: selected.id, name: selected.realName })
    },
    onReviewerSelect (selected) {
      for (let index in this.searchForm.reviewerList) {
        let item = this.searchForm.reviewerList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.reviewerList.push({ id: selected.id, name: selected.realName })
    },
    onServiceSelect (selected) {
      for (let index in this.searchForm.serviceList) {
        let item = this.searchForm.serviceList[index]
        if (item.id === selected.id) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.serviceList.push({ id: selected.id, name: selected.realName })
    },
    onOriginatorSelect (selected) {
      for (let index in this.searchForm.originatorList) {
        let item = this.searchForm.originatorList[index]
        if (item.id === selected.id) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.originatorList.push({ id: selected.id, name: selected.realName })
    },
    onShippCompanySelect (selected) {
      for (let index in this.searchForm.shippCompanyList) {
        let item = this.searchForm.shippCompanyList[index]
        if (item.code === selected.code) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.shippCompanyList.push({ id: selected.customerId, code: selected.code, name: selected.chineseName })
    },
    onBookAgentSelect (selected) {
      for (let index in this.searchForm.bookAgentList) {
        let item = this.searchForm.bookAgentList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.bookAgentList.push({ id: selected.customerId, name: selected.customerName })
    },
    onConvoySelect (selected) {
      for (let index in this.searchForm.convoyList) {
        let item = this.searchForm.convoyList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.convoyList.push({ id: selected.customerId, name: selected.customerName })
    },
    onLoadSelect (selected) {
      for (let index in this.searchForm.loadList) {
        let item = this.searchForm.loadList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.loadList.push({ id: selected.customerId, name: selected.customerName })
    },
    onCustomsBrokerSelect (selected) {
      for (let index in this.searchForm.customsBrokerList) {
        let item = this.searchForm.customsBrokerList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.customsBrokerList.push({ id: selected.customerId, name: selected.customerName })
    },
    onGroundServiceSelect (selected) {
      for (let index in this.searchForm.groundServiceList) {
        let item = this.searchForm.groundServiceList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.groundServiceList.push({ id: selected.customerId, name: selected.customerName })
    },
    onOverseaAgentSelect (selected) {
      for (let index in this.searchForm.overseaAgentList) {
        let item = this.searchForm.overseaAgentList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.overseaAgentList.push({ id: selected.customerId, name: selected.customerName })
    },
    onCustomerGroupSelect (selected) {
      for (let index in this.searchForm.customerGroupList) {
        let item = this.searchForm.customerGroupList[index]
        if (item.id === selected.id) {
          this.$Message.warning('选择集团已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.customerGroupList.push({ id: selected.id, name: selected.groupName })
    },
    onTransactionSourceSelect (selected) {
      console.log('selected', selected)
      for (let index in this.searchForm.transactionSourceCustomerList) {
        let item = this.searchForm.transactionSourceCustomerList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.transactionSourceCustomerList.push({ id: selected.customerId, name: selected.customerName })
    },

    // 装货港 显示model
    onPortOfLoadListAdd () {
      this.showPortOfLoadModal = true
    },
    // 装货港 数据显示
    onPortOfLoadSelect (selected) {
      for (let index in this.searchForm.portOfLoadList) {
        let item = this.searchForm.portOfLoadList[index]
        if (item.code === selected.id) {
          this.$Message.warning('选择港口已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.portOfLoadList.push({ code: selected.id, name: selected.englishName, type: this.portTypeFormat[selected.codeType] })
    },
    // 装货港 删除
    onPortOfLoadListDel (item) {
      for (let index in this.searchForm.portOfLoadList) {
        if (this.searchForm.portOfLoadList[index].code === item.code) {
          this.searchForm.portOfLoadList.splice(index, 1)
          break
        }
      }
    },
    // 收货地 数据显示
    onRcvPortSelect (selected) {
      for (let index in this.searchForm.rcvPortList) {
        let item = this.searchForm.rcvPortList[index]
        if (item.code === selected.id) {
          this.$Message.warning('选择港口已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.rcvPortList.push({ code: selected.id, name: selected.englishName, type: this.portTypeFormat[selected.codeType] })
    },
    // 收货地 model
    onRcvPortListAdd () {
      this.showRcvPortModal = true
    },
    // 收货地 删除
    onRcvPortListDel (item) {
      for (let index in this.searchForm.rcvPortList) {
        if (this.searchForm.rcvPortList[index].code === item.code) {
          this.searchForm.rcvPortList.splice(index, 1)
          break
        }
      }
    },
    // 船代 model
    onShippingAgentListAdd () {
      this.showShippingAgentModel = true
    },
    // 船代 数据显示
    onShowShippingAgentModelSelect (selected) {
      for (let index in this.searchForm.shippingAgentList) {
        let item = this.searchForm.shippingAgentList[index]
        if (item.id === selected.customerId) {
          this.$Message.warning('选择客户已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.shippingAgentList.push({ id: selected.customerId, name: selected.customerName })
    },
    // 船代 删除
    onShippingAgentListDel (item) {
      for (let index in this.searchForm.shippingAgentList) {
        if (this.searchForm.shippingAgentList[index].id === item.id) {
          this.searchForm.shippingAgentList.splice(index, 1)
          break
        }
      }
    },
    // 费种 model
    onFeeTypeListAdd () {
      this.showFeeTypeListModel = true
    },
    // 费种 显示数据
    onShowFeeTypeSelect (selected) {
      for (let index in this.searchForm.feeTypeList) {
        let item = this.searchForm.feeTypeList[index]
        if (item.id === selected.id) {
          this.$Message.warning('选择费种已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.feeTypeList.push({ id: selected.id, name: selected.feeCh, businessType: this.getBusinessTypeName(selected.businessType) })
    },
    getBusinessTypeName (businessTypeCode) {
      let name = ''
      //   businessTypeNameList.forEach(item => {
      //     if (businessTypeCode === item.code) {
      //       name = item.name
      //     }
      //   })
      return name
    },
    // 费种删除
    onFeeTypeListDel (item) {
      for (let index in this.searchForm.feeTypeList) {
        if (this.searchForm.feeTypeList[index].id === item.id) {
          this.searchForm.feeTypeList.splice(index, 1)
          break
        }
      }
    },
    onShippingLineSelect (selected) {
      for (let index in this.searchForm.shippingLineList) {
        let item = this.searchForm.shippingLineList[index]
        if (item.code === selected.code) {
          this.$Message.warning('您选择的航线已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.shippingLineList.push({ code: selected.code, name: selected.chineseName })
    },
    onDestPortSelect (selected) { // 卸货港
      for (let index in this.searchForm.destPortList) {
        let item = this.searchForm.destPortList[index]
        if (item.code === selected.id) {
          this.$Message.warning('您选择的港口已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.destPortList.push({ code: selected.id, name: selected.englishName, type: this.portTypeFormat[selected.codeType] })
    },
    onCustomerListAdd () {
      this.showCustomerModal = true
    },
    onShippingLineAdd () {
      this.showShippingLineModal = true
    },
    onDestPortAdd () {
      this.showDestPortModal = true
    },
    onCustomerListDel (item) {
      for (let index in this.searchForm.customerList) {
        if (this.searchForm.customerList[index].id === item.id) {
          this.searchForm.customerList.splice(index, 1)
          break
        }
      }
    },
    onCanvasserListAdd () {
      this.showCanvasserModal = true
    },
    onCanvasserListDel (item) {
      for (let index in this.searchForm.canvasserList) {
        if (this.searchForm.canvasserList[index].id === item.id) {
          this.searchForm.canvasserList.splice(index, 1)
          break
        }
      }
    },
    onReviewerListAdd () {
      this.showReviewerModal = true
    },
    onReviewerListDel (item) {
      for (let index in this.searchForm.reviewerList) {
        if (this.searchForm.reviewerList[index].id === item.id) {
          this.searchForm.reviewerList.splice(index, 1)
          break
        }
      }
    },
    onServiceListAdd () {
      this.showServiceModal = true
    },
    onServiceListDel (item) {
      for (let index in this.searchForm.serviceList) {
        if (this.searchForm.serviceList[index].id === item.id) {
          this.searchForm.serviceList.splice(index, 1)
          break
        }
      }
    },
    onOriginatorListAdd () {
      this.showOriginatorModal = true
    },
    onOriginatorListDel (item) {
      for (let index in this.searchForm.originatorList) {
        if (this.searchForm.originatorList[index].id === item.id) {
          this.searchForm.originatorList.splice(index, 1)
          break
        }
      }
    },

    onShippingLineDel (item) {
      for (let index in this.searchForm.shippingLineList) {
        if (this.searchForm.shippingLineList[index].code === item.code) {
          this.searchForm.shippingLineList.splice(index, 1)
          break
        }
      }
    },
    onDestPortDel (item) { // 卸货港
      for (let index in this.searchForm.destPortList) {
        if (this.searchForm.destPortList[index].code === item.code) {
          this.searchForm.destPortList.splice(index, 1)
          break
        }
      }
    },
    onShippCompanyListAdd () {
      this.showShipCompanyModal = true
    },
    onShippCompanyListDel (item) {
      for (let index in this.searchForm.shippCompanyList) {
        if (this.searchForm.shippCompanyList[index].code === item.code) {
          this.searchForm.shippCompanyList.splice(index, 1)
          break
        }
      }
    },
    onBookAgentListAdd () {
      this.showBookAgentModal = true
    },
    onBookAgentListDel (item) {
      for (let index in this.searchForm.bookAgentList) {
        if (this.searchForm.bookAgentList[index].id === item.id) {
          this.searchForm.bookAgentList.splice(index, 1)
          break
        }
      }
    },
    onLoadListAdd () {
      this.showLoadModal = true
    },
    onLoadListDel (item) {
      for (let index in this.searchForm.loadList) {
        if (this.searchForm.loadList[index].id === item.id) {
          this.searchForm.loadList.splice(index, 1)
          break
        }
      }
    },
    onCustomsBrokerListAdd () {
      this.showCustomsBrokerModal = true
    },
    onCustomsBrokerListDel (item) {
      for (let index in this.searchForm.customsBrokerList) {
        if (this.searchForm.customsBrokerList[index].id === item.id) {
          this.searchForm.customsBrokerList.splice(index, 1)
          break
        }
      }
    },
    onConvoyListAdd () {
      this.showConvoyModal = true
    },
    onConvoyListDel (item) {
      for (let index in this.searchForm.convoyList) {
        if (this.searchForm.convoyList[index].id === item.id) {
          this.searchForm.convoyList.splice(index, 1)
          break
        }
      }
    },
    onGroundServiceListAdd () {
      this.showGroundServiceModal = true
    },
    onGroundServiceListDel (item) {
      for (let index in this.searchForm.groundServiceList) {
        if (this.searchForm.groundServiceList[index].id === item.id) {
          this.searchForm.groundServiceList.splice(index, 1)
          break
        }
      }
    },
    onOverseaAgentListAdd () {
      this.showOverseaAgentModal = true
    },
    onTransactionSourceListAdd () {
      this.showTransactionSourceModal = true
    },
    onTransactionSourceListDel (item) {
      for (let index in this.searchForm.transactionSourceCustomerList) {
        if (this.searchForm.transactionSourceCustomerList[index].id === item.id) {
          this.searchForm.transactionSourceCustomerList.splice(index, 1)
          break
        }
      }
    },
    onOverseaAgentListDel (item) {
      for (let index in this.searchForm.overseaAgentList) {
        if (this.searchForm.overseaAgentList[index].id === item.id) {
          this.searchForm.overseaAgentList.splice(index, 1)
          break
        }
      }
    },
    onCustomerGroupListDel (item) {
      for (let index in this.searchForm.customerGroupList) {
        if (this.searchForm.customerGroupList[index].id === item.id) {
          this.searchForm.customerGroupList.splice(index, 1)
          break
        }
      }
    },
    onSubmit () {
      if (this.searchForm.startTime === null || this.searchForm.startTime === '') {
        this.$Message.warning('开始日期不能为空！')
        return
      }
      if (this.searchForm.endTime === null && this.searchForm.endTime === '') {
        this.$Message.warning('结束日期不能为空！')
        return
      }
      if (this.searchForm.endTime < this.searchForm.startTime) {
        this.$Message.warning('结束日期必须在开始日期之后！')
        return
      }
      if (this.searchForm.startTime === null || this.searchForm.startTime === '') {
        this.$Message.warning('开始日期不能为空！')
        return
      }
      if (this.searchForm.endTime === null && this.searchForm.endTime === '') {
        this.$Message.warning('结束日期不能为空！')
        return
      }
      if (this.searchForm.endTime < this.searchForm.startTime) {
        this.$Message.warning('结束日期必须在开始日期之后！')
        return
      }
      if (!this.onCheck()) {
        return false
      }
      let searchForm = this.$util.copy(this.searchForm)
      if (searchForm.startTime !== null && searchForm.startTime !== '') {
        searchForm.startDate = this.$util.timestampToDate(searchForm.startTime.getTime())
        searchForm.startTime = this.$util.timestampToDateTime(searchForm.startTime.getTime())
      } else {
        searchForm.startTime = null
      }
      if (searchForm.endTime !== null && searchForm.endTime !== '') {
        searchForm.endDate = this.$util.timestampToDate(searchForm.endTime.getTime() + 24 * 60 * 60 * 1000 - 1)
        searchForm.endTime = this.$util.timestampToDateTime(searchForm.endTime.getTime() + 24 * 60 * 60 * 1000)
      } else {
        searchForm.endTime = null
      }
      searchForm.conditionTree = this.$util.copy(this.searchFormSettings.conditionTree)
      if (searchForm.statisticalType === 1) { // 去除按订舱代理统计-仁川航空选项
        searchForm.conditionTree[2].children[0].checked = false
        searchForm.conditionTree[2].children[1].checked = false
      }
      this.$emit('on-search', searchForm, this.searchFormSettings)
    },
    initSettings (id) {
      this.searchFormSettings.searchSchemeObj = {}
    //   settingsApi.selectByName({ settingsClass: this.type + 'StatisticsSearch' }).then(({ data }) => {
    //     if (data.returnCode === 200) {
    //       this.searchFormSettings.searchSchemeId = (id !== undefined ? id : null)
    //       let searchSchemeObj = {}
    //       data.returnData.forEach(item => {
    //         searchSchemeObj[item.id] = item
    //       })
    //       this.searchFormSettings.searchSchemeObj = searchSchemeObj
    //     } else {
    //       this.$Message.warning('数据异常,请重试！')
    //     }
    //   })
    },
    onCustomerGroupListAdd () {
      this.showCustomerGroupModal = true
    },
    setRenchuanDisabled (status) {
      this.searchFormSettings.conditionTree[2].checked = false
      this.searchFormSettings.conditionTree[2].children.forEach(item => {
        if (item.code === '05' || item.code === '06') {
          item.disabled = status
          item.checked = !status
        }
      })
    },
    setCangchuDisabled (status) {
      this.searchFormSettings.conditionTree[2].checked = false
      this.searchFormSettings.conditionTree[2].children.forEach(item => {
        if (item.code === '07') {
          item.disabled = status
          item.checked = !status
        }
      })
    },
    onStatisticalType (val) {
      switch (val) {
        case 1: // 订舱代理
          this.setRenchuanDisabled(true)
          this.setCangchuDisabled(true)
          break
        case 2: // 船东/航空公司
          this.setRenchuanDisabled(false)
          this.setCangchuDisabled(true)
          break
        case 3: // 场站
          this.setRenchuanDisabled(true)
          this.setCangchuDisabled(false)
          break
        case 4: // 车队
          this.setRenchuanDisabled(true)
          this.setCangchuDisabled(false)
          break
        case 10: // 约号
          this.setRenchuanDisabled(true)
          this.setCangchuDisabled(true)
          break
        case 11: // 客服
          this.setRenchuanDisabled(true)
          this.setCangchuDisabled(true)
          break
        case 12: // 商务
          this.setRenchuanDisabled(false)
          this.setCangchuDisabled(false)
          break
        case 13: // 来源客户
          this.setRenchuanDisabled(false)
          this.setCangchuDisabled(true)
          break
        case 15: // 海外代理
          this.setRenchuanDisabled(true)
          this.setCangchuDisabled(true)
          break
        default:
          this.setRenchuanDisabled(false)
          this.setCangchuDisabled(false)
          break
      }
    }
  },
  created () {
    this.equalAccountHide = !((this.type !== 'arrears' && this.type !== 'unpaid'))
    // if (this.type === 'arrears' && this.statisticsDetailGroupByCustomer) {
    //   this.searchFormSettings.statisticalType.push({
    //     value: 16,
    //     label: '按当前公司统计'
    //   })
    // }
    // api.getCurrentCompanyAllDepartment().then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.departname,
    //         code: item.id,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     this.searchFormSettings.conditionTree[1].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    let data = [
      {
        title: '海运出口',
        code: '01',
        expand: false,
        checked: true,
        disabled: false
      },
      {
        title: '海运进口',
        code: '02',
        expand: false,
        checked: true,
        disabled: false
      }
    ]
    // let list = []
    // list = list.concat(data)
    // api.businessObtain().then(response => {
    //   if (response.data.returnCode === 200) {
    //     let list = []
    //     let businessObtainList = response.data.returnData
    //     businessObtainList.forEach(item => {
    //       if (item === 'HD') {
    //         let data = [
    //           {
    //             title: '海运出口',
    //             code: '01',
    //             expand: false,
    //             checked: true,
    //             disabled: false
    //           },
    //           {
    //             title: '海运进口',
    //             code: '02',
    //             expand: false,
    //             checked: true,
    //             disabled: false
    //           }
    //         ]
    //         if (this.type !== 'container') {
    //           data = data.concat([
    //             {
    //               title: '空运出口',
    //               code: '03',
    //               expand: false,
    //               checked: true,
    //               disabled: false
    //             },
    //             {
    //               title: '空运进口',
    //               code: '04',
    //               expand: false,
    //               checked: true,
    //               disabled: false
    //             }
    //           ])
    //         }
    //         list = list.concat(data)
    //       } else if (item === 'KY') {
    //         let data = [
    //           {
    //             title: '仁川空运出口',
    //             code: '05',
    //             expand: false,
    //             checked: true,
    //             disabled: false
    //           },
    //           {
    //             title: '仁川空运进口',
    //             code: '06',
    //             expand: false,
    //             checked: true,
    //             disabled: false
    //           }
    //         ]
    //         if (this.type !== 'container') {
    //           list = list.concat(data)
    //         }
    //       } else if (item === 'WMS') {
    //         let data = [
    //           {
    //             title: '仓储管理',
    //             code: '07',
    //             expand: false,
    //             checked: true,
    //             disabled: false
    //           }
    //         ]
    //         if (this.type !== 'container') {
    //           list = list.concat(data)
    //         }
    //       }
    //     })
    //     loggerD(list)
    //     this.searchFormSettings.conditionTree[2].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    // 服务项目
    // codeApi.selectAllBusinessCode({ codeType: 'SERVICE_PROJECT' }).then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.chineseName,
    //         code: item.code,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     this.searchFormSettings.conditionTree[3].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    // // 揽货类型
    // codeApi.selectAllBusinessCode({ codeType: 'FREIGHT_TYPE' }).then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.chineseName,
    //         code: item.code,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     this.searchFormSettings.conditionTree[4].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    // // 贸易方式
    // codeApi.selectAllBusinessCode({ codeType: 'TRADE_MODE' }).then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.chineseName,
    //         code: item.code,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     this.searchFormSettings.conditionTree[5].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    // // 付费方式
    // codeApi.selectAllBusinessCode({ codeType: 'PAY_TYPE' }).then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.chineseName,
    //         code: item.code,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     this.searchFormSettings.conditionTree[6].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    // // 货物类型
    // codeApi.selectAllBusinessCode({ codeType: 'GOODS_TYPE' }).then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.chineseName,
    //         code: item.code,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     this.searchFormSettings.conditionTree[7].children = list
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    // // 主营业务类型
    // codeApi.selectAllBusinessCode({ codeType: 'MAIN_BUSINESS_TYPE' }).then(({ data }) => {
    //   if (data.returnCode === 200) {
    //     let list = []
    //     data.returnData.forEach(item => {
    //       let map = {
    //         title: item.chineseName,
    //         code: item.code,
    //         expand: false,
    //         checked: true,
    //         disabled: false
    //       }
    //       list.push(map)
    //     })
    //     let _this = this
    //     this.searchFormSettings.conditionTree.forEach(function (currentValue, index, arr) {
    //       if (currentValue.title === '主营业务类型') {
    //         _this.searchFormSettings.conditionTree[index].children = list
    //       }
    //     })
    //   } else {
    //     this.$Message.warning('数据异常,请重试！')
    //   }
    // })
    this.initSettings()
  },
  watch: {
    'searchFormSettings.searchSchemeId': {
      handler: function (val) {
        if (val === '' || val === null) {
          this.searchForm = this.$util.copy(this.searchFormBase)
          for (let index in this.searchFormSettings.conditionTree) {
            this.searchFormSettings.conditionTree[index].children.forEach(item => {
              item.checked = true
            })
          }
        } else {
          let searchObj = JSON.parse(this.searchFormSettings.searchSchemeObj[val].settingsContent)
          searchObj.searchForm['startTime'] = this.searchForm.startTime
          searchObj.searchForm['endTime'] = this.searchForm.endTime
          this.searchForm = searchObj.searchForm
          this.searchFormSettings.conditionTree = searchObj.conditionTree
        }
      },
      deep: true
    }
  }
}
</script>
