<template>
    <div class="my-footer">
      <div class="footer_box">
        <p>Powered by vue | Designed by chengll</p>
        <p>Copyright© 2009-2018 程路路-路无止境</p>
        <p></p>
      </div>
    </div>
</template>

<script>
  export default {
    name: "my-footer"
  }
</script>

<style lang="scss" scoped>
  .my-footer{
    height: 200px;
    /*padding: 50px 20px;*/
    background: #000;
    margin-top: 50px;
    .footer_box{
      padding-top: 50px;
    }
    p{
      margin: 5px 0;
      color: #f5f5f5;
      text-align: center;
    }
  }
</style>
