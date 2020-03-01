<template>
  <v-container>
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
            @click="login"
          >Submit</v-btn>
        </div>
      </v-col>

  </v-container>

</template>

<script>
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
  methods: { // redirect using <router-link to="zesodvxc"/>
    async login () {
      const { email, password } = this
      try {
        const result = await this.axios.post('http://localhost:3000/api/v1/login', {
          username: email,
          password
        })
        this.$root.user = result.data
        this.loggedIn = true
        this.$router.replace({ name: 'homePage' })
      } catch (err) {
        this.errorLogin = err
      }
    }
  }
}
</script>
