<template>
  <v-container>
      <v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPwd ? 'text' : 'password'"
            v-model="password"
            class="input-group--focused"
            @click:append="showPwd = !showPwd"
            :rules="pwdRules"
            label="Password"
            required
          ></v-text-field>
        </v-col>

        <v-col
          class="text-center"
          cols="12"
          sm="4"
        >
          <div class="my-2">
            <v-btn color="primary"
              @click="loginAction"
            >Submit</v-btn>
          </div>
        </v-col>
      </v-col>
  </v-container>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',

  data: () => ({
    loggedIn: false,
    errorLogin: '',
    showPwd: false,
    password: '',
    pwdRules: [
      v => !!v || 'Password is required'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ]
  }),
  methods: {
    // import login action from user module
    ...mapActions('user', ['login']),

    async loginAction () {
      const { email, password } = this

      await this.login({ email, password })

      if (this.isAuthenticated) {
        this.$router.replace({ name: 'modulesPage' })
      } else {
        console.log('error')
      }
    }
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated'])
  }
}
</script>
