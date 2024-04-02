<template>
  <router-view></router-view>
</template>

<script>
import {useUserStore} from './store/UserStore'
import {onMounted} from "vue";

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore();

    onMounted(async () => {

      if (localStorage.getItem('token')) {
        await userStore.localStorageAuthenticatedRequest();
      } else if (sessionStorage.getItem('token')) {
        await userStore.sessionStorageUserAuthenticated();
      }
    });

  }
}
</script>

<style>
@media (max-width: 995px) {
  div, div *:not(h1):not(h2):not(h3):not(i):not(footer):not(.footer *):not(a) {
    font-size: 1rem;
  }
}
</style>