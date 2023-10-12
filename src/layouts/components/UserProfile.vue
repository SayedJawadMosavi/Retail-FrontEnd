

<template>
  <ConfirmDialog
    ref="confirmRef"
    @confirm="logout"
  />
  <VBadge v-bind="avatarBadgeProps">
    <VAvatar
      style="cursor: pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge v-bind="avatarBadgeProps">
                  <VAvatar
                    color="primary"
                    size="40"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ store.user?.name }}
            </VListItemTitle>
            <VListItemSubtitle class="text-disabled">
              {{ role }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem
            style="cursor: pointer"
            to="account-settings"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-account-outline"
                size="22"
              />
            </template>

            <VListItemTitle>پروفایل</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem style="cursor: pointer">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout-variant"
                size="22"
              />
            </template>

            <VListItemTitle @click="confirmRef.showDialog('logout')"> خروج </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>


<script setup>
import avatar1 from '@/assets/images/avatars/avatar-1.png'
import { useStoreAuth } from '@/store/authStore'
import { axios } from '@/plugins/axios-plugin'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import { computed } from 'vue'
const confirmRef = ref()

const store = useStoreAuth()

const role = computed(() => {
  let val = ''
  switch (store.user?.role) {
    case 'admin':
      val = 'ادمین'
      break
    case 'finance_manager':
      val = 'مدیر مالی'
      break
    case 'finance_manager':
      val = 'مدیر مالی'
      break
    default:
      break
  }

  return val
})
const avatarBadgeProps = {
  dot: true,
  location: 'bottom right',
  offsetX: 3,
  offsetY: 3,
  color: 'success',
  bordered: true,
}

function logout() {
  try {
    const res = axios.post('logout')
    store.$logout()
  } catch (error) {
    console.error('error', error)
  }
}
</script>
