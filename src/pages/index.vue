<template>
  <HeaderBar></HeaderBar>
  <div class="vuemarquee_padding"></div>
  <div class="pad_12">
    <div class="mb_15" v-if="userStore.hasAuth != 2">
      <auth></auth>
    </div>
    <div class="mb_15">
      <indexTabs></indexTabs>
    </div>

    <div class="mb_15">
      <mining></mining>
    </div>
    <div class="mb_15">
      <Qa></Qa>
    </div>
    <!-- <div class="mb_15">
      <helpCenter></helpCenter>
    </div> -->
    <div class="mb_15">
      <auditReport></auditReport>
    </div>
    <div class="">
      <partner></partner>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import indexTabs from '@/components/Index/indexTabs.vue';
import mining from '@/components/Index/mining.vue';
import auth from '@/components/Index/auth.vue';
// import minintForm from '@/components/Index/minintForm.vue';
import helpCenter from '@/components/Index/helpCenter.vue';
import Qa from '@/components/Index/Qa.vue';
import auditReport from '@/components/Index/auditReport.vue';
import partner from '@/components/Index/partner.vue';
import useAppStore from '@/stores/modules/app';
import { languageColumns, locale } from '@/utils/i18n';
import { Auth } from '@/utils/api/index';
import { useUserStore } from '@/stores/modules';
const userStore = useUserStore();
const appStore = useAppStore();
const checked = ref<boolean>(false);
function fetchAuth() {
  Auth().then((res) => {
    console.log('Auth', res);
  });
}
onMounted(() => {
  // fetchAuth()
});
</script>

<style scoped></style>
