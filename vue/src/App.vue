<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "./sass/commont.scss";
  @import "./sass/custom.scss";
  #app{
    width: 100%;
    height: 100%;
  }
</style>
