<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">Help center</div>
    <div class="pad_4">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="How do i need to join？" name="1">
          Participating in non-destructive and non-guaranteed liquidity mining requires payment of ETH miner fees to receive the replacement gold coupons, and the ETH wallet address only needs to be claimed once. Automatically open mining permissions
          after success.
        </van-collapse-item>
        <van-collapse-item title="How do i withdraw money？" name="2">
          You can convert the currency generated every day into USDT, and then initiate a withdrawal. USDT withdrawals will be automatically sent to the wallet address you added to the node, other addresses are not supported.
        </van-collapse-item>
        <van-collapse-item title="How to calculate income？" name="3"> When you join successfully, the smart contract starts to calculate your address through the node and start to calculate the revenue. </van-collapse-item>
        <van-collapse-item title="What is revenue？" name="4">
          <p>The yield below1000USDT≈0.5%~0.6%,</p>
          <p>1000USDT-5000USDT≈1.6%~2.0%,</p>
          <p>5000USDT-20000USDT yield≈1.8%~2.2%,</p>
          <p>20000USDT-50000USDT yield≈2.2%~2.6%,</p>
          <p>50000USDT-200000USDT yield≈2.6%~3.0%,</p>
          <p>and above 200000USDT yield Rate≈2.8%~3.5%</p>
        </van-collapse-item>
        <van-collapse-item title="What are the extra gains？" name="5"> You can share our page to a friend, if he joins, you can get 10% of his income as a bonus,your sharing link is on the top left corner of the homepage to get. </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
const activeNames = ref('1');
onMounted(() => {});
</script>

<style scoped></style>
