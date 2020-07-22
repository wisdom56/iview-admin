<template>
    <div v-loading="currentLoading">
        <div class="pl-8 flex pt-10">
            <div class="flex-auto font-bold lh-small">统计查询</div>
            <div class="flex-none">
                <Button size="small" type="primary" @click="onSubmit">查询</Button>
            </div>
        </div>
        <div class="split-line"></div>
        <Form :label-width="70">
            <FormItem label="查询方案:">
                <div class="flex mt-5 mb-5">
                        <Select v-model="searchFormSettings.searchSchemeId" size="small" class="flex-auto" clearable style="width:100%">
                            <Option v-for="item in searchFormSettings.searchSchemeObj" :value="item.id" :key="item.id">{{ item.settingsName }}</Option>
                        </Select>
                        <Button size="small" class="flex-none btn-square" :type="searchFormSettings.searchSchemeShow?'primary':'ghost'" @click.natvie="searchFormSettings.searchSchemeShow=!searchFormSettings.searchSchemeShow"><i class="iconfont icon-shezhi1"></i></Button>
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
                    <Button @click="onSaveCancel" size="small" type="text">{{$t('i.modal.cancelText')}}</Button>
                    <Button @click="onSaveOk" size="small" type="primary">{{$t('i.modal.okText')}}</Button>
                </div>
            </Modal>
        </div>
        <div class="split-line"></div>
        <Form :model="searchForm" :label-width="80">
            <FormItem label="报表类型:">
                <RadioGroup v-model="searchForm.intervalType">
                    <Radio label="week">周报</Radio>
                    <Radio label="month">月报</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="周起始日:" v-if="searchForm.intervalType == 'week'">
                <Select v-model="searchForm.weekStartDay" style="width:70px" size="small">
                    <Option v-for="item in searchFormSettings.weekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span>-</span>
                <span>{{onWeekCalc(searchForm.weekStartDay)}}</span>
            </FormItem>

            <FormItem label="统计日期:">
                <RadioGroup v-model="searchForm.statisticalDateType">
                    <Radio :label="0">业务日期</Radio>
                    <Radio :label="1" :disabled="type=='container'?true:false">财务日期</Radio>
                </RadioGroup>
            </FormItem>
            <div class="split-line"></div>
            <FormItem label="统计条件:">
            </FormItem>
            <Tree :data="searchFormSettings.conditionTree" show-checkbox></Tree>
            <FormItem label="筛选客户:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.customerList.length == 0 ? '全部客户':'部分客户'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onCustomerListAdd()">
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            label="航线"
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
            <FormItem label="筛卸货港:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.destPortList.length == 0 ? '全部港口':'部分港口'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onDestPortAdd()">
                            <Icon type="plus"></Icon>
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
            <FormItem label="船公司:">
                <div class="flex">
                    <div class="flex-auto">{{searchForm.shippCompanyList.length == 0 ? '全部船公司':'部分船公司'}}</div>
                    <div class="flex-none">
                        <Button size="small" class="btn-square" type="primary" @click="onShippCompanyListAdd()">
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            <Icon type="plus"></Icon>
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
                            <Button @click="onOverseaAgentListDel(scope.row)" type="text" size="small">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </Form>
        <modal-select-customer :show.sync="showCustomerModal" @on-select="onCustomerSelect"></modal-select-customer>
        <modal-business-code :show.sync="showShippingLineModal" @on-select="onShippingLineSelect" business-type="SHIP_ROUTE"></modal-business-code>
        <modal-business-code :show.sync="showDestPortModal" @on-select="onDestPortSelect" business-type="PORTCD"></modal-business-code>
        <modal-shipp-company :show.sync="showShippCompanyModal" @on-select="onShippCompanySelect"></modal-shipp-company>
        <select-customer :show.sync="showBookAgentModal" @on-select="onBookAgentSelect" customerProperty="b"></select-customer>
        <select-customer :show.sync="showConvoyModal" @on-select="onConvoySelect" customerProperty="d"></select-customer>
        <select-customer :show.sync="showLoadModal" @on-select="onLoadSelect" customerProperty="c"></select-customer>
        <select-customer :show.sync="showCustomsBrokerModal" @on-select="onCustomsBrokerSelect" customerProperty="h"></select-customer>
        <select-customer :show.sync="showGroundServiceModal" @on-select="onGroundServiceSelect" customerProperty="k"></select-customer>
        <select-customer :show.sync="showOverseaAgentModal" @on-select="onOverseaAgentSelect" customerProperty="f"></select-customer>
    </div>
