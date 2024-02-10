<template>
  <div class="d-flex">
    <v-text-field
      v-model="search"
      label="Filter..."
      prepend-inner-icon="mdi-magnify"
      single-line
      variant="outlined"
      hide-details
      @input="emitSearch"
    ></v-text-field>
    <v-checkbox label="Is Provider" v-model="isProvider" @change="emitProviderChange"></v-checkbox>
    <v-checkbox label="Is Consumer" v-model="isConsumer" @change="emitConsumerChange"></v-checkbox>
    <v-btn @click="emitResetFilters">
      <span class="mdi mdi-filter-remove-outline text-red"></span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import type { Props } from '../types/interface'

const props = defineProps<Props>()

const search = ref(props.search)
const isProvider = ref(props.isProvider)
const isConsumer = ref(props.isConsumer)
const emitResetFilters = () => {
  isProvider.value = false
  isConsumer.value = false
  search.value = ''
  props.resetFilters()
}

const emitSearch = (value: string) => props.emitSearch(value)
const emitProviderChange = (newValue: boolean) => {
  if (!newValue) {
    isProvider.value = false
  }
  props.emitProvider(isProvider.value)
}
const emitConsumerChange = (newValue: boolean) => {
  if (!newValue) {
    isConsumer.value = false
  }
  props.emitConsumer(isConsumer.value)
}

watch(search, (newValue) => {
  emitSearch(newValue)
})
</script>
