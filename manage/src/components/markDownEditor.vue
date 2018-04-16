<template>
    <div class="mark-down-editor">
      <div id="editor">
        <mavon-editor style="height: 100%"></mavon-editor>
      </div>
    </div>
</template>
<script>
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  export default {
    name: "mark-down-editor",
    components: {
      mavonEditor
    },
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
  .mark-down-editor{
    #editor {
      margin: auto;
      height: 580px;
    }
  }
</style>
