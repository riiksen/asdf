h1 Sign In

form action="/signin" method="post"
  == csrf_tag
  .form-group
    input.form-control type="email" name="email" placeholder="Email"
  .form-group
    input.form-control type="password" name="password" placeholder="Password"
  button.btn.btn-primary.btn-sm type="submit" Sign In
hr
== link_to("Or sign in with Google", "/signin?with=google")
br
== link_to("Or with Steam", "/signin?with=steam")
br
== link_to("Or set-up an account in traditional way if you don't have an account", "/signup")
br
== link_to("Don't have an account yet?", "/signup")
