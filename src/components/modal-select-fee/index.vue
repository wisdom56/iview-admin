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
            title="选择费种"
            @on-ok="onOk"
            @on-cancel="onCancel"
            :width="800"
            class="modal-class"
            :style="{zIndex: 1050, position: 'absolute'}">
        <Row>
            <i-col span="8">
                <Form :label-width="70">
                    <FormItem label="费用查询">
                        <Input size="small" v-model="keywords" type="text" placeholder="请输入字段内容" clearable @on-enter="onTabClick"></Input>
                    </FormItem>
                </Form>
            </i-col>
            <i-col span="1" class="i-col-middle"><Button type="primary" size="small" icon="ios-search" @click="onTabClick"></Button></i-col>
        </Row>
        <Row>
            <Tabs type="card" size="small" @on-click="onTabClick">
                <TabPane label="货代费种" v-if ="businessObtainList.indexOf('HD') >= 0">
                    <fee-list ref="hdFee" businessType="HD" @on-select-change="currentChange" @on-db-select="onRowDblClick" :search-key="keywords" ></fee-list>
                </TabPane>
                <TabPane label="空运费种" v-if ="businessObtainList.indexOf('KY') >= 0">
                    <fee-list ref="kyFee" businessType="KY" @on-select-change="currentChange" @on-db-select="onRowDblClick" :search-key="keywords" ></fee-list>
                </TabPane>
                <TabPane label="仓储费种" v-if ="businessObtainList.indexOf('WMS') >= 0">
                    <fee-list ref="wmsFee" businessType="WMS" @on-select-change="currentChange" @on-db-select="onRowDblClick" :search-key="keywords" ></fee-list>
                </TabPane>
            </Tabs>
        </Row>
        <div slot="footer">
            <Button @click="onCancel" size="small" type="text">取消</Button>
            <Button @click="onOk" size="small" type="primary" :disabled="selected === null">确定</Button>
        </div>
    </Modal>
</template>
<script>
// import businessObtainApi from '@/api/statistics/billStatistics';
import feeList from './list'
export default {
  name: 'customer-group',
  props: {
    tableHeight: {
      type: String,
      default: 'calc(100vh - 200px)'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    feeList
  },
  data () {
    return {
      keywords: '',
      selected: null,
      businessObtainList: []
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
      // businessObtainApi.businessObtain().then(response => {
      //     if (response.data.returnCode === 200) {
      //         this.businessObtainList = response.data.returnData;
      //     }
      // });
    },
    onRowDblClick (row) {
      this.$emit('on-select', row)
      this.$emit('update:show', false)
    },
    currentChange (val) {
      this.selected = val
      this.$emit('on-select-change', val)
    },
    onTabClick () {
      let _this = this
      this.businessObtainList.forEach(x => {
        if (x === 'HD') {
          _this.$refs.hdFee.initGridData()
        }
        if (x === 'KY') {
          _this.$refs.kyFee.initGridData()
        }
        if (x === 'WMS') {
          _this.$refs.wmsFee.initGridData()
        }
      })
    }
  },
  created () {
    this.init()
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.init()
      }
    }
  }
}
</script>
