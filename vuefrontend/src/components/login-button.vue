<template>
  <button
    type="button"
    id="customBtn"
    @click="signin()"
    class="z-depth-1 btn waves-effect waves-light mx-auto"
  >
    <i class="fab fa-google"></i>
    &nbsp;{{loggedin ? "Logout" : "Login"}}
  </button>
</template>

<script>
export default {
  props: ['loggedin'],
  data: {
  }
};
</script>

<style>
</style>