<template>
  <v-container>
    <h3>{{ exercise.title }}</h3>
    <br />
    <div v-html="exercise.instructions" />
  </v-container>
</template>

<script>

export default {
  name: 'Student',

  props: [
    'exercise'
  ]
}
</script>
