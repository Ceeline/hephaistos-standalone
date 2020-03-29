<template>
  <div class="studentPage">
    <v-row>
      <v-col
        class="text-center"
        cols="6"
        sm="2"
      >
        <Panel/>
      </v-col>
      <v-col>
        <Student :exercise= "exercise"/>
        <TestResults :testResults = "testResults"/>
      </v-col>
      <v-col>
        <Editor :title = "title"
          :regions = "regions"
          :student = "true"
          @changeEditor="handleChange"
          @resultsBack="handleResults"
          @regionsSaved="saveRegions"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Student from '@/components/Student.vue'
import Editor from '@/components/Editor.vue'
import Panel from '@/components/StudentPanel.vue'
import TestResults from '@/components/TestResults.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'StudentPage',
  components: {
    Student,
    Editor,
    Panel,
    TestResults
  },
  data: () => ({
    title: 'Your solution: ',
    exercise: [],
    testResults: [],
    regions: {
      template_regions: '',
      template_regions_rw: ''
    }
  }),
  computed: {
    ...mapGetters('exercises', ['getExerciseById'])
  },
  async mounted () {
    await this.fetchExerciseForSession({
      sessionId: parseInt(this.$route.params.idSession),
      exerciseId: parseInt(this.$route.params.idExercise)
    })

    this.exercise = this.getExerciseById(this.$route.params.idExercise)
    this.regions = {
      template_regions: this.exercise.template_regions,
      template_regions_rw: this.exercise.template_regions_rw
    }
  },
  watch: {
    async $route (to, from) {
      await this.fetchExerciseForSession({
        sessionId: parseInt(this.$route.params.idSession),
        exerciseId: parseInt(this.$route.params.idExercise)
      })

      this.exercise = this.getExerciseById(this.$route.params.idExercise)
      this.regions = {
        template_regions: this.exercise.template_regions,
        template_regions_rw: this.exercise.template_regions_rw
      }
      this.testResults = []
    }
  },
  methods: {
    handleResults (data) {
      this.testResults = data
    },
    saveRegions (data) {
      this.regions = {
        template_regions: data.template_regions,
        template_regions_rw: data.template_regions_rw
      }
    },
    handleChange (newRegions) {
      this.regions = {
        template_regions: newRegions.regionsData.template_regions,
        template_regions_rw: newRegions.regionsData.template_regions_rw
      }
    },
    ...mapActions('exercises', ['fetchExerciseForSession'])
  }
}
</script>
