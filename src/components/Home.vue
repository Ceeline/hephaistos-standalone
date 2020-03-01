<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <h2>Title of the exercise:</h2>
        <v-text-field v-model="title" placeholder="Write the title of the exercise"/>
      </v-col>

      <v-col class="text-center" cols="12" md="6">
        <div class="my-2">
          <v-btn
            color="primary"
            @click="saveExercise"
          >Save</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <h2>Instructions :</h2>
        <v-textarea
          v-model="instructions"
          filled
          name="instructions"
          placeholder="Write your instructions here..."
        />
        <h2>Sandbox :</h2>
        <div
          id="editorSol"
          name="solution"
          class="exercise-editor-ace-editor"
        />
      </v-col>
      <v-col cols="12" md="6">
        <h2>Tests :</h2>
        <div
          id="editorTest"
          name="tests"
          class="exercise-editor-ace-editor"
        />
        <br/>
        <v-col class="text-center" cols="12" md="12">
          <div class="my-2">
            <v-btn
              color="primary"
              @click="runSandbox"
            >Run sandbox code</v-btn>
          </div>
        </v-col>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h2>Test Results:</h2>
      </v-col>
    </v-row>

    <v-card
      class="mx-auto"
      max-width="800"
      tile
      v-for="item in testsResult" :key="item.id"
      :color="item.failure !== undefined ? '#FFCDD2': '#C8E6C9'"
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
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'

export default {
  name: 'Home',

  data: () => ({
    instructions: 'Écrire une fonction `negatifs` qui reçoit un tableau de 10 nombres entiers en paramètre, puis qui calcule la quantité de nombres négatifs dans le tableau. La fonction doit retourner la quantité de nombres négatifs comptés.',
    title: '',
    editorTest: null,
    editorSol: null,
    saved: false,
    ran: false,
    testsResult: null
  }),
  methods: {
    async saveExercise () {
      const { instructions, title } = this
      const tests = this.editorTest.getValue()
      const solution = this.editorSol.getValue()
      try {
        await this.axios.post('http://localhost:3000/api/v1/exercise', {
          instructions,
          lang: 'python',
          title,
          tests,
          solution,
          template_regions: ['fr'],
          template_regions_rw: [0],
          difficulty: 1,
          score: 15,
          creation_date: new Date()
        })
        this.saved = true
        console.log('saved !')
      } catch (err) {
        console.log(err)
        this.errorLogin = err
      }
    },
    async runSandbox () {
      const tests = this.editorTest.getValue()
      const solution = this.editorSol.getValue()
      try {
        const result = await this.axios.post(
          'http://localhost:3000/api/v1/exercise/sandbox',
          {
            lang: 'python',
            tests,
            solution
          }
        )
        this.testsResult = result.data.result.tests
        this.ran = true
        console.log('sandbox ran')
      } catch (err) {
        console.log(err)
        this.errorLogin = err
      }
    }
  },

  mounted () {
    this.editorTest = ace.edit('editorTest')
    this.editorTest.setTheme('ace/theme/monokai')
    this.editorTest.session.setMode(`ace/mode/${this.lang}`)

    this.editorSol = ace.edit('editorSol')
    this.editorSol.setTheme('ace/theme/monokai')
    this.editorSol.session.setMode(`ace/mode/${this.lang}`)
  }
}
</script>
