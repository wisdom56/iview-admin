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
            title="选择港口"
            @on-ok="onOk"
            @on-cancel="onCancel"
            :width="800"
            class="modal-class"
            :style="{zIndex: 1050, position: 'absolute'}">
        <Row>
            <i-col span="8">
                <Form :label-width="70">
                    <FormItem label="港口选择">
                        <Input size="small" v-model="keywords" type="text" placeholder="请输入字段内容" clearable @on-enter="onTabClick"></Input>
                    </FormItem>
                </Form>
            </i-col>
            <i-col span="1" class="i-col-middle"><Button type="primary" size="small" icon="ios-search" @click="onTabClick"></Button></i-col>
        </Row>
        <Row>
            <Tabs type="card" size="small" @on-click="onTabClick">
                <TabPane label="海运港口" >
                    <port-list ref="port_cd" codeType="PORTCD" @on-select-change="currentChange" @on-db-select="onRowDblClick" :search-key="keywords" ></port-list>
                </TabPane>
                <TabPane label="空运港口" >
                    <port-list  ref="air_port" codeType="AIR_PORT" @on-select-change="currentChange" @on-db-select="onRowDblClick" :search-key="keywords" ></port-list>
                </TabPane>
            </Tabs>
        </Row>
        <div slot="footer">
            <Button @click="onCancel" size="small" type="text">退出</Button>
            <Button @click="onOk" size="small" type="primary" :disabled="selected === null">保存</Button>
        </div>
    </Modal>
</template>
<script>
// import businessObtainApi from '@/api/statistics/billStatistics';
import portList from './list'
export default {
  name: 'customer-group',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    portList
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
      this.keywords = ''
      this.onTabClick()
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
      this.$nextTick(() => {
        this.$refs.port_cd.initGridData()
        this.$refs.air_port.initGridData()
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
