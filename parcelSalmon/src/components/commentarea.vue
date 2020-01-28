<template>
  <input class="commentArea" placeholder="Comment" @keyup.enter="submitcomment()" v-model="comment"></input>
</template>

<script>
export default {
  props: ["userdata", "classidx", "precomment"],
  data() {
    return {
      comment: this.precomment
    }
  },
  methods: {
    submitcomment() {
      console.log("COMMENTAREA submitted")
      this.addComment(this.userdata, this.classidx, this.comment)

    }
  }
};
</script>

<style lang="scss" scoped>
.commentArea {
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