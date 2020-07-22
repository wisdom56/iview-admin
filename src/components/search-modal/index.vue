<style lang="less" scoped>
    .info-box {
        position: absolute;
        transform: translateX(~"calc(-100% - 10px)");
        z-index: 1000;
    }
    .search-box {
        position: absolute;
        right: 0px;
        z-index: 1000;
    }
    .left-collapse-btn {
        display: block;
        z-index: 1001;
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
        opacity: .7;
        &:hover {
            border-left: 20px solid #f0f0f0;
            opacity: 1;
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
        z-index: 999;
        top: 50%;
        margin-top: -25px;
        right: 0;
        left: auto;
        border-bottom: 9px solid transparent;
        border-left: none;
        border-right: 18px solid #f0f0f0;
        border-top: 9px solid transparent;
        width: 0;
        height: 50px;
        position: absolute;
        transition: border-right .1s;
        cursor: pointer;
        &:hover {
            border-right: 25px solid #f0f0f0;
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
    .search-content {
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        border-color: #eee;
        background: #fff;
        border-radius: 4px;
        font-size: 14px;
        position: relative;
        z-index: 1000;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
</style>
<style>
    .search-modal-box {
        height: calc(100% - 34px);
        overflow: auto;
    }
    .search-box-enter-active, .search-box-leave-active {
        transition: transform .5s;
    }
    .search-box-enter, .search-box-leave-to {
        transform: translateX(0px) !important;
    }
</style>
<template>
        <div class="search-box" :style="{height: modalHeight}">
            <div class="right-collapse-btn" v-if="!show" @click.stop="onShow">
                <div class="sign-style">
                    <i class="iconfont icon-sousuo"></i>
                </div>
            </div>
            <transition name="search-box">
                <div class="info-box" v-if="show" :style="{width: `${width}px`, height: modalHeight, marginTop: `${top}px`, marginLeft: `${-right}px`}">
                    <div class="left-collapse-btn" @click.stop="onHide">
                        <div class="sign-style">
                            <i class="iconfont icon-zhankai"></i>
                        </div>
                    </div>
                    <div class="search-content" :style="{width: `${width}px`}" v-clickoutside="onHide">
                        <slot></slot>
                    </div>
                </div>
            </transition>
        </div>
</template>
<script>
export default {
  name: 'search-modal',
  data () {
    return {
      modalShow: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 200
    },
    modalHeight: {
      type: String,
      default: 'calc(100vh - 92px)'
    },
    right: {
      type: Number,
      default: 1
    },
    top: {
      type: Number,
      default: 1
    }
  },
  methods: {
    onHide () {
      this.$emit('update:show', false)
    },
    onShow () {
      this.$emit('update:show', true)
    }
  }
}
</script>
