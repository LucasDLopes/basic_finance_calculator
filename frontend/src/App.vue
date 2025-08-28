<template>
  <header class="header">
    <div class="logo">
      <div class="mark"></div>
      <div>xDeskPro</div>
    </div>
  </header>

  <div class="container">
    <div class="grid">
      <div class="panel">
        <div class="section-title">Finance Quote</div>
        <FinanceQuoteForm
          v-model="form"
          @apply="apply"
          @update:modelValue="() => appliedDirty = true"
      />
      </div>
      <div class="panel">
        <div class="section-title">Result</div>
        <ResultPanel
          :data="result"
          :quote-name="quoteName"
          :saving="saving"
          :dirty="appliedDirty"
          @save="saveQuote"
          @update:quoteName="val => quoteName = val"
        />
      </div>
    </div>

    <div class="panel saved">
      <SavedQuotesList :items="saved" @delete="deleteQuote" @view="viewQuote" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, toRaw } from 'vue'
import axios from 'axios'
import FinanceQuoteForm from './components/FinanceQuoteForm.vue'
import ResultPanel from './components/ResultPanel.vue'
import SavedQuotesList from './components/SavedQuotesList.vue'

type InputState = {
  cost: number
  profit: number
  term: number
  rate: number
  outOfPocket: number
  taxRate: number
}

type ResultData = {
  taxes: number
  baseLoanAmount: number
  interest: number
  totalLoanAmount: number
  payment: number
} | null

type SavedQuote = {
  id: string
  input: InputState
  result: ResultData
  quoteName: string
}

const form = ref<InputState>({
  cost: 26906.00,
  profit: 1500.00,
  term: 36,
  rate: 5.7,
  outOfPocket: 2000.00,
  taxRate: 7.5
})

let result = ref<ResultData>(null)
let saved = ref<SavedQuote[]>([])
let saving = ref(false)
let quoteName = ref('2025 Ford Escape')
const lastAppliedInput = ref<InputState | null>(null)
const appliedDirty = ref(false) // true = user has changed form since last apply

watch(form, (nv) => {
  if (!lastAppliedInput.value) {
    appliedDirty.value = true
    return
  }
  // compare shallow values
  appliedDirty.value = Object.keys(nv).some(
    k => (nv as any)[k] !== (lastAppliedInput.value as any)[k]
  )
}, { deep: true })

async function apply(input?: InputState) {
  const payload = input ?? { ...form }
  try {
    const res = await axios.post('/api/calc', payload)
    result.value = {
      taxes: res.data.taxes,
      baseLoanAmount: res.data.baseLoanAmount,
      interest: res.data.interest,
      totalLoanAmount: res.data.totalLoanAmount,
      payment: res.data.payment
    }
    lastAppliedInput.value = { ...payload }
    appliedDirty.value = false // ✅ synced
  } catch (err) {
    console.error('calc error', err)
    result.value = null
  }
}

async function loadSaved(){
  const res = await axios.get('/api/quotes')
  saved.value = res.data
}

//Send server request, include quote name, data from calc query as well as finance data
async function saveQuote(payload: { quoteName: string, data: ResultData }) {
  if (!payload || !payload.data || !lastAppliedInput.value) return

  saving.value = true
  try {
    const body = {
      input: toRaw(lastAppliedInput.value), //For down payment information
      result: toRaw(payload.data),          //For all other information
      name: payload.quoteName,
    }
    await axios.post("/api/quotes", body)
      .then(res => {
        // Check if backend returned an error message in 200 (likely a match to another quote)
        if (res.data?.error) {
          alert(res.data.error)
          return
        }
      })
      .catch(err => {
        // Axios throws for non-2xx responses
        if (err.response?.data?.error) {
          alert(err.response.data.error)
        } else {
          console.error("save error", err)
        }
      })

    await loadSaved()
  } catch (err) {
    console.error("save error", err)
  } finally {
    saving.value = false
  }
}

async function deleteQuote(id: string){
  try{
    await axios.delete('/api/quotes/' + id)
    await loadSaved()
  } catch (err){
    console.error('delete error', err)
  }
}

function viewQuote(item: any) {
  if (!item || !item.input) return
  form.value = { ...item.input }
  quoteName.value = item.quoteName ?? quoteName.value
  result.value = item.result ?? null

  // reset applied tracking
  lastAppliedInput.value = { ...item.input }
  appliedDirty.value = false
}

//Start it all up
loadSaved()
</script>

<style scoped>
/* DO NOT PLACE STYLES HERE; real CSS lives in src/styles.css */
</style>
