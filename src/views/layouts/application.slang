doctype html
html
  head
    title asdf
    meta charset="utf-8"
    meta name="viewport" content="width=device-width, initial-scale=1"

    / Le styles
    link rel="stylesheet" href="/assets/main.bundle.css"

    / Fav and touch icons
    link rel="icon" href="/favicon.png"
    link rel="icon" type="image/x-icon" href="/favicon.ico"

  body
    .navbar.navbar-inverse
      .navbar-inner
        .container-fluid
          == render(partial: "layouts/_nav.slang")


    .container-fluid
      .row-fluid
        - flash.each do |key, value|
          div class="alert alert-#{key}" = flash[key]
      .row-fluid
        == content

    / Le javascript
    / =============================================
    / Placed at the end of the document so the pages load faster
    script src="https://code.jquery.com/jquery-3.3.1.min.js"
    script src="/assets/main.bundle.js"
