<template>
  <div class="exercisePage">
    <Exercise/>
  </div>
</template>

<script>
// @ is an alias to /src
import Exercise from '@/components/Exercise.vue'

export default {
  name: 'ExercisePage',
  components: {
    Exercise
  }
}
</script>
