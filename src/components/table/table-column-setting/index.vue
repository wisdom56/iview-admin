<style scoped>
    .iview-admin-draggable-list{
        height: 100%;
    }
    .iview-admin-draggable-list li{
        padding: 9px;
        border: 1px solid #e7ebee;
        border-radius: 3px;
        margin-bottom: 5px;
        cursor: pointer;
        position: relative;
        transition: all .2s;
    }
    .iview-admin-draggable-list li:hover{
        color: #87b4ee;
        border-color: #87b4ee;
        transition: all .2s;
    }
    .iview-admin-draggable-delete{
        height: 100%;
        position: absolute;
        right: -8px;
        top: 0px;
        display: none;
    }
    .iview-admin-draggable-list li:hover .iview-admin-draggable-delete{
        display: block;
    }
    .placeholder-style{
        display: block !important;
        color: transparent;
        border-style: dashed !important;
    }
    .delte-item-animation{
        opacity: 0;
        transition: all .2s;
    }
    .iview-admin-draggable-list{
        overflow: auto
    }
    .drag-item {
        vertical-align: top;
        display: inline-block;
    }
</style>
<style lang="less">
    .table-poptip {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 3;
        .ivu-poptip-body-content{
            overflow: hidden;
            .ivu-icon-help-circled {
                left: 16px;
            }
        }
    }
</style>
<template>
    <Poptip style="position: absolute;right: 10px;bottom: 10px;" class="table-poptip" placement="bottom-end" v-model="visible">
        <div slot="title">
            <i>表格设置</i>
        </div>
        <div slot="content" style="height: 390px;width: 300px;">
            <div style="height: 350px;width: 300px;">
                <draggable class="iview-admin-draggable-list" v-model="currentData" :options="options">
                    <li v-for="(item, index) in currentData" :key="index" class="notwrap todolist-item lh-small">
                        <div class="pr-10 drag-item overflow-ellipsis" style="width: 115px;">{{ (index+1) + '. ' + item.title}}</div>
                        <div class="pr-10 drag-item" style="width: 90px;">
                            <span>宽度:</span>
                            <InputNumber v-model="item.width" size="small" :max="1000" :min="60" :step="10" class="mr-10" style="width: 55px;"></InputNumber>
                        </div>
                        <div class="drag-item" style="width: 45px;"><Checkbox v-model="item.visible">显示</Checkbox></div>
                    </li>
                </draggable>
            </div>
            <Row class="mt-10 align-right">
                    <Poptip
                            confirm
                            placement="bottom-end"
                            title="您确认重置表格设置？"
                            transfer
                            @on-ok="onOk"
                            @on-cancel="onCancel">
                        <Button size="small" class="mr-5" type="ghost">重置</Button>
                    </Poptip>
                    <Button size="small" type="primary" @click="onSave()">保存</Button>
            </Row>
        </div>
        <Button size="small" type="ghost" class="btn-square"><i class="iconfont icon-shezhi1"></i></Button>
    </Poptip>
</template>
<script>
import draggable from 'vuedraggable'
import api from '@/api/setting/tableColumns'
import { mapActions } from 'vuex'
export default {
  name: 'table-options',
  components: { draggable },
  props: {
    data: {
      type: Array,
      default: null
    },
    defaultData: {
      type: Array,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    canSaveAll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentData: this.data,
      options: {
        group: {
          name: 'list',
          pull: true
        },
        animation: 120,
        ghostClass: 'placeholder-style',
        fallbackClass: 'iview-admin-cloned-item'
      },
      visible: false
    }
  },
  methods: {
    ...mapActions('sysSettings', ['getAllTableColumnSetting']),
    onOk () {
      let body = []
      let _this = this
      this.defaultData.forEach((item, index) => {
        let data = {}
        data.columnName = item.key
        data.columnSort = index + 1
        data.tableName = this.name
        data.columnWidth = item.width
        data.columnVisible = item.visible ? 1 : 0
        data.columnsSettings = 'temp'
        data.defaultFlag = 1
        body.push(data)
      })
      api.saveTableColumnSetting(body).then(({ data }) => {
        if (data.returnCode === 200) {
          _this.currentData = []
          _this.$nextTick(() => {
            _this.currentData = this.defaultData
            _this.$emit('update:data', _this.$util.copy(this.defaultData))
            _this.$Message.success('重置成功!')
            _this.getAllTableColumnSetting()
          })
        }
      }).catch(error => {
        loggerE(error)
      })
    },
    onCancel () {
    },
    onSave () {
      let body = []
      let _this = this
      this.currentData.forEach((item, index) => {
        let data = {}
        data.columnName = item.key
        data.columnSort = index + 1
        data.tableName = this.name
        data.columnsSettings = 'temp'
        data.columnWidth = item.width
        data.columnVisible = item.visible ? 1 : 0
        data.defaultFlag = 1
        body.push(data)
      })
      api.saveTableColumnSetting(body).then(({ data }) => {
        if (data.returnCode === 200) {
          _this.$Message.success('保存成功!')
          _this.getAllTableColumnSetting()
        }
      }).catch(error => {
        loggerE(error)
      })
    }
  },
  watch: {
    data: {
      handler (val) {
        this.currentData = val
      },
      deep: true
    },
    currentData: {
      handler (val) {
        this.$emit('update:data', val)
      },
      deep: true
    }
  }
}
</script>
