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
                    <Button size="small" type="primary" @click="onSaveAll()" v-if="$auth.check('form_settings') && canSaveAll">保存全部</Button>
                    <Button size="small" type="primary" @click="onSave()">保存</Button>
            </Row>
        </div>
        <Button size="small" type="ghost" class="btn-square"><i class="iconfont icon-shezhi1"></i></Button>
    </Poptip>
</template>
<script>
import draggable from 'vuedraggable'
// import api from '@/api/setting/tableColumns'
export default {
  name: 'table-options',
  components: { draggable },
  props: {
    baseData: {
      type: Array,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    columnWidthObj: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
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
    onOk () {
    //   let body = {
    //     tableName: this.name
    //   }
    //   let _this = this
    //   api.delColumnsSettings(body).then(({ data }) => {
    //     if (data.returnCode === 200) {
    //       _this.currentData = []
    //       _this.$nextTick(() => {
    //         _this.currentData = this.baseData
    //         _this.$emit('update:data', _this.$util.copy(this.baseData))
    //         _this.$Message.success('重置成功!')
    //       })
    //     } else {
    //       _this.$Message.warning('数据异常,请重试！')
    //     }
    //   }).catch(error => {
    //     window.loggerD(error)
    //     this.$Message.warning('数据异常,请重试！')
    //   })
    },
    onCancel () {

    },
    onSave () {
    //   let body = {
    //     tableName: this.name,
    //     columnsSettings: JSON.stringify(this.currentData)
    //   }
    //   let _this = this
    //   api.saveColumnsSettings(body).then(({ data }) => {
    //     if (data.returnCode === 200) {
    //       _this.$Message.success('保存成功!')
    //       _this.visible = false
    //     } else {
    //       _this.$Message.warning('数据异常,请重试！')
    //     }
    //   }).catch(error => {
    //     window.loggerD(error)
    //     _this.$Message.warning('数据异常,请重试！')
    //   })
    },
    onSaveAll () {
    //   let body = {
    //     tableColumnsSettingsDto: {
    //       tableName: this.name,
    //       columnsSettings: JSON.stringify(this.currentData)
    //     },
    //     dutyType: this.type
    //   }
    //   let _this = this
    //   api.saveAllUserColumnsSettings(body).then(({ data }) => {
    //     if (data.returnCode === 200) {
    //       _this.$Message.success('保存成功!')
    //       _this.visible = false
    //     } else {
    //       _this.$Message.warning('数据异常,请重试！')
    //     }
    //   }).catch(error => {
    //     window.loggerD(error)
    //     _this.$Message.warning('数据异常,请重试！')
    //   })
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
    },
    columnWidthObj: {
      handler (val) {
        for (let index in this.currentData) {
          if (this.currentData[index].key === val.property) {
            this.currentData[index].width = val.width
            break
          }
        }
      },
      deep: true
    }
  }
}
</script>
