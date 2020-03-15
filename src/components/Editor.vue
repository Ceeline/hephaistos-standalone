<template>
    <v-container>
        <v-row>
          <h3>{{title}}</h3>
          <v-col cols="1" />
          <v-btn
            small
            color="primary"
            @click="runSolution">Run</v-btn>
        </v-row>
        <br>
        <div
          id="editor"
          name="solution"
          class="exercise-editor-ace-editor"
        />
    </v-container>
</template>

<script>
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Editor',
  data: () => ({
    lang: 'python',
    editor: null
  }),
  props: [
    'title'
  ],
  mounted () {
    this.editor = ace.edit('editor')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.session.setMode(`ace/mode/${this.lang}`)
  },
  methods: {
    ...mapActions('attempts', ['createAttemptForSession']),
    async runSolution () {
      await this.createAttemptForSession({
        exerciseId: this.$route.params.idExercise,
        sessionId: this.$route.params.idSession,
        solution: this.editor.getValue()
      })

      const testResults = this.lastAttemptResults.tests
      console.log('test results:' + JSON.stringify(testResults))
      this.$emit('resultsBack', testResults)
      // TODO afficher le résultat des tests
      /* format de retour:
      {
        "stats":{
          "errors":0,
          "failures":1,
          "skipped":0,
          "tests":1,
          "time":0.055,
          "timestamp":"2020-03-07T23:05:10.475131"
        },
        "tests":[{
          "file":"studentcode-test.py",
          "line":22,
          "name":"test_hello_world",
          "time":0.002,
          "failure":{
            "stacktrace":"self = <studentcode-test.Test testMethod=test_hello_world>\n\n    def test_hello_world(self):\n        output = out.getvalue().strip()\n>       assert output == 'Hello World', \"La valeur d'affichage n'est pas 'Hello World'\"\nE       AssertionError: La valeur d'affichage n'est pas 'Hello World'\nE       assert '' == 'Hello World'\nE         + Hello World\n\nstudentcode-test.py:25: AssertionError",
            "message":"La valeur d'affichage n'est pas 'Hello World'\n\n  + Hello World"
            }
          }
      ]} */
    }
  },
  computed: {
    ...mapState('attempts', ['lastAttemptResults'])
  }

}
</script>
