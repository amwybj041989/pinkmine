<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.auditReport') }}</div>
    <div class="fontSize_14 sub-title-color text_center mb_15">{{ t('text.auditReportSub') }}</div>
    <div class="pad_4">
      <div class="flex flex_wrap justify_sb">
        <div class="audit_item audit_bg1"></div>
        <div class="audit_item audit_bg2"></div>
        <div class="audit_item audit_bg3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { onMounted } from 'vue';
const activeNames = ref('1');
onMounted(() => {});
</script>

<style scoped>
.audit_item {
  width: 100px;
  height: 36px;
  background-size: cover;
}
.audit_bg1 {
  background-image: url('@/assets/images/audit/audit1.png');
}
.audit_bg2 {
  background-image: url('@/assets/images/audit/audit2.png');
}
.audit_bg3 {
  background-image: url('@/assets/images/audit/audit3.png');
}
</style>
