<style lang="less" scoped>
    .flex-layout {
        display: flex;
        position: relative;
        height: calc(~"100vh - 70px");
        width: 100%;
        overflow: hidden;
    }

    .left-menu {
        flex: none;
        position: relative;
        box-sizing: border-box;
        transition: width .5s;
        height: 100%;
        overflow: hidden;
    }

    .right-content {
        flex: auto;
        overflow-y: auto;
        overflow-x: hidden;
        //background:url(../../styles/content-bg.png) no-repeat center center;
    }

    .left-collapse-btn {
        display: block;
        z-index: 1000;
        top: 50%;
        margin-top: -25px;
        left: 0;
        right: auto;
        border-bottom: 9px solid transparent;
        border-right: none;
        border-left: 13px solid #f0f0f0;
        border-top: 9px solid transparent;
        width: 0;
        height: 50px;
        position: absolute;
        transition: border-left .1s;
        cursor: pointer;
        &:hover {
            border-left: 20px solid #f0f0f0;
        }
        text-align: center;
        font-size: 13px;
        .sign-style {
            position: absolute;
            top: 5px;
            width: 13px;
            text-align: center;
            overflow: hidden;
            right: 0;
        }
    }

    .right-collapse-btn {
        z-index: 1000;
        top: 50%;
        margin-top: -25px;
        right: 0;
        left: auto;
        border-bottom: 9px solid transparent;
        border-left: none;
        border-right: 13px solid #f0f0f0;
        border-top: 9px solid transparent;
        width: 0;
        height: 50px;
        position: absolute;
        transition: border-right .1s;
        cursor: pointer;
        &:hover {
            border-right: 20px solid #f0f0f0;
        }
        text-align: center;
        font-size: 13px;
        .sign-style {
            position: absolute;
            top: 5px;
            width: 13px;
            text-align: center;
            overflow: hidden;
            left: 0;
        }
    }
</style>
<style lang="less">
    .left-menu .ivu-menu {
        height: 100%;
    }

    .menu-tab {
        position: absolute;
        bottom: 9px;
        padding: 5px;
    }

    .tabs {
        width: 31.5%;
        display: inline-block;
        border-bottom: 2px solid #e0e0e0;
        text-align: center;
        padding-bottom: 5px;
        cursor: pointer;
        transition: all .8s;
    }

    .tab-active {
        color: #2b85e4;
        border-bottom: 2px solid #2b85e4;
    }
</style>
<template>
    <div class="flex-layout" :style="{height: height}">
        <div class="left-collapse-btn" v-show="!menuShow" @click="menuShow=true">
            <div class="sign-style">
                <i class="iconfont icon-zhankai"></i>
            </div>
        </div>
        <div class="left-menu" :style="{width: menuShow?`${menuWidth}px`:'0'}" style="background-color: white">
            <div class="right-collapse-btn" v-show="menuShow" @click="menuShow=false">
                <div class="sign-style">
                    <i class="iconfont icon-shouqi"></i>
                </div>
            </div>
            <div class="left-menu-scrollbar" :style="{width: `${menuWidth}px`}">
                <div :style="{width: `${menuWidth}px`}" class="menu-tab" v-if="menuTab">
                    <div class="tabs" @click="activeTab='menu1'" :class="activeTab=='menu1'? 'tab-active' : ''">&nbsp;</div>
                    <div class="tabs" @click="activeTab='menu'" :class="activeTab=='menu'? 'tab-active': ''">业务</div>
                    <div class="tabs"  @click="activeTab='menu2'" :class="activeTab=='menu2'? 'tab-active' : ''">&nbsp;</div>
                </div>
                <div v-if="activeTab=='menu'">
                    <slot name="menu"></slot>
                </div>
                <!--<div v-if="activeTab=='menu1'">-->
                    <!--<slot name="menu1"></slot>-->
                <!--</div>-->

                <!--<div v-if="activeTab=='menu2'">-->
                    <!--<slot name="menu2"></slot>-->
                <!--</div>-->
            </div>
        </div>
        <div class="right-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script>
export default {
  name: 'menu-content-layout',
  data () {
    return {
      menuShow: true,
      activeTab: 'menu'
    }
  },
  props: {
    menuWidth: {
      Number,
      default: 160
    },
    menuTab: {
      Boolean,
      default: true
    },
    height: {
      type: [String, Number],
      default: null
    }
  }
}
</script>
