<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">partner</div>
    <div class="fontSize_14 sub-title-color text_center mb_15">our business partner</div>
    <div class="pad_4">
      <div class="flex flex_wrap justify_sb">
        <div class="audit_item audit_bg1"></div>
        <div class="audit_item audit_bg2"></div>
        <div class="audit_item audit_bg3"></div>
        <div class="audit_item audit_bg4"></div>
        <div class="audit_item audit_bg5"></div>
        <div class="audit_item"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
const activeNames = ref('1');
onMounted(() => {});
</script>

<style scoped>
.audit_item {
  width: 100px;
  height: 36px;
  background-size: cover;
  /* margin-top: calc(var(--base) * 12); */
}
.audit_item:not(:nth-child(-n + 3)) {
  margin-top: calc(var(--base) * 12);
}
.audit_bg1 {
  background-image: url('@/assets/images/partner/partner1.png');
}
.audit_bg2 {
  background-image: url('@/assets/images/partner/partner2.png');
}
.audit_bg3 {
  background-image: url('@/assets/images/partner/partner3.png');
}
.audit_bg4 {
  background-image: url('@/assets/images/partner/partner4.png');
}
.audit_bg5 {
  background-image: url('@/assets/images/partner/partner5.png');
}
</style>
