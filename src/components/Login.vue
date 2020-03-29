<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="3">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          />

          <v-text-field
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPwd ? 'text' : 'password'"
            v-model="password"
            class="input-group--focused"
            @click:append="showPwd = !showPwd"
            :rules="pwdRules"
            label="Password"
            required
          />

          <v-btn color="primary"
            @click="loginAction"
          >Se connecter</v-btn>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'Login',

  data: () => ({
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

      try {
        await this.login({ email, password })
        this.$router.push({ name: 'modulesPage' })
      } catch (err) {
        console.log('error')
      }
    }
  }
}
</script>
