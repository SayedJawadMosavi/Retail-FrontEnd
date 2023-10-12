<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست کاربران"
      create-text="افزودن کاربر"
      edit-text="ویرایش کاربر"
      page-icon="mdi-accounts"
      :show-create="scope(['user_create'])"
      :show-print="scope(['user_create'])"
      :show-delete="scope(['user_delete'])"
      :show-restore="scope(['user_restore'])"
      :show-force-delete="scope(['user_force_delete'])"
      @on-create="createUser"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
      @on-force-delete="deleteRecord('force-delete')"
    >
      <template #default />
    </BreadCrumbs>
    <AddUser
      ref="userRefs"
      :fetch-record="fetchRecord"
    />
    <EditUser
      ref="userEditRefs"
      :fetch-record="fetchRecord"
    />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:extra-total="extraTotal"
      v-model:loading="apiLoading"
      :tabs="tabs"
      :headers="headers"
      :items="tableRecords"
      @table-change="onTableChange($event)"
    >
      <template #role="{ item }">
        <VChip
          small
          :color="getRole(item).color"
          class="font-weight-medium"
        >
          {{ getRole(item).name }}
        </VChip>
      </template>

      <template #view_profile="{ item }">
        <VBtn
          variant="plain"
          class="font-weight-bold px-1"
          @click="viewProfile(item)"
        >
          <VIcon
            size="30"
            start
            icon="mdi-eye-arrow-right"
          />
        </VBtn>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import AddUser from '@/views/pages/users/AddUser.vue'
import EditUser from '@/views/pages/users/EditUser.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import usePageConfig from '@/config/pages/user'
import router from '@/router'
import { scope } from '@/@core/utils/index'

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref({})
const userRefs = ref()
const userEditRefs = ref()

const apiLoading = ref(false)
const datatableRefs = ref()

const options = ref({ page: 1, itemPerPage: 20, tab: 'incomings' })
const searchOption = ref({})
const tableRecords = ref([])

const createUser = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    userEditRefs.value.openDialog(datatableRefs.value?.selectedItems[0])
  } else {
    userRefs.value.openDialog()
  }
}

const viewProfile = item => {
  router.replace('view-user/' + item.id)
}
const onTableChange = value => {
  options.value = value
  fetchRecord()
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('users/' + ids)
    if (type == 'force-delete') await axios.delete('users-force-delete/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-users/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const fetchRecord = async () => {
  try {
    datatableRefs.value.selectedItems = []
    apiLoading.value = true
    const { data } = await axios.get('users', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
  } catch (error) {
    console.error('datatable', error)
  }
  apiLoading.value = false
}

const getRole = item => {
  let color = ''
  let name = ''
  if (item.role == 'admin') {
    name = 'ادمین'
    color = 'primary'
  } else if (item.role == 'finance_manager') {
    name = 'مدیر مالی'
    color = 'info'
  } else {
    name = 'مدیر صرافی'
    color = 'warning'
  }

  return { name, color }
}
onMounted(() => {
  fetchRecord()
})
</script>


<style lang="scss">
.expand-card {
  height: 300px !important;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s ease-out;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>

<route lang="yaml">
meta:
  auth: true
</route>
