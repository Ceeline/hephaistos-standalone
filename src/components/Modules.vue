<template>
    <v-container>
        <div
            v-for="module in modules" :key="module.id"
        >
            <v-row>
                <v-btn
                    text
                    @click="openModuleView(module.id)">{{ module.name }}</v-btn>
            </v-row>

            <v-row>
                <v-col
                    v-for="session in sessions" :key="session.id"
                >
                    <v-card
                        max-width="200"
                        color='#484e4a'
                    >
                        <v-card-text
                        class=text-center>{{ session.name }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>

        </div>
    </v-container>
</template>

<script>

import { mapActions, mapState } from 'vuex' // , mapGetters

export default {
  name: 'Modules',

  data: () => ({
  }),
  methods: {
    ...mapActions('modules', ['fetchModules']),
    ...mapActions('sessions', ['fetchSessionsForModule']),
    openModuleView (idModule) {
      this.$router.replace({ name: 'modulePage', params: { id: idModule } })
    }
  },
  async mounted () {
    // get modules
    await this.fetchModules()
    console.log('module: ' + JSON.stringify(this.modules))

    // get sessions by modules
    await Promise.all(
      this.modules.map(m => this.fetchSessionsForModule({ moduleId: m.id }))
    )
    console.log('session: ' + JSON.stringify(this.sessions))
  },
  computed: {
    ...mapState('modules', ['modules']),
    ...mapState('sessions', ['sessions'])
  }
}
</script>
