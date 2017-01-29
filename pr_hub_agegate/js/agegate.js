/**
 * Created by Mounir on 02/09/16.
 */
/**
 * @file
 * Js file for age gate.
 */

/**
 * @Note: Compress using https://jscompress.com/
 */

var country_id = null,
    search_input_field_value = "";


/**
 * Age gate core functions
 */
(function ($) {

    Drupal.behaviors.prLandingPage = {

        attach: function (context, settings) {

            if (context == document) {

                if ($('.no-agegate').length) {
                    return;
                }

                setTimeout(function () {
                    // Animation: Calculate Blocks Height.
                    var $wrapper_form_ag = $('#wrapper-form-age-gate');
                    var $block_height = $wrapper_form_ag.addClass('ag-js-calc').outerHeight();
                    $wrapper_form_ag.removeClass('ag-js-calc');

                    // Define keyframes.
                    $.keyframe.define([
                        {
                            name: 'ageGateOpen',
                            '0%': {'height': '0px'},
                            '95%': {'height': $block_height + 'px'},
                            '100%': {'height': 'auto'}
                        },
                        {
                            name: 'ageGateOpenForm',
                            '0%': {'height': '0px'},
                            '95%': {'height': $block_height + 'px'},
                            '100%': {'height': 'auto'}
                        }]);

                }, 250);

                if ($('.age-gate-second-step').length && $.pernodRicard.isMobile()) {
                    $('.age-gate-container').addClass('toggle-flex');
                    $("#abus-infos").appendTo("#wrapper-age-gate");
                }

                var $search_input = $('.age-gate-first-step .age-gate-container #wrapper-form-age-gate .pr-hub-agegate-search-form .form-item-search .edit-search');
                if (!$search_input.data('defaultText')) {
                    $search_input.data('defaultText', $search_input.attr('placeholder'));
                    $search_input.val($search_input.data('defaultText'));
                    $search_input.removeAttr('placeholder');
                }

                $search_input.on('focus', function() {
                    // check to see if the input currently equals the default before clearing it
                    if ($(this).val()==$(this).data('defaultText')) $(this).val('');
                });
                $search_input.on('blur', function() {
                    // on blur, if there is no value, set the defaultText
                    if ($(this).val()=='') $(this).val($(this).data('defaultText'));
                });

                // Text Fit: Texte Sanitaire
                function set_fontSize_texteSanitaire() {
                    var font_size = ($(window).height() + $(window).width()) * 0.01;

                    if (font_size < 10) {
                        font_size = 10;
                    }

                    $('.ag-text-sanitaire').css('font-size', font_size);
                }

                /*set_fontSize_texteSanitaire();
                 $(window).on("resize", function( ) {
                 set_fontSize_texteSanitaire();
                 });*/

                // End Text Fit: Texte Sanitaire

                $('body').on('focusin', 'input.edit-search', function (event) {
                    $('body').on('focusin', 'input.edit-search', function (event) {
                        $('.mobileAgeGateWrapper').addClass('lol');

                    });
                    $('body').on('focusout', 'input.edit-search', function (event) {
                        $('.mobileAgeGateWrapper').removeClass('lol');

                    });

                });

                $.fn.scrollTest = function () {
                    $(window).scrollTop($(".l-main").scrollTop() + 100);
                }

                if ($('.section-search-result').length) {
                    search_input_field_value = $('#edit-search-api-views-fulltext').val();
                }


                if ($('.age-gate-second-step , .age-gate-first-step').length) {
                    $('body, html').addClass('isAgeGate');
                    $('.l-main').addClass('fixWidth')
                }
                if ($('.front').length) {
                    //One Step on home page
                    if ($('.age-gate-first-step').length) {
                        $('#block-pr-hub-agegate-pr-agegate-block').addClass('hideAgeGate');
                    }
                    //Two  Steps on home page
                    if ($('.age-gate-second-step').length) {
                        $('#block-pr-hub-agegate-pr-landing-page-block #pernod-ricard-interstitiel-age-gate').remove();
                    }
                }


                if ($('.age-gate-second-step').length) {
                    $(".age-gate-second-step input").bind("input", function () {
                        var $this = $(this);
                        if (!$this.hasClass('age-gate-birthday-year')) {
                            setTimeout(function () {
                                if ($this.val().length >= parseInt($this.attr("maxlength"), 10))
                                    $this.parents('.form-item').next().find('input').focus();
                            }, 0);
                        }
                    });
                }
                if ($('.age-gate-first-step').length) {
                    $('.age-gate-first-step .form-submit').wrap('<div class="form-submit-wrapper"></div>');
                    $('.age-gate-first-step .form-submit').val("");
                }


                interstitiel.init({
                    timeout: settings.age_gate['interstitiel_seconde'] * 1000,
                    track_url: settings.age_gate.track_url,
                    cookie_lifetime: settings.age_gate.cookie_lifetime
                });
                // Show loader for age gate form
                function show_loader() {
                    window.ajaxLoader = true;
                    var html = '<div id="loader-wrapper"><div id="loader"></div></div>';
                    $('#wrapper-form-age-gate').append(html);
                    $('#loader-wrapper').show();
                }

                $('.age-gate-second-step .form-submit').on('click', function (e) {

                    show_loader();
                });

                // Geo IP Feature.
                if (country_id == null) {

                    function updateCountryFieldValue() {
                        // URL Pattern validation.
                        var path = window.location.pathname.split("/");
                        var lang = path[1];

                        if (lang.indexOf("-") > -1) {
                            var iso_code = lang.split("-");
                            if (iso_code[1].toUpperCase() == "CN") {
                                country_id = settings.age_gate.iso[iso_code[1].toUpperCase()];
                                createCookie("cc", "CN", 31536000, "/");
                            }
                        }
                        else if (lang.toUpperCase() == "ZH") {
                            country_id = settings.age_gate.iso["CN"];
                            createCookie("cc", "CN", 31536000, "/");
                        }

                        fill_up_country_field();
                    }

                    var onSuccess = function (location) {
                        window.ajaxLoader = true;
                        if (typeof location.country !== "undefined" && typeof location.country.iso_code !== "undefined") {
                            createCookie("cc", location.country.iso_code, 31536000, "/");

                            // Only if we are at the agegate form.
                            if (typeof settings.age_gate.iso !== "undefined") {
                                country_id = settings.age_gate.iso[location.country.iso_code];
                                fill_up_country_field();
                            }
                        }
                        else {
                            updateCountryFieldValue();
                        }
                        interstitiel.refreshHeadingMessage(function (d) {
                            settings.menu_local.tracking_message = d.tracking_message;
                            settings.menu_local.global_link_message = d.global_link_message;
                            settings.menu_local.interstistiel_message = d.interstistiel_message;
                            if (Cookies.get(settings.menu_local.pr_referer) != "TRUE")
                                $('.progressbar__label').html(d.interstistiel_message);
                        });
                    };

                    var onError = function (error) {
                        console.log("GEOIP ERROR: ", error);
                        updateCountryFieldValue();
                        window.ajaxLoader = true;
                        interstitiel.refreshHeadingMessage(function (d) {
                            settings.menu_local.tracking_message = d.tracking_message;
                            settings.menu_local.global_link_message = d.global_link_message;
                            settings.menu_local.interstistiel_message = d.interstistiel_message;
                            if (Cookies.get(settings.menu_local.pr_referer) != "TRUE")
                                $('.progressbar__label').html(d.interstistiel_message);
                        });
                    };

                    if (typeof geoip2 !== "undefined" && $('.pr-hub-agegate').length) {
                        window.ajaxLoader = false;
                        geoip2.country(onSuccess, onError);
                    }
                }

                //!************************!////////////


                $.pernodRicard.whenMobileResize(function () {
                    $('.age-gate-second-step ,.age-gate-first-step').removeClass('desktopAgeGateWrapper').addClass('mobileAgeGateWrapper');

                }, function () {
                    $('.age-gate-second-step ,.age-gate-first-step').removeClass('mobileAgeGateWrapper').addClass('desktopAgeGateWrapper');
                });


                // Remplir automatiquement le pays
                function fill_up_country_field() {
                    if ($("[name='age_gate[country]']").length > 0 && country_id !== null) {
                        $("[name='age_gate[country]']").val(country_id);
                        $("[name='age_gate[country]']").trigger("chosen:updated");
                    }
                }

                fill_up_country_field();
                $('#block-menu-landing-page-menu > .menu > li ').each(function () {
                    var $el = $(this).find('a'),
                        text = $el.text();
                    $el.empty().append('<span>' + text + '</span>');
                });

                var rText = $('.remember_me_txt2').text();
                $('.remember_me_txt2').remove();
                $('.form-item-age-gate-save-me').append('<br><span class="remember_me_txt2">' + rText + '</span>');

                //Numeric validation
                $('.edit-age-gate-birthday .form-item input ').each(function () {
                    //  $(this).numeric({ negative: false }, function() { console.log("No negative values"); this.value = ""; this.focus(); });
                });


                $("#targetAgeGateWrapperId .menu a").addClass("landing-page-link");

                $('.lp-link-home').on('click', function () {

                    $(".age-gate-first-step").remove();
                    //interstitiel.lockScroll();

                    //IsAge Gate and lp
                    if ($('.age-gate-second-step').length) {
                        $('#block-pr-hub-agegate-pr-agegate-block').fadeIn().removeClass('hideAgeGate');
                        $('#block-pr-hub-agegate-pr-landing-page-block').fadeOut();
                    }
                    ///Is lp only
                    else {
                        $('.l-page-age-gate').removeClass('testAgeGatePage');
                        $('body, html').removeClass('isAgeGate');
                        $('.l-main').removeClass('fixWidth');
                        agegate_set_session(Drupal.settings.session_link + 'lp');
                        setTimeout(function () {
                            if (Cookies.get(settings.menu_local.pr_referer) == "TRUE") {
                                _show_redirect_interstitiel();
                            }
                            else {
                                interstitiel.show();
                            }
                            interstitiel.saveCookie();
                        }, 100);
                    }


                    return false;
                });


                function _val2key(val, array) {
                    for (var key in array) {
                        this_val = array[key];
                        if (this_val == val) {
                            return key;
                            break;
                        }
                    }
                }

                $("#edit-age-gate-country").change(function () {
                    createCookie("cc", _val2key($("#edit-age-gate-country").val(), settings.age_gate.iso), 31536000, "/");
                    interstitiel.refreshHeadingMessage(function (d) {
                        settings.menu_local.tracking_message = d.tracking_message;
                        settings.menu_local.global_link_message = d.global_link_message;
                        settings.menu_local.interstistiel_message = d.interstistiel_message;
                        if (Cookies.get(settings.menu_local.pr_referer) != "TRUE")
                            $('.progressbar__label').html(d.interstistiel_message);
                    });
                });

                if ($('.age-gate-second-step ,.age-gate-first-step').length) {
                    if (!$.pernodRicard.isMobile()) {
                        $('.age-gate-second-step ,.age-gate-first-step').addClass('desktopAgeGateWrapper');
                    }
                    else {
                        $('.age-gate-second-step ,.age-gate-first-step').addClass('mobileAgeGateWrapper');
                    }
                }
                $('a.landing-page-link').not('.lp-link-home').click(function () {
                    Cookies.set('passed_landing_page', 'TRUE', {expires: 30});
                });

                setTimeout(function () {
                    $('.age-gate-container').addClass('toggle-flex');
                    $('#wrapper-form-age-gate').addClass('open');
                    $('#pernod-age-gate-title').addClass('fixThis');
                    if ($.pernodRicard.isMobile()) {
                        $("#abus-infos").appendTo("#wrapper-age-gate");
                        $('#pernod-age-gate-title').remove();
                    }
                }, $('.age-gate-second-step').length ? 500 : 4000);
            }

            $.fn.search_set_cookie = function () {
                createCookie("pr_landing_page_save_me", "true", Drupal.settings.cookie_lifetime, "/");
            };

            $.fn.agegate_set_cookie = function () {
                createCookie("pr_age_gate_save_me", "true", Drupal.settings.cookie_lifetime, "/");
            };

            $.fn.agegate_update_country_cookie = function (country) {
                createCookie("cc", country, Drupal.settings.cookie_lifetime, "/");
            };

            $.fn.show_interstitiel = function () {
                interstitiel.show();
                interstitiel.saveCookie();
            };

            function _show_redirect_interstitiel() {
                //console.log("_show_redirect_interstitiel", Cookies.get(settings.menu_local.pr_referer));
                if (Cookies.get(settings.menu_local.pr_referer) == "TRUE") {
                    var message = '';

                    if (settings.menu_local.is_local_section) {
                        var t1 = Drupal.t("<p class='age-gate-small'>You’re being redirected to our "),
                            t2 = "<strong>" + settings.menu_local.current_ls + "</strong>",
                            t3 = Drupal.t(" section.</p><p class='age-gate-large'>Enjoy your visit !</p>");
                        message = t1 + t2 + t3;
                    }
                    else {
                        message = settings.menu_local.global_link_message;
                    }

                    $('.progressbar__label').html(message);
                    interstitiel.show();
                    Cookies.set(settings.menu_local.pr_referer, 'FALSE', {expires: 30});
                }
            }

            $.fn.show_redirect_interstitiel = function () {
                //console.log("$.fn.show_redirect_interstitiel", Cookies.get(settings.menu_local.pr_referer));
                _show_redirect_interstitiel();
            };
            // call hook menu callback function to set session variables
            var setFront = false;

            function agegate_set_session(path, current_page_url) {
                if (typeof current_page_url == "undefined") {
                    current_page_url = "";
                }
                path += '?time=' + Math.floor(Date.now() / 1000);
                window.ajaxLoader = false;
                $.ajax({
                    url: path,
                    type: 'POST',
                    data: {current_page_url: current_page_url},
                    success: function (msg) {
                        if (msg == "false") {
                            console.log("error");
                        }
                        else {
                            if ($('.body-marque-strategique').length) {
                                runMarque();
                            }
                            else if ($('.section-search-result').length) {
                                window.UISearch.reset();
                                window.UISearch.closeMenu();
                                window.UISearch.cleanUp();
                                window.UISearch.hideInputLayer();
                                $('#edit-search-api-views-fulltext').val(search_input_field_value);
                                setTimeout(function () {
                                    window.UISearch.postprocess();
                                }, 1300);
                            }
                            if ($('.front').length && !setFront) {
                                agegate_set_session(Drupal.settings.session_link + 'lp/');
                                setFront = true;
                            }
                        }
                        window.ajaxLoader = true;
                    }
                });
            }

            $.fn.agegate_set_session = function (path, current_page_url) {
                agegate_set_session(path, current_page_url);
            };

            $.fn.refresh_interstitiel = function () {
                interstitiel.refreshHeadingMessage(function (d) {
                    settings.menu_local.tracking_message = d.tracking_message;
                    settings.menu_local.global_link_message = d.global_link_message;
                    settings.menu_local.interstistiel_message = d.interstistiel_message;
                });
            };
        }


    };

})(jQuery);