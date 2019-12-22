<template>
  <textarea placeholder="Comment" @submit="addcomment()" v-model="comment"></textarea>
</template>

<script>
export default {
  props: ["userdata", "classindex"],
  data() {
    return {
      comment: ""
    }
  },
  methods: {
    addcomment() {
      this.addComment(userdata, classindex, comment)
    }
  }
};
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  padding: 6px 6px;
  height: 60px;
  outline: none;
  border-radius: 10px;
  border: solid 2px #5e7085;
  resize: none;
  transition: 0.5s;
  &:focus {
    box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, 0.14),
      0px 0px 10px 0 rgba(0, 0, 0, 0.12), 0px 0px 4px -1px rgba(0, 0, 0, 0.4);
  }
}
</style>