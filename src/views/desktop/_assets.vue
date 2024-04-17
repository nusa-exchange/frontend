<template>
  <z-content class="page-assets">
    <div class="container">
      <ul class="assets-menu">
        <router-link
          tag="li"
          to="balance"
          :class="{ selected: $route.path === '/assets/balance' }"
        >
          Balance
        </router-link>
        <router-link
          tag="li"
          to="history"
          :class="{ selected: $route.path === '/assets/history' }"
        >
          History
        </router-link>
      </ul>
      <router-view />
    </div>
  </z-content>
</template>
