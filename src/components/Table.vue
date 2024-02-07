<template>
  <div>
    <v-card flat title="Cost Centres">
      <template v-slot:text>
        <div class="d-flex">
          <v-text-field
            v-model="search"
            label="Filter..."
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-checkbox label="Is Provider" v-model="isProvider"></v-checkbox>
          <v-checkbox label="Is Consumer" v-model="isConsumer"></v-checkbox>
        </div>
      </template>

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
                <v-button @click="selectAllOnActionChanged">Select All On Account</v-button>
              </div>
            </th>
          </tr>
        </template>
        <template v-slot:item.provider="{ item }">
          <v-checkbox v-model="item.provider" outlined hide-details></v-checkbox>
        </template>
        <template v-slot:item.consumer="{ item }">
          <v-checkbox v-model="item.consumer" outlined hide-details></v-checkbox>
        </template>
        <template v-slot:item.Onaccount="{ item }">
          <v-text-field v-model="item.Onaccount" outlined hide-details></v-text-field>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const search = ref<string>('')
const isProvider = ref<boolean>(false)
const isConsumer = ref<boolean>(false)
const selectAllProviders = ref<boolean>(false)
const selectAllConsumers = ref<boolean>(false)
const selectAllOnAccount = ref<string>('')
const optionsItems = ref<Array<any>>([
  { text: 'Visible: select', value: 'Vselect' },
  { text: 'Visible: unselect', value: 'Vunselect' },
  { text: 'Visible: invert', value: 'Vinvert' },
  { text: 'All: select', value: 'Aselect' },
  { text: 'All: unselect', value: 'Aunselect' },
  { text: 'All: invert', value: 'Ainvert' }
])
const selected = ref<Array<any>>([])
const headers = ref<Array<any>>([
  {
    title: 'Cost centre',
    align: 'start',
    key: 'name'
  },
  { title: 'Provider', align: 'end', key: 'provider' },
  { title: 'Consumer', align: 'end', key: 'consumer' },
  { title: 'On account', align: 'end', key: 'Onaccount' }
])
const costCentres = ref<Array<any>>([
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

const selectRow = (item: any, event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'input') return

  const index = selected.value.findIndex((s) => s.name === item.name)
  if (index !== -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(item)
  }
}
// Filters
const filterByName = (data: any[], searchText: string) => {
  if (!searchText.trim()) return data
  return data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
}

const filteredCostCentres = computed(() => {
  let filteredData = costCentres.value
  if (isProvider.value) {
    filteredData = filteredData.filter((dessert) => dessert.provider !== '')
  }
  if (isConsumer.value) {
    filteredData = filteredData.filter((dessert) => dessert.consumer !== '')
  }
  return filterByName(filteredData, search.value)
})
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
  if (selectAllOnAccount.value) {
    selected.value.forEach((item) => {
      if (item.Onaccount === '') {
        item.Onaccount = selectAllOnAccount.value
      } else {
        item.Onaccount = selectAllOnAccount.value
      }
    })
  }
}
const handleMenuItemClick = (item: any) => {
  if (item.value === 'Vselect') {
    if (filteredCostCentres.value.length > 0) {
      const filteredSelectedNames = new Set(selected.value.map(item => item.name));
      filteredCostCentres.value.forEach((dessert) => {
        if (!filteredSelectedNames.has(dessert.name)) {
          selected.value.push(dessert);
        }
      });
    } else {
      selected.value.push(...costCentres.value);
    }
  } else if (item.value === 'Vunselect') {
    if (filteredCostCentres.value.length > 0) {
      selected.value = selected.value.filter((item) => !filteredCostCentres.value.some(d => d.name === item.name));
    }
  } else if (item.value === 'Vinvert') {
    if (filteredCostCentres.value.length > 0) {
      const filteredSelectedNames = new Set(selected.value.map(item => item.name));
      selected.value = selected.value.filter((item) => !filteredCostCentres.value.some(d => d.name === item.name));
      filteredCostCentres.value.forEach((dessert) => {
        if (!filteredSelectedNames.has(dessert.name)) {
          selected.value.push(dessert);
        }
      });
    }
  }
}

</script>

<style scoped></style>
