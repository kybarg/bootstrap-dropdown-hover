$(function() {
    var win = $(window),
        body = $(document.body);
    body.scrollspy({
        target: ".bs-docs-sidebar"
    }), win.on("load", function() {
        body.scrollspy("refresh")
    }), $(".bs-docs-container [href=#]").click(function(e) {
        e.preventDefault()
    }), setTimeout(function() {
        var sidebar = $(".bs-docs-sidebar");
        sidebar.affix({
            offset: {
                top: function() {
                    var offsetTop = sidebar.offset().top,
                        marginTop = parseInt(sidebar.children(0).css("margin-top"), 10),
                        navHeight = $(".bs-docs-nav").height();
                    return this.top = offsetTop - navHeight - marginTop
                },
            }
        })
    }, 100), setTimeout(function() {
        $(".bs-top").affix()
    }, 100);


    $('.animations-select').on('click', function () {
        $this = $(this)
        $($this.data('target')).html($this.val())
        $('#bs-example-navbar-collapse-animations').data('bs.dropdownhover').options.animations[$this.closest('.col-sm-3').index()] = $this.val()
    })

})
