<template>
  <div class="sidebar col-sm-12 col-xl-8 z-depth-2">
    <div class="row vertical-center">
      <login-button :loggedin="loggedin"/>
    </div>
  </div>
</template>

<script>
import loginButton from './login-button.vue'

export default {
  props: ['loggedin'],
  components: {
    'login-button': loginButton,
  }
};
</script>

<style>
</style>