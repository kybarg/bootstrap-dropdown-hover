/* ========================================================================
 * Bootstrap: dropdownhover.js v1.1.x
 * http://kybarg.github.io/bootstrap-dropdown-hover/
 * ========================================================================
 * Licensed under MIT (https://github.com/kybarg/bootstrap-dropdown-hover/blob/master/LICENSE)
 * ======================================================================== */

+function($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop';

    var Dropdownhover = function(element, options) {
        this.options  = options;
        this.$element = $(element);

        var that = this;

        // defining if navigation tree or single dropdown
        if (this.$element.hasClass('dropdown-toggle')) {
            this.dropdowns = this.$element.parent().find('.dropdown-menu').parent('.dropdown');
        } else {
            this.dropdowns = this.$element.find('.dropdown');
        }

        // this.dropdowns contains all "li" elements which have a submenu

        // this.options contains a onClick property which contains that the actual browser fires touch events, but this isn't used

        this.dropdowns.each(function() {

            $(this).children('a, button').on('touchstart', function(e) {

                // console.log('Dropdownhover - options.onClick - touchstart');

                $(this).attr('data-touchstart-event', 'true');

            }).on('click', function(e) {

                // console.log('Dropdownhover - options.onClick - click', e);

                var touchstartEvent = $(this).attr('data-touchstart-event');

                if (touchstartEvent === 'true') {

                    var isActive = $(this).parent().hasClass('open');
                    var showMenu = $(this).attr('data-show-menu');
                    if (!isActive && showMenu !== 'true') {
                        that.show($(this));
                        e.preventDefault();

                        // Hack: Stop immediate to disable all followed event handlers, to stop that bootstrap offcanvas
                        // can interfer with the menu. This will also stop all further event handler.
                        e.stopImmediatePropagation();

                    } else {
                        var href = $(this).attr('href');
                        if (!href) {
                            that.hide($(this));
                        }
                    }

                    // console.log('Dropdownhover - options.onClick - click - touched', e);
                }

            });

            $(this).on('mouseenter.bs.dropdownhover', function(e) {

                // console.log('Dropdownhover - !options.onClick - mouseenter.bs.dropdownhover', e.target);

                that.show($(this).children('a, button'))

            }).on('mouseleave.bs.dropdownhover', function(e) {

                // console.log('Dropdownhover - !options.onClick - mouseleave.bs.dropdownhover', e.target);

                that.hide($(this).children('a, button'))

            })
        })

    };

    Dropdownhover.TRANSITION_DURATION = 300;
    Dropdownhover.DELAY_SHOW          = 250;
    Dropdownhover.DELAY_HIDE          = 800;
    Dropdownhover.TIMEOUT_SHOW;
    Dropdownhover.TIMEOUT_HIDE;

    Dropdownhover.DEFAULTS = {
        onClick:    false,
        animations: [
            'fadeInDown',
            'fadeInRight',
            'fadeInUp',
            'fadeInLeft'
        ]
    };

    /**
     * @param $this
     *
     * @returns {*}
     */
    function getParent($this) {
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(document).find(selector);

        return $parent && $parent.length ? $parent : $this.parent()
    }

    /**
     * @param e
     */
    function clearMenus(e) {
        if (e && e.which === 3) {
            return;
        }

        $(backdrop).remove();
        $('[data-hover="dropdown"]').each(function() {
            var $this         = $(this);
            var $parent       = getParent($this);
            var relatedTarget = { relatedTarget: this };

            if (!$parent.hasClass('open')) {
                return;
            }

            if (
                e
                &&
                e.type === 'click'
                &&
                /input|textarea/i.test(e.target.tagName)
                &&
                $.contains($parent[0], e.target)
            ) {
                return;
            }

            $parent.trigger(e = $.Event('hide.bs.dropdownhover', relatedTarget));

            if (e.isDefaultPrevented()) {
                return;
            }

            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdownhover', relatedTarget))
        })
    }

    /**
     * Opens dropdown menu when mouse is over the trigger element.
     *
     * @param _dropdownLink
     *
     * @returns {boolean}
     */
    Dropdownhover.prototype.show = function(_dropdownLink) {

        var that  = this;
        var $this = $(_dropdownLink);

        window.clearTimeout(Dropdownhover.TIMEOUT_HIDE);

        Dropdownhover.TIMEOUT_SHOW = window.setTimeout(function() {

            // close all dropdowns
            $('.dropdown').not($this.parents()).each(function() {
                $(this).removeClass('open')
            });

            var effect = that.options.animations[0];

            if ($this.is('.disabled, :disabled')) {
                return;
            }

            var $parent  = $this.parent();
            var isActive = $parent.hasClass('open');

            if (!isActive) {

                if ('ontouchstart' in document.documentElement && $parent.closest('.navbar-nav').length > 0) {

                    // if mobile we use a backdrop because click events don't delegate
                    //
                    // it will also be append to the dom multiple times, but if you click on the menu entry the site
                    // will be reloaded or if you click outsite of the menu all dom elements will be removed
                    $(document.createElement('div'))
                        .addClass('dropdown-backdrop')
                        .on('click', clearMenus)
                        .appendTo('body');
                }

                var $dropdown = $this.next('.dropdown-menu');

                $parent.addClass('open');
                $this.attr('aria-expanded', true);

                // Ensures that all menus that are closed have proper aria tagging.
                $parent.siblings().each(function() {
                    if (!$(that).hasClass('open')) {
                        $(that).find('[data-hover="dropdown"]').attr('aria-expanded', false);
                    }
                });

                var side = that.position($dropdown);

                switch (side) {
                    case 'top':
                        effect = that.options.animations[2];
                        break;
                    case 'right':
                        effect = that.options.animations[3];
                        break;
                    case 'left':
                        effect = that.options.animations[1];
                        break;
                    default:
                        effect = that.options.animations[0];
                        break;
                }

                $dropdown.addClass('animated ' + effect);

                var transition = $.support.transition && $dropdown.hasClass('animated');

                transition ?
                    $dropdown
                        .one('bsTransitionEnd', function() {
                            $dropdown.removeClass('animated ' + effect)
                        })
                        .emulateTransitionEnd(Dropdownhover.TRANSITION_DURATION) :
                    $dropdown.removeClass('animated ' + effect)
            }

        }, Dropdownhover.DELAY_SHOW);

        return false
    };

    /**
     * Closes dropdown menu when mouse is out of it.
     *
     * @param _dropdownLink
     */
    Dropdownhover.prototype.hide = function(_dropdownLink) {

        var $this   = $(_dropdownLink);
        var $parent = $this.parent();

        window.clearTimeout(Dropdownhover.TIMEOUT_SHOW);

        Dropdownhover.TIMEOUT_HIDE = window.setTimeout(function() {

            $parent.removeClass('open');
            $this.attr('aria-expanded', false)

        }, Dropdownhover.DELAY_HIDE);
    };

    /**
     * Calculating position of dropdown menu.
     *
     * @param dropdown
     *
     * @returns {string}
     */
    Dropdownhover.prototype.position = function(dropdown) {

        var win = $(window);

        // reset css to prevent incorrect position
        dropdown.css({
            bottom: '',
            left:   '',
            top:    '',
            right:  ''
        }).removeClass('dropdownhover-top');

        var viewport    = {
            top:  win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right  = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = dropdown.offset();
        if (bounds === undefined) {
            // fallback hack
            side = 'right';
            return side;
        }
        bounds.right    = bounds.left + dropdown.outerWidth();
        bounds.bottom   = bounds.top + dropdown.outerHeight();
        var position    = dropdown.position();
        position.right  = bounds.left + dropdown.outerWidth();
        position.bottom = bounds.top + dropdown.outerHeight();

        var side = '';

        var isSubnow = dropdown.parents('.dropdown-menu').length;

        if (isSubnow) {

            if (position.left < 0) {
                side = 'left';
                dropdown.removeClass('dropdownhover-right').addClass('dropdownhover-left')
            } else {
                side = 'right';
                dropdown.addClass('dropdownhover-right').removeClass('dropdownhover-left')
            }

            if (bounds.left < viewport.left) {
                side = 'right';
                dropdown.css({
                    left:  '100%',
                    right: 'auto'
                }).addClass('dropdownhover-right').removeClass('dropdownhover-left')
            } else if (bounds.right > viewport.right) {
                side = 'left';
                dropdown.css({
                    left:  'auto',
                    right: '100%'
                }).removeClass('dropdownhover-right').addClass('dropdownhover-left')
            }

            if (bounds.bottom > viewport.bottom) {
                dropdown.css({
                    bottom: 'auto',
                    top:    -(bounds.bottom - viewport.bottom)
                })
            } else if (bounds.top < viewport.top) {
                dropdown.css({
                    bottom: -(viewport.top - bounds.top),
                    top:    'auto'
                })
            }

        } else { // defines special position styles for root dropdown menu

            var parentLi   = dropdown.parent('.dropdown');
            var pBounds    = parentLi.offset();
            pBounds.right  = pBounds.left + parentLi.outerWidth();
            pBounds.bottom = pBounds.top + parentLi.outerHeight();

            if (bounds.right > viewport.right) {
                var styleTmp = dropdown.attr('style');
                // keep css if "auto !important" is used
                if (
                    styleTmp
                    &&
                    (
                        styleTmp.indexOf('left: auto !important;') === -1
                        &&
                        styleTmp.indexOf('right: auto !important;') === -1
                    )
                ) {
                    dropdown.css({
                        left:  -(bounds.right - viewport.right),
                        right: 'auto'
                    });
                }
            }

            if (
                bounds.bottom > viewport.bottom
                &&
                (pBounds.top - viewport.top) > (viewport.bottom - pBounds.bottom)
                ||
                dropdown.position().top < 0
            ) {
                side = 'top';
                dropdown.css({
                    bottom: '100%',
                    top:    'auto'
                }).addClass('dropdownhover-top').removeClass('dropdownhover-bottom')
            } else {
                side = 'bottom';
                dropdown.addClass('dropdownhover-bottom')
            }
        }

        return side;

    };


    // DROPDOWNHOVER PLUGIN DEFINITION
    // ==========================

    /**
     * @param option
     *
     * @returns {*}
     *
     * @constructor
     */
    function Plugin(option) {
        return this.each(function() {
            var $this    = $(this);
            var data     = $this.data('bs.dropdownhover');
            var settings = $this.data();

            if ($this.data('animations') !== undefined && $this.data('animations') !== null) {
                settings.animations = $.isArray(settings.animations) ? settings.animations : settings.animations.split(' ');
            }

            var options = $.extend({}, Dropdownhover.DEFAULTS, settings, typeof option == 'object' && option);

            if (!data) {
                $this.data('bs.dropdownhover', (data = new Dropdownhover(this, options)));
            }

        })
    }

    var old = $.fn.dropdownhover;

    $.fn.dropdownhover             = Plugin;
    $.fn.dropdownhover.Constructor = Dropdownhover;

    // DROPDOWNHOVER NO CONFLICT
    // ====================
    $.fn.dropdownhover.noConflict = function() {
        $.fn.dropdownhover = old;
        return this
    };

    // APPLY TO STANDARD DROPDOWNHOVER ELEMENTS
    // ===================================
    $(document).ready(function() {
        $('[data-hover="dropdown"]').each(function() {
            var $target = $(this);
            if ('ontouchstart' in document.documentElement) {
                Plugin.call($target, $.extend({}, $target.data(), { onClick: true }))
            } else {
                Plugin.call($target, $target.data())
            }
        })
    })

}(jQuery);
