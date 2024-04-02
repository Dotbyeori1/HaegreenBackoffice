<template>
  <BackFragments>
    <template v-slot:backHeader></template>
    <template v-slot:backContent></template>
  </BackFragments>

</template>

<script>
import BackFragments from "@/components/Layout/BackFragments.vue";

export default {
  name : "BackLayout",
  components : {BackFragments}
}
</script>

<style scoped>

</style>