<template>
    <v-container>
      <v-card
        class="mx-auto"
        max-width="800"
        tile
        v-for="item in testResults" :key="item.id"
        :color="item.failure !== undefined ? '#d73232': '#00a16c'"
      >
        <v-card-text v-if="item.failure !== undefined">
            {{ item.failure.message }}<br/>
            {{ item.file }} - {{ item.name }} - {{ item.time }} ms
        </v-card-text>
        <v-card-text v-else>{{ item.file }} - {{ item.name }} - {{ item.time }} ms</v-card-text>
      </v-card>
    </v-container>
</template>

<script>
export default {
  name: 'TestResults',
  props: [
    'testResults'
  ]
}
</script>
