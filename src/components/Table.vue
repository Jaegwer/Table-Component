<template>
  <div>
    <v-card flat title="Cost Centres">
      <FilterSection
        :search="search"
        :isProvider="isProvider"
        :isConsumer="isConsumer"
        :resetFilters="() => resetFilters()"
        :emitSearch="handleSearch"
        :emitProvider="handleProviderFilter"
        :emitConsumer="handleConsumerFilter"
      />

      <v-data-table
        return-object
        show-select
        v-model="selected"
        :headers="headers"
        :items="filteredCostCentres"
        :search="search"
        item-key="name"
        @click:row="selectRow"
      >
        <template v-slot:headers>
          <tr>
            <th colspan="2">
              <p>Cost centre</p>
              <div class="d-flex align-center">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn variant="text" v-bind="props" prepend-icon="mdi-arrow-down-left">
                      <template v-slot:prepend>
                        <v-icon color="red"></v-icon>
                      </template>
                      <p class="text-red">SELECTED:{{ selected.length }}</p></v-btn
                    >
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in optionsItems"
                      :key="index"
                      :value="index"
                      @click="handleMenuItemClick(item)"
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </th>
            <th>
              <v-checkbox
                v-model="selectAllProviders"
                label="Select All Providers"
                @change="selectAllProvidersChanged"
              ></v-checkbox>
            </th>
            <th>
              <v-checkbox
                v-model="selectAllConsumers"
                label="Select All Consumers"
                @change="selectAllConsumersChanged"
              ></v-checkbox>
            </th>
            <th>
              <div>
                <v-text-field v-model="selectAllOnAccount" outlined hide-details></v-text-field>
                <v-button class="text-red" @click="selectAllOnActionChanged"
                  ><span class="mdi mdi-table-arrow-down"></span
                ></v-button>
              </div>
            </th>
          </tr>
        </template>
        <template v-slot:item.provider="{ item }">
          <v-checkbox
            v-model="item.provider"
            :disabled="!selected.includes(item)"
            outlined
            hide-details
          ></v-checkbox>
        </template>
        <template v-slot:item.consumer="{ item }">
          <v-checkbox
            v-model="item.consumer"
            :disabled="!selected.includes(item)"
            outlined
            hide-details
          ></v-checkbox>
        </template>
        <template v-slot:item.Onaccount="{ item }">
          <v-text-field
            v-model="item.Onaccount"
            :disabled="!selected.includes(item)"
            outlined
            hide-details
          ></v-text-field>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { OptionItem, CostCentre, Headers, Row, Filter, SelectedData } from '../types/interface'
import FilterSection from './FilterSection.vue'
import { ref, computed } from 'vue'
// Constants
const search = ref<string>('')
const isProvider = ref<boolean>(false)
const isConsumer = ref<boolean>(false)
const selectAllProviders = ref<boolean>(false)
const selectAllConsumers = ref<boolean>(false)
const selectAllOnAccount = ref<string>('')
const optionsItems = ref<OptionItem[]>([
  { text: 'Visible: select', value: 'Vselect' },
  { text: 'Visible: unselect', value: 'Vunselect' },
  { text: 'Visible: invert', value: 'Vinvert' },
  { text: 'All: select', value: 'Aselect' },
  { text: 'All: unselect', value: 'Aunselect' },
  { text: 'All: invert', value: 'Ainvert' }
])
const selected = ref<SelectedData[]>([])
const headers = ref<Headers[]>([
  {
    title: 'Cost centre',
    align: 'start',
    key: 'name'
  },
  { title: 'Provider', align: 'end', key: 'provider' },
  { title: 'Consumer', align: 'end', key: 'consumer' },
  { title: 'On account', align: 'end', key: 'Onaccount' }
])
const costCentres = ref<CostCentre[]>([
  {
    name: 'Apportionment 1',
    provider: '',
    consumer: '',
    Onaccount: ''
  },
  {
    name: 'Apportionment 2',
    provider: '',
    consumer: '',
    Onaccount: ''
  },
  {
    name: 'Consumer 1',
    provider: '',
    consumer: '',
    Onaccount: ''
  },
  {
    name: 'Consumer 2',
    provider: '',
    consumer: '',
    Onaccount: ''
  },
  {
    name: 'Provider 1',
    provider: '',
    consumer: '',
    Onaccount: ''
  },
  {
    name: 'Provider 2',
    provider: '',
    consumer: '',
    Onaccount: ''
  }
])

