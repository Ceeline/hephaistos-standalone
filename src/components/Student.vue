<template>
  <v-container>
    <h3>{{ exercise.title }}</h3>
    <br />
    <div v-html="exercise.instructions" />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Student',

  props: [
    'idSession',
    'idExercise'
  ],
  data: () => ({
    exercise: []
  }),
  methods: {
    ...mapActions('exercises', ['fetchExerciseForSession'])
  },
  async mounted () {
    await this.fetchExerciseForSession({
      sessionId: this.idSession,
      exerciseId: this.idExercise
    })

    this.exercise = this.getExerciseById(this.idExercise)
  },
  watch: {
    idExercise: async function () {
      await this.fetchExerciseForSession({
        sessionId: this.idSession,
        exerciseId: this.idExercise
      })

      this.exercise = this.getExerciseById(this.idExercise)
    }
  },
  computed: {
    ...mapGetters('exercises', ['getExerciseById'])
  }
}
</script>
