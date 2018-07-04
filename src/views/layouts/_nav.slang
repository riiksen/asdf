button.btn.btn-navbar type="button" data-toggle="collapse" data-target=".nav-collapse"
a.brand href="/" Brand
.nav-collapse.collapse
  ul.nav
    - active = context.request.path == "/" ? "active" : ""
    li class="#{active}": a href="/" Home
    - if (current_user = context.current_user)
      li: a href="/signout" Signout
      - active = context.request.path == "/profile" ? "active" : ""
      li class="#{active}": a href="/profile" = current_user.email
    - else
      - active = context.request.path == "/signup" ? "active" : ""
      li class="#{active}": a href="/signup" Sign Up
      - active = context.request.path == "/signin" ? "active" : ""
      li class="#{active}": a href="/signin" Sign In