</template>

<script>
import codeApi from '@/api/codec/business_code'
import api from '@/api/statistics/billStatistics'
import settingsApi from '@/api/setting/userDefinedSettings'
import ModalBusinessCode from '@/components/modal/modal-business-code/index'
import ModalSelectCustomer from '@/components/modal/modal-select-customer/index'
import SelectCustomer from '@/components/modal/modal-select-customer/customerIndex'
import ModalShippCompany from '@/components/modal/modal-shipp-company/index'
export default {
  name: 'sales-statistics-search-info',
  components: { ModalBusinessCode, ModalSelectCustomer, SelectCustomer, ModalShippCompany },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: null
    },
    setSearchForm: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      currentLoading: false,
      showCustomerModal: false,
      showShippingLineModal: false,
      showDestPortModal: false,
      showShippCompanyModal: false,
      showBookAgentModal: false,
      showConvoyModal: false,
      showLoadModal: false,
      showCustomsBrokerModal: false,
      showGroundServiceModal: false,
      showOverseaAgentModal: false,
      searchFormBase: {
        intervalType: 'week',
        weekStartDay: '1',
        statisticalDateType: 0,
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
        shippCompanyList: null,
        bookAgentList: null,
        loadList: null,
        customsBrokerList: null,
        convoyList: null,
        groundServiceList: null,
        overseaAgentList: null,
        bookAgentList: [],
        loadList: [],
        customsBrokerList: [],
        convoyList: [],
        groundServiceList: [],
        overseaAgentList: [],
        shippCompanyList: []
      },
      searchForm: {
        intervalType: 'week',
        weekStartDay: '1',
        statisticalDateType: 0,
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
        shippCompanyList: []
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
            label: '按船东统计'
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
            label: '按销售统计',
            typeHide: 'container'
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
          }
        ],
        statisticalTypeObj: {
          0: '客户',
          1: '订舱代理',
          2: '船东',
          3: '场站',
          4: '车队',
          5: '销售',
          6: '操作',
          7: '部门',
          8: '业务',
          9: '发票'
        },
        conditionTree: [
          {
            title: '审批状态',
            expand: false,
            children: [
              {
                title: '未审核',
                code: 0,
                expand: false,
                checked: true
              },
              {
                title: '待审批',
                code: 1,
                expand: false,
                checked: true
              },
              {
                title: '已审批未转账',
                code: -1,
                expand: false,
                checked: true
              },
              {
                title: '已转账',
                code: -2,
                expand: false,
                checked: true
              }
            ]
          },
          {
            title: '部门',
            expand: false,
            children: []
          },
          {
            title: '业务类型',
            expand: false,
            children: []
          },
          {
            title: '服务项目',
            expand: false,
            children: []
          },
          {
            title: '揽货类型',
            expand: false,
            children: []
          },
          {
            title: '贸易方式',
            expand: false,
            children: []
          },
          {
            title: '付费方式',
            expand: false,
            children: []
          },
          {
            title: '货物类型',
            expand: false,
            children: []
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
        weekList: [
          {
            label: '周一',
            value: '2'
          },
          {
            label: '周二',
            value: '3'
          },
          {
            label: '周三',
            value: '4'
          },
          {
            label: '周四',
            value: '5'
          },
          {
            label: '周五',
            value: '6'
          },
          {
            label: '周六',
            value: '7'
          },
          {
            label: '周日',
            value: '1'
          }
        ]
      }
    }
  },
  methods: {
    onWeekCalc (day) {
      switch (day) {
        case '3':
          return '下周一'
        case '4':
          return '下周二'
        case '5':
          return '下周三'
        case '6':
          return '下周四'
        case '7':
          return '下周五'
        case '1':
          return '下周六'
        case '2':
          return '周日'
      }
    },
    onCheck () {
      let status = this.formatData()
      if (status === 'auditStatus') {
        this.$Message.warning('统计条件中审核状态至少选择一个！')
      } else if (status === 'department') {
        this.$Message.warning('统计条件中部门至少选择一个！')
      } else if (status === 'businessType') {
        this.$Message.warning('统计条件中业务类型至少选择一个！')
      } else if (status === 'serviceItem') {
        this.$Message.warning('统计条件中服务项目至少选择一个！')
      } else if (status === 'freight') {
        this.$Message.warning('统计条件中揽货类型至少选择一个！')
      } else if (status === 'tradeMode') {
        this.$Message.warning('统计条件中贸易方式至少选择一个！')
      } else if (status === 'pay') {
        this.$Message.warning('统计条件中付费方式至少选择一个！')
      } else if (status === 'goods') {
        this.$Message.warning('统计条件中货物类型至少选择一个！')
      }
    },
    onSearchSchemeNew () {
      this.onCheck()
      this.searchFormSettings.searchSchemeModal.type = 'add'
      this.searchFormSettings.searchSchemeModal.name = ''
      this.searchFormSettings.searchSchemeModal.show = true
      this.searchFormSettings.searchSchemeModal.id = null
    },
    onSearchSchemeEdit () {
      this.onCheck()
      this.searchFormSettings.searchSchemeModal.type = 'update'
      this.searchFormSettings.searchSchemeModal.name = this.searchFormSettings.searchSchemeObj[this.searchFormSettings.searchSchemeId].settingsName
      this.searchFormSettings.searchSchemeModal.show = true
      this.searchFormSettings.searchSchemeModal.id = this.searchFormSettings.searchSchemeId
    },
    onSearchSchemeDel () {
      settingsApi.del(this.searchFormSettings.searchSchemeId).then(({ data }) => {
        if (data.returnCode === 200) {
          this.initSettings()
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
    },
    onSaveOk () {
      if (this.searchFormSettings.searchSchemeModal.name.trim() === '' || this.searchFormSettings.searchSchemeModal.name === null) {
        this.$Message.error('方案名称不能为空！')
        return
      }
      let searchForm = this.$util.copy(this.searchForm)
      delete searchForm.startTime
      delete searchForm.endTime
      let body = {
        settingsClass: this.type + 'StatisticsSearch',
        settingsName: this.searchFormSettings.searchSchemeModal.name,
        settingsContent: JSON.stringify(searchForm)
      }
      if (this.searchFormSettings.searchSchemeModal.type === 'update') {
        body.id = this.searchFormSettings.searchSchemeModal.id
      }
      if (this.searchFormSettings.searchSchemeModal.type === 'add') {
        settingsApi.add(body).then(({ data }) => {
          if (data.returnCode === 200) {
            this.$Message.success('操作成功！')
            this.initSettings()
            this.searchFormSettings.searchSchemeModal.show = false
          } else {
            this.$Message.warning('数据异常,请重试！')
          }
        })
      } else {
        settingsApi.update(body).then(({ data }) => {
          if (data.returnCode === 200) {
            this.$Message.success('操作成功！')
            this.initSettings(body.id)
            this.searchFormSettings.searchSchemeModal.show = false
          } else {
            this.$Message.warning('数据异常,请重试！')
          }
        })
      }
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
    onShippCompanySelect (selected) {
      for (let index in this.searchForm.shippCompanyList) {
        let item = this.searchForm.shippCompanyList[index]
        if (item.id === selected.customerId) {
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
    onDestPortSelect (selected) {
      for (let index in this.searchForm.destPortList) {
        let item = this.searchForm.destPortList[index]
        if (item.code === selected.code) {
          this.$Message.warning('您选择的港口已存在于筛选列表中!')
          return
        }
      }
      this.searchForm.destPortList.push({ code: selected.code, name: selected.englishName })
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
    onShippingLineDel (item) {
      for (let index in this.searchForm.shippingLineList) {
        if (this.searchForm.shippingLineList[index].id === item.id) {
          this.searchForm.shippingLineList.splice(index, 1)
          break
        }
      }
    },
    onShippingLineDel (item) {
      for (let index in this.searchForm.shippingLineList) {
        if (this.searchForm.shippingLineList[index].id === item.id) {
          this.searchForm.shippingLineList.splice(index, 1)
          break
        }
      }
    },
    onDestPortDel (item) {
      for (let index in this.searchForm.destPortList) {
        if (this.searchForm.destPortList[index].id === item.id) {
          this.searchForm.destPortList.splice(index, 1)
          break
        }
      }
    },
    onShippCompanyListAdd () {
      this.showShippCompanyModal = true
    },
    onShippCompanyListDel (item) {
      for (let index in this.searchForm.shippCompanyList) {
        if (this.searchForm.shippCompanyList[index].id === item.id) {
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
    onOverseaAgentListDel (item) {
      for (let index in this.searchForm.overseaAgentList) {
        if (this.searchForm.overseaAgentList[index].id === item.id) {
          this.searchForm.overseaAgentList.splice(index, 1)
          break
        }
      }
    },
    formatData () {
      let auditStatusList = []
      let departmentList = []
      let businessTypeList = []
      let serviceItemList = []
      let freightList = []
      let payList = []
      let tradeModeList = []
      let goodsList = []
      let auditStatusAllTrue = true
      let departmentAllTrue = true
      let businessTypeAllTrue = true
      let serviceItemAllTrue = true
      let freightAllTrue = true
      let payAllTrue = true
      let tradeModeAllTrue = true
      let goodsAllTrue = true
      this.searchFormSettings.conditionTree[0].children.forEach(item => {
        if (item.checked) {
          auditStatusList.push(item.code)
        } else {
          auditStatusAllTrue = false
        }
      })
      if (!auditStatusAllTrue) {
        if (auditStatusList.length === 0) {
          return 'auditStatus'
        } else if (auditStatusList.length > 0) {
          this.searchForm.auditStatusList = auditStatusList
        } else {
          this.searchForm.auditStatusList = null
        }
      } else {
        this.searchForm.auditStatusList = null
      }
      this.searchFormSettings.conditionTree[1].children.forEach(item => {
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
          this.searchForm.departmentList = departmentList
        } else {
          this.searchForm.departmentList = null
        }
      } else {
        this.searchForm.departmentList = null
      }
      this.searchFormSettings.conditionTree[2].children.forEach(item => {
        if (item.checked) {
          businessTypeList.push(item.code)
        } else {
          businessTypeAllTrue = false
        }
      })
      if (!businessTypeAllTrue) {
        if (businessTypeList.length === 0) {
          return 'businessType'
        } else if (businessTypeList.length > 0) {
          this.searchForm.businessTypeList = businessTypeList
        } else {
          this.searchForm.businessTypeList = null
        }
      } else {
        this.searchForm.businessTypeList = null
      }
      this.searchFormSettings.conditionTree[3].children.forEach(item => {
        if (item.checked) {
          serviceItemList.push(item.code)
        } else {
          serviceItemAllTrue = false
        }
      })
      if (!serviceItemAllTrue) {
        if (serviceItemList.length === 0) {
          return 'serviceItem'
        } else if (serviceItemList.length > 0) {
          this.searchForm.serviceItemList = serviceItemList
        } else {
          this.searchForm.serviceItemList = null
        }
      } else {
        this.searchForm.serviceItemList = null
      }
      // 揽货类型
      this.searchFormSettings.conditionTree[4].children.forEach(item => {
        if (item.checked) {
          freightList.push(item.code)
        } else {
          freightAllTrue = false
        }
      })
      if (!freightAllTrue) {
        if (freightList.length === 0) {
          return 'freight'
        } else if (freightList.length > 0) {
          this.searchForm.freightList = freightList
        } else {
          this.searchForm.freightList = null
        }
      } else {
        this.searchForm.freightList = null
      }
      // 贸易方式
      this.searchFormSettings.conditionTree[5].children.forEach(item => {
        if (item.checked) {
          tradeModeList.push(item.code)
        } else {
          tradeModeAllTrue = false
        }
      })
      if (!tradeModeAllTrue) {
        if (tradeModeList.length === 0) {
          return 'tradeMode'
        } else if (tradeModeList.length > 0) {
          this.searchForm.tradeModeList = tradeModeList
        } else {
          this.searchForm.tradeModeList = null
        }
      } else {
        this.searchForm.tradeModeList = null
      }
      // 付费方式
      this.searchFormSettings.conditionTree[6].children.forEach(item => {
        if (item.checked) {
          payList.push(item.code)
        } else {
          payAllTrue = false
        }
      })
      if (!payAllTrue) {
        if (payList.length === 0) {
          return 'pay'
        } else if (payList.length > 0) {
          this.searchForm.payList = payList
        } else {
          this.searchForm.payList = null
        }
      } else {
        this.searchForm.payList = null
      }
      // 货物类型
      this.searchFormSettings.conditionTree[7].children.forEach(item => {
        if (item.checked) {
          goodsList.push(item.code)
        } else {
          goodsAllTrue = false
        }
      })
      if (!goodsAllTrue) {
        if (goodsList.length === 0) {
          return 'goods'
        } else if (goodsList.length > 0) {
          this.searchForm.goodsList = goodsList
        } else {
          this.searchForm.goodsList = null
        }
      } else {
        this.searchForm.goodsList = null
      }
    },
    onSubmit () {
      let status = this.formatData()
      if (status === 'auditStatus') {
        this.$Message.warning('统计条件中审核状态至少选择一个！')
        return
      } else if (status === 'department') {
        this.$Message.warning('统计条件中部门至少选择一个！')
        return
      } else if (status === 'businessType') {
        this.$Message.warning('统计条件中业务类型至少选择一个！')
        return
      } else if (status === 'serviceItem') {
        this.$Message.warning('统计条件中服务项目至少选择一个！')
        return
      } else if (status === 'freight') {
        this.$Message.warning('统计条件中揽货类型至少选择一个！')
        return
      } else if (status === 'tradeMode') {
        this.$Message.warning('统计条件中贸易方式至少选择一个！')
        return
      } else if (status === 'pay') {
        this.$Message.warning('统计条件中付费方式至少选择一个！')
        return
      } else if (status === 'goods') {
        this.$Message.warning('统计条件中货物类型至少选择一个！')
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
      let searchForm = this.$util.copy(this.searchForm)
      this.$emit('on-search', searchForm, this.searchFormSettings)
    },
    initSettings (id) {
      this.searchFormSettings.searchSchemeObj = {}
      settingsApi.selectByName({ settingsClass: this.type + 'StatisticsSearch' }).then(({ data }) => {
        if (data.returnCode === 200) {
          this.searchFormSettings.searchSchemeId = (id !== undefined ? id : null)
          let searchSchemeObj = {}
          data.returnData.forEach(item => {
            searchSchemeObj[item.id] = item
          })
          this.searchFormSettings.searchSchemeObj = searchSchemeObj
        } else {
          this.$Message.warning('数据异常,请重试！')
        }
      })
    }
  },
  created () {
    this.searchForm = this.setSearchForm
    api.getMyDepartment().then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.departname,
            code: item.id,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[1].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    codeApi.selectAllBusinessCode({ codeType: 'BUSINESS_TYPE' }).then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.chineseName,
            code: item.code,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[2].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    // 服务项目
    codeApi.selectAllBusinessCode({ codeType: 'SERVICE_PROJECT' }).then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.chineseName,
            code: item.code,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[3].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    // 揽货类型
    codeApi.selectAllBusinessCode({ codeType: 'FREIGHT_TYPE' }).then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.chineseName,
            code: item.code,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[4].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    // 贸易方式
    codeApi.selectAllBusinessCode({ codeType: 'TRADE_MODE' }).then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.chineseName,
            code: item.code,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[5].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    // 付费方式
    codeApi.selectAllBusinessCode({ codeType: 'PAY_TYPE' }).then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.chineseName,
            code: item.code,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[6].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    // 货物类型
    codeApi.selectAllBusinessCode({ codeType: 'GOODS_TYPE' }).then(({ data }) => {
      if (data.returnCode === 200) {
        let list = []
        data.returnData.forEach(item => {
          let map = {
            title: item.chineseName,
            code: item.code,
            expand: false,
            checked: true
          }
          list.push(map)
        })
        this.searchFormSettings.conditionTree[7].children = list
      } else {
        this.$Message.warning('数据异常,请重试！')
      }
    })
    this.initSettings()
  },
  watch: {
    loading (val) {
      this.currentLoading = val
    },
    currentLoading (val) {
      this.$emit('update:loading', val)
    },
    setSearchForm: {
      handler: function (val) {
        this.searchForm = val
      },
      deep: true
    },
    'searchFormSettings.searchSchemeId': {
      handler: function (val) {
        if (val === '' || val === null) {
          this.searchForm = this.$util.copy(this.searchFormBase)
          this.searchFormSettings.conditionTree[0].children.forEach(item => {
            item.checked = true
          })
          this.searchFormSettings.conditionTree[1].children.forEach(item => {
            item.checked = true
          })
          this.searchFormSettings.conditionTree[2].children.forEach(item => {
            item.checked = true
          })
          this.searchFormSettings.conditionTree[3].children.forEach(item => {
            item.checked = true
          })
          this.searchFormSettings.conditionTree[4].children.forEach(item => {
            item.checked = true
          })
          this.searchFormSettings.conditionTree[5].children.forEach(item => {
            item.checked = true
          })
          this.searchFormSettings.conditionTree[6].children.forEach(item => {
            item.checked = true
          })
        } else {
          Object.assign(this.searchForm, JSON.parse(this.searchFormSettings.searchSchemeObj[val].settingsContent))
          let auditStatusList = this.searchForm.auditStatusList
          let departmentList = this.searchForm.departmentList
          let businessTypeList = this.searchForm.businessTypeList
          let serviceItemList = this.searchForm.serviceItemList
          let freightList = this.searchForm.freightList
          let tradeModeList = this.searchForm.tradeModeList
          let payList = this.searchForm.payList
          let goodsList = this.searchForm.goodsList
          if (auditStatusList != null) {
            this.searchFormSettings.conditionTree[0].checked = false
            this.searchFormSettings.conditionTree[0].children.forEach(item => {
              item.checked = false
              for (let index in auditStatusList) {
                if (auditStatusList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[0].checked = true
          }
          if (departmentList != null) {
            this.searchFormSettings.conditionTree[1].checked = false
            this.searchFormSettings.conditionTree[1].children.forEach(item => {
              item.checked = false
              for (let index in departmentList) {
                if (departmentList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[1].checked = true
          }
          if (businessTypeList != null) {
            this.searchFormSettings.conditionTree[2].checked = false
            this.searchFormSettings.conditionTree[2].children.forEach(item => {
              item.checked = false
              for (let index in businessTypeList) {
                if (businessTypeList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[2].checked = true
          }
          if (serviceItemList != null) {
            this.searchFormSettings.conditionTree[3].checked = false
            this.searchFormSettings.conditionTree[3].children.forEach(item => {
              item.checked = false
              for (let index in serviceItemList) {
                if (serviceItemList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[3].checked = true
          }
          if (freightList != null) {
            this.searchFormSettings.conditionTree[4].checked = false
            this.searchFormSettings.conditionTree[4].children.forEach(item => {
              item.checked = false
              for (let index in freightList) {
                if (freightList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[4].checked = true
          }
          if (tradeModeList != null) {
            this.searchFormSettings.conditionTree[5].checked = false
            this.searchFormSettings.conditionTree[5].children.forEach(item => {
              item.checked = false
              for (let index in tradeModeList) {
                if (tradeModeList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[5].checked = true
          }
          if (payList != null) {
            this.searchFormSettings.conditionTree[6].checked = false
            this.searchFormSettings.conditionTree[6].children.forEach(item => {
              item.checked = false
              for (let index in payList) {
                if (payList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[6].checked = true
          }
          if (goodsList != null) {
            this.searchFormSettings.conditionTree[7].checked = false
            this.searchFormSettings.conditionTree[7].children.forEach(item => {
              item.checked = false
              for (let index in goodsList) {
                if (goodsList[index] == item.code) {
                  item.checked = true
                  break
                }
              }
            })
          } else {
            this.searchFormSettings.conditionTree[7].checked = true
          }
        }
        if (this.type == 'container') {
          this.searchForm.statisticalDateType = 0
        }
        if (this.type != 'arrears' || this.type != 'unpaid') {
          this.searchForm.agingHide = true
        }
      },
      deep: true
    }
  }
}
</script>
