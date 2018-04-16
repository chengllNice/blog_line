<template>
    <div class="my-header">
      <Header :style="{padding: 0}" class="layout-header-bar">
        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
      </Header>
    </div>
</template>

<script>
  export default {
    name: "my-header",
    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      }
    },
    methods: {
      collapsedSider () {
        // this.$refs.side1.toggleCollapse();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
