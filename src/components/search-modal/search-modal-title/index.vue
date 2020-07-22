<style lang="less" scoped>
    .content-title{
        display: inline-block;
        vertical-align: top;
        height: 24px;
        box-sizing: border-box;
        span{
            padding: 0 5px;
            line-height: 24px;
        }
        i{
            margin-right: 5px;
        }
    }
</style>
<template>
    <div class="content-title" :style="{width: `${width}px`}">
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script>
export default {
  name: 'search-modal-title',
  props: {
    width: {
      type: Number,
      default: 100
    }
  }
}
</script>
