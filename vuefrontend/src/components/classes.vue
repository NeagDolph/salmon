<template>
  <div data-simplebar data-simplebar-auto-hide="false">
    <div class="card col-12">
      <div v-for="stat in classes()" v-bind:key="stat.name" :class="{greenclass: !stat.status}" class="redclass-item card mx-auto">
        <div class="title" :style="titleSize(stat)">{{stat.name}}</div>
        <span class="subtext">Missing</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['classlist'],
  methods: {
    classes(e) {
      let formatted = {
        red: this.$props.classlist.filter(el => {
          return el.status
        }),
        green: this.$props.classlist.filter(el => {
          return !el.status
        })
      }

      return [...formatted.red, ...formatted.green]
    },
    titleSize() {
      return 'font-size: 30px;'
    }
  }
};
</script>

<style>
</style>