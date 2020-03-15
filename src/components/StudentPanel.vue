<template>
    <v-container>
      Exercises:
        <v-row>
            <v-col
              v-for="exercise in exercisesBySession" :key="exercise.id"
            >
              <v-card
                max-width="200"
                :color="exercise.valid? '#00a16c': '#484e4a'"
                @click="openStudentView(exercise.id)"
              >
                <v-card-text>{{ exercise.title }}</v-card-text>
              </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'Panel',
  data: () => ({
    exercisesBySession: []
  }),
  methods: {
    ...mapActions('exercises', ['fetchExercisesForSession']),
    async openStudentView (id) {
      this.$router.replace({
        name: 'studentPage',
        params: {
          idSession: this.$route.params.idSession,
          idExercise: id
        }
      })
    }
  },
  async mounted () {
    // get exercises by session
    await this.fetchExercisesForSession({ sessionId: this.$route.params.idSession })

    this.exercisesBySession = await this.getExercisesBySessionId(this.$route.params.idSession)
  },
  computed: {
    ...mapState('exercises', ['exercises']),
    ...mapGetters('exercises', ['getExercisesBySessionId'])
  }
}
</script>
