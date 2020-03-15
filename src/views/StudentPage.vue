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
        <Student :idSession = "idSession" :idExercise = "idExercise"/>
        <TestResults :testResults = "testResults"/>
      </v-col>
      <v-col>
        <Editor :title = "title" @resultsBack="handleResults"/>
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
    idSession: 1,
    idExercise: 1,
    testResults: []
  }),
  mounted () {
    this.idSession = parseInt(this.$route.params.idSession)
    this.idExercise = parseInt(this.$route.params.idExercise)
  },
  watch: {
    $route (to, from) {
      this.idSession = parseInt(this.$route.params.idSession)
      this.idExercise = parseInt(this.$route.params.idExercise)
      this.testResults = []
    }
  },
  methods: {
    handleResults (data) {
      this.testResults = data
    }
  }
}
</script>
