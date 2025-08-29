<script setup lang="ts">
import { ref, watch } from 'vue'

export type ResultData = {
  taxes: number
  baseLoanAmount: number
  interest: number
  totalLoanAmount: number
  payment: number
} | null

const props = defineProps<{
  data: ResultData
  quoteName?: string
  saving?: boolean
  dirty?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: { quoteName: string, data: ResultData }): void
  (e: 'update:quoteName', v: string): void
}>()

const localName = ref(props.quoteName ?? '')

watch(() => props.quoteName, (v) => { localName.value = v ?? '' })

/* emit save API call */
function doSave() {
  const payload = { quoteName: localName.value, data: props.data }
  emit('update:quoteName', localName.value)
  emit('save', payload)
}
</script>

<template>
  <div>
    <!-- KPIs -->
    <div class="kpi">
      <div class="label">Taxes:</div>
      <div class="value">{{ props.data ? ('$' + props.data.taxes.toFixed(2)) : '-' }}</div>
    </div>
    <div class="kpi">
      <div class="label">Base Loan Amount:</div>
      <div class="value">{{ props.data ? ('$' + props.data.baseLoanAmount.toFixed(2)) : '-' }}</div>
    </div>
    <div class="kpi">
      <div class="label">Interest:</div>
      <div class="value">{{ props.data ? ('$' + props.data.interest.toFixed(2)) : '-' }}</div>
    </div>
    <div class="kpi">
      <div class="label">Total Loan Amount:</div>
      <div class="value">{{ props.data ? ('$' + props.data.totalLoanAmount.toFixed(2)) : '-' }}</div>
    </div>
    <div class="kpi">
      <div class="label">Payment:</div>
      <div class="value" style="font-size:18px">{{ props.data ? ('$' + props.data.payment.toFixed(2)) : '-' }}</div>
    </div>

    <!-- Save -->
    <div style="margin:12px 0; display:flex; align-items:center; gap:8px">
      <input
        class="input"
        style="flex:1"
        v-model="localName"
        @input="() => emit('update:quoteName', localName)"
      />
      <button
        class="btn"
        :disabled="!props.data || props.saving || props.dirty"
        @click="doSave"
      >
        {{ props.saving ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>