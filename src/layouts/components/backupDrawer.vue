<script setup>
import upgradeBannerDark from '@/assets/images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@/assets/images/pro/upgrade-banner-light.png'
import logo from '@/assets/logo.png'
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})
</script>

<template>
  <!-- 👉 Nav header -->
  <div class="nav-header pa-4 pe-1">
    <RouterLink
      to="/"
      class="app-logo d-flex align-center gap-x-3 app-title-wrapper"
    >
      <!-- ℹ️ You can also use img tag or VImg here -->
      <div v-html="logo" />

      <Transition name="vertical-nav-app-title">
        <h1 class="font-weight-semibold leading-normal text-xl text-uppercase">
         Retail
        </h1>
      </Transition>
    </RouterLink>
  </div>

  <!-- 👉 Nav items -->
  <ul>
    <VerticalNavLink
      :item="{
        title: 'dashboard',
        to: 'index',
        icon: { icon: 'mdi-home-outline' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Account Settings',
        to: 'account-settings',
        icon: { icon: 'mdi-account-cog-outline' }
      }"
    />
    <!-- 👉 Pages -->
    <VerticalNavSectionTitle :item="{ heading: 'Users Management' }" />
    <VerticalNavLink
      :item="{
        title: 'users',
        to: 'users',
        icon: { icon: 'mdi-people' },
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Register',
        to: 'register',
        target: '_blank',
        icon: { icon: 'mdi-account-plus-outline' }
      }"
    />

    

    <!-- 👉 Employee Interface -->
    <VerticalNavSectionTitle :item="{ heading: 'Employee Management' }" />
    <VerticalNavLink
      :item="{
        title: 'Employees',
        to: 'employees',
        icon: { icon: 'mdi-people' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Salaries',
        to: '',
        icon: { icon: 'mdi-people' }
      }"
    />

    <!-- exchange money interface -->

    <VerticalNavSectionTitle :item="{ heading: 'Exchange Money Management' }" />
    <VerticalNavLink
      :item="{
        title: 'Exchange Money',
        to: 'exchange_money',
        icon: { icon: 'mdi-currency' }
      }"
    />
    

    <!-- 👉 User Interface -->
    <VerticalNavSectionTitle :item="{ heading: 'User Interface' }" />
    <VerticalNavLink
      :item="{
        title: 'Typography',
        to: 'typography',
        icon: { icon: 'mdi-alpha-t-box-outline' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Icons',
        to: 'icons',
        icon: { icon: 'mdi-eye-outline' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Cards',
        to: 'card-basic',
        icon: { icon: 'mdi-credit-card-outline' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Tables',
        to: 'tables',
        icon: { icon: 'mdi-table' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Form Layouts',
        to: 'form-layouts',
        icon: { icon: 'mdi-form-select' }
      }"
    />
    <!-- <VerticalNavSectionTitle :item="{ heading: 'Exchange Money Management' }" />
    <VerticalNavLink
      :item="{
        title: 'Exchange Money',
        to: 'exchange-money',
        icon: { icon: 'mdi-form-select' }
      }"
    /> -->
  </ul>
</template>

<style lang="scss">
// .v-navigation-drawer {
//   height: 100%;

//   .v-navigation-drawer__content {
//     display: flex;
//     flex-direction: column;

//     > ul {
//       flex-grow: 1;
//     }
//   }
// }

.upgrade-banner {
  margin-top: auto;
  // position: absolute;
  // bottom: 13px;
  // left: 50%;
  // transform: translateX(-50%);
}
</style>


