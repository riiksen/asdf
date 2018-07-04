.container
  form.form-signin action="/signup" method="post"
    h2.form-signin-heading Register
    == csrf_tag
    input.input-block-level type="email" name="email" placeholder="Email"
    input.input-block-level type="text" name="username" placeholder="Username"
    input.input-block-level type="password" name="password" placeholder="Password"
    input.input-block-level type="password" name="confirm_password" placeholder="Confirm password"
    button.btn.btn-large.btn-primary name="submit" type="submit" Register
hr
== link_to("Already have an account?", "/signin")