const selectRow = (item: Row, event: MouseEvent) => {
  if (
    event.target &&
    (event.target as HTMLElement).tagName &&
    (event.target as HTMLElement).tagName.toLowerCase() === 'input'
  ) {
    return
  }

  const index = selected.value.findIndex((s) => s.name === item.name)
  if (index !== -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(item)
  }
}

// Filters
const filterByName = (data: Filter[], searchText: string) => {
  if (!searchText.trim()) return data
  return data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
}
const handleProviderFilter = (value: boolean) => {
  isProvider.value = value
}

const handleConsumerFilter = (value: boolean) => {
  isConsumer.value = value
}
const filteredCostCentres = computed(() => {
  let filteredData = costCentres.value as Filter[]
  if (isProvider.value) {
    filteredData = filteredData.filter((item) => item.provider !== '')
  }
  if (isConsumer.value) {
    filteredData = filteredData.filter((item) => item.consumer !== '')
  }
  return filterByName(filteredData, search.value)
})
const resetFilters = () => {
	console.log(search.value);

  search.value = ''
  console.log(search.value);

  isProvider.value = false
  isConsumer.value = false
}
// Selections
const selectAllProvidersChanged = () => {
  if (selectAllProviders.value) {
    selected.value.forEach((item) => {
      if (item.provider === '' || item.provider === false) {
        item.provider = true
      }
    })
  } else {
    selected.value.forEach((item) => {
      if (item.provider === true) {
        item.provider = ''
      }
    })
  }
}
const selectAllConsumersChanged = () => {
  if (selectAllConsumers.value) {
    selected.value.forEach((item) => {
      if (item.consumer === '' || item.consumer === false) {
        item.consumer = true
      }
    })
  } else {
    selected.value.forEach((item) => {
      if (item.consumer === true) {
        item.consumer = ''
      }
    })
  }
}
const selectAllOnActionChanged = () => {
  if (selectAllOnAccount.value !== '') {
    selected.value.forEach((item) => {
      item.Onaccount = selectAllOnAccount.value
    })
  } else {
    selected.value.forEach((item) => {
      item.Onaccount = ''
    })
  }
}

const handleMenuItemClick = (item: OptionItem) => {
  if (item.value === 'Vselect') {
    if (filteredCostCentres.value.length > 0) {
      const filteredSelectedNames = new Set(selected.value.map((item) => item.name))
      filteredCostCentres.value.forEach((dessert) => {
        if (!filteredSelectedNames.has(dessert.name)) {
          selected.value.push(dessert)
        }
      })
    } else {
      selected.value.push(...(costCentres.value as SelectedData[]))
    }
  } else if (item.value === 'Vunselect') {
    if (filteredCostCentres.value.length > 0) {
      selected.value = selected.value.filter(
        (item) => !filteredCostCentres.value.some((d) => d.name === item.name)
      )
    }
  } else if (item.value === 'Vinvert') {
    if (filteredCostCentres.value.length > 0) {
      const filteredSelectedNames = new Set(selected.value.map((item) => item.name))
      selected.value = selected.value.filter(
        (item) => !filteredCostCentres.value.some((d) => d.name === item.name)
      )
      filteredCostCentres.value.forEach((dessert) => {
        if (!filteredSelectedNames.has(dessert.name)) {
          selected.value.push(dessert)
        }
      })
    }
  } else if (item.value === 'Aselect') {
    const selectedNames = new Set(selected.value.map((item) => item.name))
    const nonSelectedItems = costCentres.value.filter((item) => !selectedNames.has(item.name))
    selected.value.push(...(nonSelectedItems as SelectedData[]))
  } else if (item.value === 'Aunselect') {
    selected.value = []
  } else if (item.value === 'Ainvert') {
    const selectedNames = selected.value.map((item) => item.name)
    const remainingCentres = costCentres.value.filter((item) => !selectedNames.includes(item.name))
    selected.value.splice(0, selected.value.length, ...(remainingCentres as SelectedData[]))
  }
}
const handleSearch = (value: string) => {
  search.value = value
}
</script>

<style scoped></style>
