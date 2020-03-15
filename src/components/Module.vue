<template>
    <v-container>
        <h2>{{ module.name }}</h2>

        <div
            v-for="session in sessions" :key="session.id"
        >
            <v-row>
                <h3>{{ session.name }}</h3>
            </v-row>

            <v-row>
                <span
                    v-for="exercise in exercises" :key="exercise.id"
                >
                  <v-col
                    v-if = "exercise.sessionId === session.id"
                  >
                    <v-card
                        width="200"
                        :color="exercise.valid? '#00a16c': '#484e4a'"
                        @click="openStudentView(exercise.id, session.id)"
                    >
                        <v-card-text
                        class=text-center>{{ exercise.title }}</v-card-text>
                    </v-card>
                  </v-col>
                </span>
            </v-row>

        </div>
    </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'Module',
  data: () => ({
    module: [],
    session: []
  }),
  methods: {
    ...mapActions('modules', ['fetchModules']),
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('exercises', ['fetchExercisesForSession']),
    openStudentView (idExercise, idSession) {
      this.$router.replace({
        name: 'studentPage',
        params: {
          idSession: idSession,
          idExercise: idExercise
        }
      })
    }
  },
  async mounted () {
    // get modules
    await this.fetchModules()

    // get this module
    this.module = this.getModuleById(this.$route.params.id)

    // get sessions for this module
    await this.fetchSessionsForModule({ moduleId: this.module.id })

    // get exercises by sessions
    await Promise.all(
      this.sessions.map(s => this.fetchExercisesForSession({ sessionId: s.id }))
    )
  },
  computed: {
    ...mapState('modules', ['modules']),
    ...mapState('sessions', ['sessions']),
    ...mapState('exercises', ['exercises']),
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionsByModuleId'])
  }
}
</script>
