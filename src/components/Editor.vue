<template>
    <v-container>
        <v-row>
          <h3>{{title}}</h3>

          <v-col cols="1"/>

          <v-btn
            small
            color="primary"
            @click="runSolution">Run</v-btn>

          <v-col cols="1"/>

          <v-btn
            small
            color="green"
            @click="saveRegions">Save</v-btn>
        </v-row>
        <br>
        <div
          id="editor"
          name="solution"
          class="exercise-editor-ace-editor"
          onChange="update()"
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
  props: {
    title: String,
    regions: Object,
    student: Boolean
  },
  data: () => ({
    lang: 'python',
    editor: null,
    endLinePerRegion: [],
    regionsData: []
  }),
  mounted () {
    this.editor = ace.edit('editor')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.session.setMode(`ace/mode/${this.lang}`)

    this.regionsData = this.regions
    this.setEditor()
  },
  methods: {
    ...mapActions('attempts', ['createAttemptForSession']),

    update () {
      const { editor, endLinePerRegion, regionsData } = this
      // we get the line of the update and the new text at this line
      const updatedRowNb = editor.getCursorPosition().row

      // we find in which region this line is and we update this region
      let i = 0
      while (i < endLinePerRegion.length) {
        if (endLinePerRegion[i] > updatedRowNb) {
          // we found the region to update
          if (editor.session.getLength() - 1 === endLinePerRegion[endLinePerRegion.length - 1]) {
            // regular update

            const newRegion = editor.session.getLines(i === 0 ? 0 : endLinePerRegion[i - 1], endLinePerRegion[i] - 1)
            const str = String(newRegion).replace(/,/g, '\n')
            regionsData.template_regions[i] = str
          } else {
            const suppress = editor.session.getLength() - 1 < endLinePerRegion[endLinePerRegion.length - 1]

            for (let l = i; l < endLinePerRegion.length; l++) {
              if (suppress) {
                // suppress line
                // we reduce by 1 the nb of the last line of each region from the one we change
                endLinePerRegion[l] -= 1
              } else {
                // add line
                // we increase by 1 the nb of the last line of each region from the one we change
                endLinePerRegion[l] += 1
              }
            }

            // we remove from the concerned region the line removed from the editor
            const nth = i === 0 ? updatedRowNb : updatedRowNb - endLinePerRegion[i - 1]

            let str
            if (suppress) {
              const index = this.findIndex(regionsData.template_regions[i], nth)
              str = regionsData.template_regions[i].slice(0, index)
              str += regionsData.template_regions[i].slice(index + 1, regionsData.template_regions[i].length)
            } else {
              if (editor.getCursorPosition().column === 0 && nth === 0) { // before first line
                str = '\n' + regionsData.template_regions[i]
              } else if (editor.getCursorPosition().column === 0) {
                const index = this.findIndex(regionsData.template_regions[i], nth)
                str = regionsData.template_regions[i].slice(0, index + 1)
                str += regionsData.template_regions[i].slice(index, regionsData.template_regions[i].length)
              } else if (updatedRowNb === endLinePerRegion[i]) {
                const index = this.findIndex(regionsData.template_regions[i], nth)
                str = regionsData.template_regions[i].slice(0, index)
                str += regionsData.template_regions[i].slice(index, regionsData.template_regions[i].length) + '\n'
              } else {
                const index = this.findIndex(regionsData.template_regions[i], nth + 1)
                str = regionsData.template_regions[i].slice(0, index)
                str += '\n' + regionsData.template_regions[i].slice(index, regionsData.template_regions[i].length)
              }
            }
            regionsData.template_regions[i] = str
            this.$emit('changeEditor', { regionsData })
          }

          // end of the loop
          i = endLinePerRegion.length
        }
        i++
      }
    },

    findIndex (str, nth) {
      let index = 0
      let n = 0
      let count = 1

      while (count <= nth) {
        n = str.indexOf('\n', index)
        if (n !== -1) {
          if (n === index) {
            index++
          } else {
            index = n + 1
          }
        } else {
          n = index + this.editor.getCursorPosition().column
        }
        count++
      }

      return n
    },

    setEditor () {
      const { editor } = this
      this.endLinePerRegion = []
      let code = ''

      if (this.regionsData.template_regions !== '') {
        // we extract from the table the content of each case to print
        this.regionsData.template_regions.forEach((element, index) => {
          const regionRule = this.regionsData.template_regions_rw[index]

          // we only display what the user is allowed to see
          if (!this.student || (this.student && regionRule !== 0)) {
            const nbLinesRegion = element.split('\n').length
            if (nbLinesRegion === 0) {
              this.endLinePerRegion.push(1)
            } else {
              this.endLinePerRegion.push(index === 0 ? nbLinesRegion : nbLinesRegion + this.endLinePerRegion[index - 1])
            }
            this.highlightEditor(element, nbLinesRegion, regionRule)

            code += element
            code += '\n'
            editor.setValue(code)
          }
        })
      }

      editor.on('guttermousedown', (e) => this.toggleFunction(e))

      editor.getSession().on('change', (e) => this.update())
    },

    // handling breakpoints, code coming from :
    // https://ourcodeworld.com/articles/read/1052/how-to-add-toggle-breakpoints-on-the-ace-editor-gutter
    toggleFunction (e) {
      var target = e.domEvent.target

      if (target.className.indexOf('ace_gutter-cell') === -1) {
        return
      }

      if (!this.editor.isFocused()) {
        return
      }

      if (e.clientX > 25 + target.getBoundingClientRect().left) {
        return
      }

      var row = e.getDocumentPosition().row
      var breakpoints = e.editor.session.getBreakpoints(row, 0)

      // If there's a breakpoint already defined, it should be removed, offering the toggle feature
      if (typeof breakpoints[row] === typeof undefined) {
        e.editor.session.setBreakpoint(row)
        this.toggleReadWrite(e)
      } else {
        e.editor.session.clearBreakpoint(row)
        this.toggleReadWrite(e)
      }

      e.stop()
    },

    toggleReadWrite (e) {
      const { editor, regionsData, endLinePerRegion } = this
      const toggleRow = e.getDocumentPosition().row

      // we find in which region this line is and we update this region
      let i = 0
      while (i < endLinePerRegion.length) {
        if (endLinePerRegion[i] > toggleRow) {
          // we found the region to update

          // we divide this region in 3
          //    1st case: content until this line, no change for rw
          //    2nd case: line to change, rw changes
          //    3rd case: content after this line, no change for rw

          // 1. we get the content of the line
          const line = editor.session.getLine(toggleRow)

          const nth = i === 0 ? toggleRow : toggleRow - endLinePerRegion[i - 1]
          const index = this.findIndex(regionsData.template_regions[i], nth)

          let case1
          let case2
          let case3

          // we divide the region in 3
          if (nth === 0) {
            case1 = line
            case2 = regionsData.template_regions[i].slice(line.length + 1, regionsData.template_regions[i].length)
          } else if (toggleRow === endLinePerRegion[i] - 1) {
            case1 = regionsData.template_regions[i].slice(0, index)
            case2 = line
          } else {
            case1 = regionsData.template_regions[i].slice(0, index)
            case2 = line
            case3 = regionsData.template_regions[i].slice(index + 2 + line.length, regionsData.template_regions[i].length)
          }

          // we update the regions
          if (case2 !== '') {
            if (case3 !== undefined) {
              regionsData.template_regions.push(case3)
              regionsData.template_regions_rw.push(regionsData.template_regions_rw[i])
            }
            for (let l = i + 1; l < endLinePerRegion.length; l++) {
              regionsData.template_regions.push(regionsData.template_regions[l])
              regionsData.template_regions_rw.push(regionsData.template_regions_rw[l])
            }
            regionsData.template_regions[i] = case1
            regionsData.template_regions[i + 1] = case2
            regionsData.template_regions_rw[i + 1] = regionsData.template_regions_rw[i]
          }

          if (regionsData.template_regions_rw[i] === 6) {
            if (case3 !== undefined) {
              regionsData.template_regions_rw[i + 1] = 4
            } else {
              regionsData.template_regions_rw[i] = 4
            }
          } else {
            if (case3 !== undefined) {
              regionsData.template_regions_rw[i + 1] = 6
            } else {
              regionsData.template_regions_rw[i] = 6
            }
          }

          this.$emit('changeEditor', { regionsData })
          // end of the loop
          i = endLinePerRegion.length
        }
        i++
      }
    },

    highlightEditor (region, nbLinesRegion, regionRule) {
      const { editor } = this
      const session = editor.getSession()
      const begRegion = session.getLength() - 1
      const endRegion = begRegion + nbLinesRegion - 1

      const range = new ace.Range(begRegion, 0, endRegion, 100)

      if (regionRule === 0) {
        session.addMarker(range, 'noread-highlight', 'fullLine', true)
      } else if (regionRule === 4) {
        session.addMarker(range, 'readonly-highlight', 'fullLine', true)
        if (this.student) {
          this.makeRangeReadOnly(range)
        }
      }
    },

    makeRangeReadOnly (range) {
      const { editor } = this

      // prevent from typing something
      editor.keyBinding.addKeyboardHandler({
        handleKeyboard: function (data, hash, keyString, keyCode, event) {
          if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false

          if (intersects(range)) {
            return { command: 'null', passEvent: false }
          }
        }
      })

      function intersects (range) {
        return editor.getSelectionRange().intersects(range)
      }

      // prevent from copying/pasting
      before(editor, 'onPaste', preventReadonly)
      before(editor, 'onCut', preventReadonly)

      function preventReadonly (next, args) {
        if (intersects(range)) return
        next()
      }

      function before (obj, method, wrapper) {
        const orig = obj[method]
        obj[method] = function () {
          const args = Array.prototype.slice.call(arguments)
          return wrapper.call(this, function () {
            return orig.apply(obj, args)
          }, args)
        }

        return obj[method]
      }
    },

    async runSolution () {
      // we get the different parts written by the student
      const region = this.getValueStudent()

      await this.createAttemptForSession({
        exerciseId: this.$route.params.idExercise,
        sessionId: this.$route.params.idSession,
        regions: region
      })

      const testResults = this.lastAttemptResults.tests
      this.$emit('resultsBack', testResults)
    },

    getValueStudent () {
      const region = []

      for (let index = 0; index < this.regionsData.template_regions_rw.length; index++) {
        if (this.regionsData.template_regions_rw[index] === 6) {
          region.push(this.regionsData.template_regions[index])
        }
      }

      return region
    },

    saveRegions () {
      const { regionsData } = this
      this.$emit('regionsSaved', { regionsData })
    }
  },
  watch: {
    regions: function () {
      // reset the editor
      this.editor.destroy()
      this.editor = ace.edit('editor')
      this.editor.setTheme('ace/theme/monokai')
      this.editor.session.setMode(`ace/mode/${this.lang}`)

      this.regionsData = this.regions
      this.editor.focus()
      this.setEditor()
    }
  },
  computed: {
    ...mapState('attempts', ['lastAttemptResults'])
  }

}
</script>
