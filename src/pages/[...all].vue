<script setup lang="ts">
const router = useRouter();

function onBack() {
  if (window.history.state.back)
    // history.back()
    router.replace('/');
  else router.replace('/');
}
onMounted(() => {
  onBack();
});
</script>

<template>
  <div class="padding"></div>
  <div text="center gray-300 dark:gray-200 18">
    <div class="loader"></div>
    <!-- <van-icon name="warn-o" size="3em" />
    <div>Not found</div>

    <div class="mt-10">
      <button van-haptics-feedback btn m="3 t8" @click="onBack">Back</button>
    </div> -->
  </div>
</template>

<route lang="json">
{
  "name": "404",
  "meta": {
    "title": "404",
    "i18n": "menus.404Demo"
  }
}
</route>
<style scoped>
.padding {
  width: 100%;
  height: 35vh;
}
.loader {
  width: fit-content;
  margin: 0 auto;
  font-size: 40px;
  line-height: 1.5;
  font-family: system-ui, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  color: #0000;
  -webkit-text-stroke: 1px #000;
  background: radial-gradient(1.13em at 50% 1.6em, #000 99%, #0000 101%) calc(50% - 1.6em) 0/3.2em 100% text, radial-gradient(1.13em at 50% -0.8em, #0000 99%, #000 101%) 50% 0.8em/3.2em 100% repeat-x text;
  animation: l9 2s linear infinite;
}
.loader:before {
  content: 'Loading';
}
@keyframes l9 {
  to {
    background-position: calc(50% + 1.6em) 0, calc(50% + 3.2em) 0.8em;
  }
}
</style>
