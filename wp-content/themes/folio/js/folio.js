$(function() {
    "use strict";
    var t = $("#smoothscroll"),
        e = {
            debug: !1,
            trigger_container: $(document),
            anchors: "a[href]",
            scroll: !1,
            cacheLength: 20,
            prefetch: !1,
            onBefore: function(t, e) {
                Website._transition._init()
            },
            onStart: {
                render: function(t, e) {
                    Website._transition.begin_transition(e)
                }
            },
            onReady: {
                render: function(t, e, i, n) {
                    Website._transition.end._init(e, n)
                }
            }
        };
    Website._functions.internet_explorer() ? window.location = "/internet-explorer" : (Website._smoothState = t.smoothState(e).data("smoothState"), Website._init(!0))
});
var Website = {
        _register: {
            controllers: [],
            data: {},
            queries: [],
            transition: {
                container: $("#smoothscroll"),
                project: !1,
                type: "standard"
            }
        },
        _init: function(t) {
            this._controllers(t), this._base(t), t && this._events()
        },
        _base: function(t) {
            t ? ($.each(["mobile", "tablet", "laptop", "desktop", "laptop_desktop_only", "laptop_desktop_touch", "laptop_desktop_notouch"], function(t, e) {
                $("body").append('<code class="device" id="_' + e + '"></code>')
            }), SmoothScroll._init(!0), setTimeout(function() {
                $("header").removeClass("transition")
            }, 10), $('header a[href="#"]').attr("href", "/"), Website._functions.text_reveal()) : SmoothScroll.reset(), Website._resize._init(!0), Website._scroll._init(!0), Website._functions.images(), $("header div.container > a").toggleClass("no-touch", !!$("#services").length)
        },
        _controllers: function(t) {
            Website._register.controllers.length = 0, $("[controller]").each(function() {
                var e = $(this).attr("controller").replace(/-/g, " ").replace(/\w\S*/g, function(t) {
                    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
                }).replace(/ /g, "");
                "object" == typeof window[e] && -1 == $.inArray(e, Website._register.controllers) && (Website._register.controllers.push(e), window[e]._init(t))
            });
            var e = 0;
            $("#main").on("touchstart", function(t) {
                e = t.originalEvent.touches[0].clientY
            }), $("#main").on("touchmove", function(t) {
                var i = t.originalEvent.touches[0].clientY,
                    n = $(t.currentTarget).scrollTop(),
                    o = e - i < 0 ? "up" : "down";
                (n <= 0 && "up" == o || n >= t.currentTarget.scrollHeight - $("#main").height() && "down" == o) && t.preventDefault(), e = i
            })
        },
        _events: function(t) {
            $(document).bind("mousewheel touchstart touchmove", function(t) {
                $("html, body, #main").stop()
            }), $(window).on("resize", function() {
                Website._resize._init(!1)
            }), $(window).on("scroll", function() {
                Website._scroll._init(!1)
            }), $(document).on("vclick", "header button", function() {
                Website._interaction.menu.toggle()
            }), $(document).on("vclick", "header.nav nav a", function(t) {
                Website._interaction.menu.transition($(this), t)
            }), $(document).on("vclick", function() {
                Website._interaction.accessibility.clear()
            }), $(document).on("keydown", function() {
                Website._interaction.accessibility.keydown(event)
            })
        },
        _events_unload: function() {
            $.each(Website._register.controllers, function(t, e) {
                window[e]._events_unload()
            })
        },
        _functions: {
            images: function() {
                $("video[video-src]").length && setTimeout(function() {
                    $("video[video-src]").each(function(t, e) {
                        $(e).attr("webm") ? $(e).append('<source src="' + $(e).attr(Website._functions.video_format() ? "data-hevc" : "data-webm") + '">') : $(e).append('<source src="' + $(e).attr("video-src") + '" type="video/mp4">'), $(e).removeAttr("video-src")
                    })
                }, 1e3), this.webp(), $("[data-src]:not([src])").each(function(t) {
                    $(this).attr("src", $(this).attr("data-src").replace(/.webp/g, "")).removeAttr("data-src")
                }), $("[data-srcset]:not([srcset])").each(function() {
                    $(this).attr("srcset", $(this).attr("data-srcset").replace(/.webp/g, "")).removeAttr("data-srcset")
                }), $("[data-style]").each(function() {
                    $(this).attr("style", $(this).attr("data-style").replace(/.webp/g, "")).removeAttr("data-style")
                })
            },
            internet_explorer: function() {
                return window.navigator.userAgent.indexOf("MSIE ") > 0 || window.navigator.userAgent.indexOf("Trident/") > 0
            },
            lighthouse: function() {
                return window.navigator.userAgent.toLowerCase().indexOf("lighthouse") > 0
            },
            text_reveal: function() {
                $(".text-reveal:not(.set)").each(function() {
                    html = "", $.each($.trim($(this).text()).split("\n"), function(t, e) {
                        $.each($.trim(e).split(" "), function(i, n) {
                            html += (t && !i ? "\n" : "") + "<span><sub>" + n + (i < $.trim(e).split(" ").length - 1 ? " " : "") + "</sub></span>"
                        })
                    }), $(this).addClass("set").html(html).find("span").each(function(t) {
                        $(this).get(0).style.setProperty("--index", t)
                    }), $(this).find("span:last sub").text($.trim($(this).find("span:last sub").text()))
                })
            },
            video_format: function() {
                const t = window.navigator,
                    e = t.userAgent.toLowerCase(),
                    i = !(!t.mediaCapabilities || !t.mediaCapabilities.decodingInfo);
                return -1 != e.indexOf("safari") && !(-1 != e.indexOf("chrome")) && -1 != e.indexOf("version/") && i
            },
            webp: function() {
                var t = document.createElement("canvas");
                return !(!t.getContext || !t.getContext("2d")) && 0 == t.toDataURL("image/webp").indexOf("data:image/webp")
            }
        },
        _interaction: {
            accessibility: {
                clear: function() {
                    $("[focus]").removeAttr("focus")
                },
                keydown: function(t) {
                    if (9 == t.keyCode) {
                        if (t.preventDefault(), Website._register.focus_timer) return;
                        $elements = $('[tabindex="0"]'), $element = $elements[0], $elements.each(function(t) {
                            $(this).is("[focus]") && void 0 !== $elements[t + 1] && ($element = $elements[t + 1])
                        }), $("[focus]").removeAttr("focus"), $element = $($element), $element.attr("focus", !0), $element.tab_position = $element.attr("tabposition") ? "bottom" == $element.attr("tabposition") ? SmoothScroll._attributes.document.height - $(window).height() : $element.attr("tabposition") : $element.offset().top - ("center" == $element.attr("tabalignment") ? $(window).height() / 2 : "bottom" == $element.attr("tabalignment") ? $(window).height() : 0), $element.tab_position != $(window).scrollTop() ? (clearTimeout(Website._register.focus_timer), Website._register.focus_timer = setTimeout(function() {
                            $element.focus(), Website._register.focus_timer = !1
                        }, 1e3), $("html, body").stop().animate({
                            scrollTop: $element.tab_position
                        }, 800, "easeInOutCirc")) : $element.focus()
                    }
                }
            },
            menu: {
                toggle: function() {
                    if (!$("header").prop("transition")) switch ($("header").prop("transition", !0).prop("transition-end", setTimeout(function() {
                        $("header").removeProp("transition").removeProp("transition-end")
                    }, 800)), $("header").hasClass("nav")) {
                        case !0:
                            $("header").addClass("remove-nav").removeClass("nav"), setTimeout(function() {
                                $("body").removeClass("transition"), $("header").removeClass("remove-nav")
                            }, 200), $("html, body").animate({
                                scrollTop: $("header").prop("top")
                            }, 0);
                            break;
                        case !1:
                            $("body").addClass("transition"), $("header").addClass("nav").prop("top", $(window).scrollTop())
                    }
                },
                transition: function(t, e) {
                    e.preventDefault(), t.attr("href") == window.location.pathname ? (Website._transition.scroll_to_top(), e.stopPropagation()) : ($("header").addClass("remove-nav transition-nav").removeClass("nav"), Website._register.transition.type = "menu", Website._smoothState.load(t.attr("href")))
                }
            }
        },
        _resize: {
            _init: function(t) {
                t && setTimeout(function() {
                    $("body").addClass("ready")
                }, 100), $.each(Website._register.controllers, function(t, e) {
                    "object" == typeof window[e]._resize && "function" == typeof window[e]._resize._init && window[e]._resize._init()
                }), this.get_measurements(t), setTimeout(function() {
                    Website._resize.get_measurements(t)
                }, 50), setTimeout(function() {
                    Website._resize.get_measurements(t)
                }, 100), setTimeout(function() {
                    Website._resize.get_measurements(t)
                }, 150), $("#_laptop_desktop_only:visible").length && $("header").hasClass("nav") && ($("body").addClass("work-transition"), setTimeout(function() {
                    $("body").removeClass("transition work-transition"), $("header").removeClass("nav")
                }, 1)), t || Website._scroll._init()
            },
            get_measurements: function(t) {
                if (t || $("#_laptop_desktop_notouch:visible").length || Math.max(document.documentElement.clientWidth, 320) != Website._register.width) {
                    Website._register.width = Math.max(document.documentElement.clientWidth, 320);
                    let t = .01 * window.innerHeight;
                    document.documentElement.style.setProperty("--vh_fixed", `${t}px`)
                }
                let e = Math.max(document.documentElement.clientWidth, 320),
                    i = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--columns")),
                    n = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--gutter")),
                    o = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--margin")),
                    s = .01 * window.innerHeight;
                document.documentElement.style.setProperty("--vh", `${s}px`);
                let r = .01 * e;
                document.documentElement.style.setProperty("--vw", `${r}px`);
                let a = Math.min(e, 1600) - 2 * o;
                document.documentElement.style.setProperty("--grid_max", `${a}px`);
                let l = (Math.min(e, 1600) - 2 * o + n) / i;
                document.documentElement.style.setProperty("--col_max", `${l}px`)
            }
        },
        _scroll: {
            _init: function(t) {
                this.blacklist(), $.each(Website._register.controllers, function(t, e) {
                    "object" == typeof window[e]._scroll && "function" == typeof window[e]._scroll._init && window[e]._scroll._init()
                })
            },
            blacklist: function() {
                Website._smoothState.blacklist("#work-thumbs a, #work-next a, #project-transition a, .no-smoothState, header.nav nav a")
            }
        },
        _transition: {
            _init: function() {
                $("header").addClass("transition-nav").removeClass("nav"), Website._events_unload(), SmoothScroll.lock(), ["project", "work"].includes(Website._register.transition.type) || $("body, header").addClass("transition")
            },
            begin_transition: function(t) {
                if (!["project", "work"].includes(Website._register.transition.type) && (Website._register.transition.project = void 0 !== projects[t.split("/").pop()] ? projects[t.split("/").pop()] : "", Website._register.transition.duration = void 0 !== projects[t.split("/").pop()] ? 2400 : "agency" == t.split("/").pop() ? 600 : 1e3, Website._register.transition.project)) {
                    let t = $.map(Website._register.transition.project.split(" "), function(t, e) {
                        return "<span><sub>" + t + (e < Website._register.transition.project.split(" ").length - 1 ? " " : "") + "</sub></span>"
                    }).join("");
                    $("#transition strong").html(t).prop("reveal", setTimeout(function() {
                        $("#transition strong").addClass("reveal")
                    }, 810))
                }
            },
            end: {
                _init: function(t, e) {
                    Website._events_unload(), SmoothScroll.unload(), $("body").removeClass("init"), "project" == Website._register.transition.type ? this.project(t, e) : "work" == Website._register.transition.type ? this.work(t, e) : this.standard(t, e), Website._register.transition.type = !1
                },
                standard: function(t, e) {
                    Website._register.transition.container.html(t), Website._functions.text_reveal(), setTimeout(function() {
                        $("body").removeClass("transition"), $("#project-transition").removeClass("active"), Website._resize._init(!0)
                    }, 200), setTimeout(function() {
                        $("#transition strong").removeClass("reveal").html("")
                    }, 800), setTimeout(function() {
                        $("header").removeClass("transition remove-nav transition-nav"), $("body").toggleClass("white", !!$("#profile-main").length), $("#main").toggleClass("no-scroll", !!$("#work-thumbs").length), $("header").toggleClass("dark", !!$("#profile-main").length), $("footer").attr("scroll", $("#profile-main").length ? "menu" : "no-menu"), $("footer").attr("scroll", "menu")
                    }, 800), setTimeout(function() {
                        Website._init(!1)
                    }, 1e3), this.complete(e)
                },
                project: function(t, e) {
                    Website._register.transition.container.html(t), setTimeout(function() {
                        $("#project-transition").removeClass("transition complete"), $("header").removeClass("transition remove-nav transition-nav scroll"), Website._init(!1)
                    }, 300)
                },
                work: function(t, e) {
                    Website._register.transition.container.html(t), $("body").removeClass("transition work-transition").prop("clear_project", setTimeout(function() {
                        $("#transition strong").removeClass("reveal").html("")
                    }, 800)).find("header").removeClass("transition remove-nav transition-nav"), Website._init(!1), this.complete(e)
                },
                
            },
            scroll_to_top: function() {
                $("html, body").animate({
                    scrollTop: 0
                }, .1 === SmoothScroll._attributes.transition.ease ? 800 : 1200, .1 === SmoothScroll._attributes.transition.ease ? "easeInOutCirc" : "easeInOutQuad"), $("header").addClass("remove-nav transition-nav").removeClass("nav"), setTimeout(function() {
                    $("body").removeClass("transition").find("header").removeClass("transition remove-nav transition-nav")
                }, 800)
            }
        }
    },
    Homepage = {
        _register: {
            loaded: !1,
            projects: !1
        },
        _init: function(t) {
            this._base(t), this._events()
        },
        _base: function(t) {
            t && !Website._functions.lighthouse() || ($("#loader").remove(), $("#services h1").addClass("reveal")), $("#loader").length && $("#loader picture").length > 3 && $('#loader picture[loader!="' + (Math.floor(3 * Math.random()) + 1) + '"]').remove(), $(window).load(function() {
                $("#loader").length ? (SmoothScroll.lock(), $("#loader").addClass("ready"), Website._register.loader = setTimeout(function() {
                    SmoothScroll.reset(), $("body").removeClass("init"), $("#services h1").addClass("reveal")
                }, 6e3)) : ($("body").removeClass("init"), $("#services h1").addClass("reveal"))
            }), $("#projects ul.services").each(function() {
                $(this).find("span.reveal").each(function(t) {
                    $(this).wrapInner("<sub></sub>").get(0).style.setProperty("--index", t)
                })
            }), Website._register.projects = setTimeout(function() {
                $("#projects ul#featured li:first").addClass("active")
            }, 500), Website._functions.lighthouse() && $("#services h1").removeClass("text-reveal")
        },
        _events: function() {
            $(document).on("vclick", "#projects li", function() {
                Homepage._interaction.projects()
            })
        },
        _events_unload: function() {
            clearTimeout(this._register.loader), clearTimeout(this._register.projects), $(document).off("vclick", "#projects li")
        },
        _interaction: {
            projects: function() {
                $("#projects ul#featured li.active").removeClass("active").addClass("clear").next("li").addClass("active").end().siblings("li.clear").removeClass("clear").addClass("remove"), $("#projects ul#featured li.active").length || $("#projects ul#featured li:first").removeClass().addClass("active").siblings().removeClass()
            }
        }
    },
    Agency = {
        _register: {
            scroll: !1,
            are: !1,
            folio: !1
        },
        _init: function() {
            this._base(), this._events()
        },
        _base: function() {
            $("body").removeClass("init").addClass("white"), $("header").addClass("dark"), $("#culture_text").addClass("ready"), setTimeout(function() {
                $("section#profile-main").addClass("active")
            }, 1e3), Website._functions.lighthouse() && $("#profile-main").addClass("lh")
        },
        _events: function() {
            $(document).on("vmouseover", "section#capabilities ul li", function(t) {
                Agency._interaction.capabilities($(this))
            })
        },
        _events_unload: function() {
            clearTimeout(this._register.are), clearTimeout(this._register.folio), $(document).off("vmouseover", "section#capabilities ul li")
        },
        _interaction: {
            capabilities: function(t) {
                t.addClass("active").siblings().removeClass("active").parents("section#capabilities").addClass("active"), setTimeout(function() {
                    t.addClass("clickable").siblings().removeClass("clickable")
                }, 800)
            }
        }
    },
    Contact = {
        _register: {
            active: !1,
            location: !1
        },
        _init: function() {
            this._base(), this._events()
        },
        _base: function() {
            $("body").removeClass("init"), $("#contact-us").addClass("active animate"), setTimeout(function() {
                $("#contact-us").removeClass("animate")
            }, 1200), Website._functions.lighthouse() && $("#contact-us").addClass("lh")
        },
        _events: function() {},
        _events_unload: function() {},
        _interaction: {}
    },
    WorkOverview = {
        _register: {
            active: !1,
            intro: !1
        },
        _init: function() {
            this._base(), this._events()
        },
        _base: function() {
            WorkOverview._register.intro = setTimeout(function() {
                $("#work-thumbs div.carousel").addClass("active").find("div").each(function(t, e) {
                    setTimeout(function() {
                        $(e).addClass("ready")
                    }, 1100 + 400 * Math.min(t, 3))
                })
            }, 1), $("body").removeClass("init"), $("#main").addClass("no-scroll"), Website._functions.lighthouse() && $("#work-thumbs").addClass("lh")
        },
        _events: function() {
            $(document).on("vclick", "section#work-thumbs a", function(t) {
                WorkOverview._interaction.transition($(this), t)
            }), $("div.carousel").scroll(function() {
                WorkOverview._interaction.intro()
            })
        },
        _events_unload: function() {
            clearTimeout(WorkOverview._register.intro), $(document).off("vclick", "section#work-thumbs a"), $("div.carousel").off("scroll")
        },
        _interaction: {
            intro: function() {
                if ($("#_laptop_desktop_touch:visible").length) {
                    var t = $("section#work-thumbs h1 strong").width() + parseInt($("section#work-thumbs h1").css("left")),
                        e = parseInt($("div.carousel div:first").css("margin-left")) - t;
                    $("section#work-thumbs h1").css("opacity", Math.max(Math.min((e - $("div.carousel").scrollLeft()) / e, .9999), 0))
                }
            },
            transition: function(t, e) {
                if (e.preventDefault(), !$("#_laptop_desktop_notouch:visible").length) return Website._transition._init(), void Website._smoothState.load(t.attr("href"));
                $thumb = t.parent(), $carousel = $thumb.parent();
                var i = Math.round(-$thumb.offset().left - $thumb.width() / 2 + $(window).width() / 2);
                $carousel.get(0).style.setProperty("--hCenter", i + "px"), $carousel.find("h1").get(0).style.setProperty("--hCenter", i + "px"), $thumb.parents("#work-thumbs").andSelf().addClass("loading"), $thumb.is("[menu]") && $("header").addClass("dark"), $("body").addClass("work-transition"), setTimeout(function() {
                    Website._register.transition.type = "work", Website._transition._init(), Website._register.transition.duration = 1600, Website._smoothState.load(t.attr("href"))
                }, 600)
            }
        }
    },
    Work = {
        _register: {
            active: !1,
            loadin: !1,
            logo: !1
        },
        _init: function(t) {
            this._base(t), this._events()
        },
        _base: function(t) {
            Work._functions.linkedin(), t && $("body").hasClass("init"), $("body").removeClass("init"), setTimeout(function() {
                SmoothScroll._attributes.header.display = !0, setTimeout(function() {
                    SmoothScroll._attributes.document.main.scrollTop || $("html, body, #main").animate({
                        scrollTop: $("#_laptop_desktop_only:visible").length ? 100 : $("#work-intro p:first").offset().top + 8 - window.innerHeight
                    }, 1200, "easeInOutQuart")
                }, t || $("#_laptop_desktop_only:visible").length ? 0 : 810), setTimeout(function() {
                    SmoothScroll._attributes.header.display = !1, $("#work-next a").length && Website._smoothState.fetch($("#work-next a").attr("href"))
                }, t || $("#_laptop_desktop_only:visible").length ? 1300 : 2010)
            }, 100), $("#work-overview .reveal").each(function(t) {
                $(this).children("span").length || $(this).wrapInner("<sub></sub>"), $(this).get(0).style.setProperty("--index", t)
            }), $("#project-transition").addClass("active").find("> div").replaceWith($("section#work-next > div").clone().removeAttr("scroll style").children().removeAttr("scroll class style").end()), Work._register.logo = setInterval(function() {
                $(".work-logo div.logo").hasClass("reveal") && Work._interaction.logo($(".work-logo div.controls button.active").nextAll().length ? $(".work-logo div.controls button.active").next() : $(".work-logo div.controls button:first"), !1)
            }, 3e3), $(".work-typography").each(function() {
                $(this).find("ul li").each(function(t) {
                    $(this).children().each(function(e) {
                        $(this).get(0).style.setProperty("--index", 3 * t + e)
                    })
                })
            }), $(".work-colors").each(function() {
                $(this).find("ul li").each(function(t) {
                    $(this).find("div, span").each(function() {
                        $(this).get(0).style.setProperty("--index", t)
                    })
                })
            })
        },
        _events: function() {
            $(document).on("vclick", "section.work-logo button[theme]", function() {
                Work._interaction.logo($(this), !0)
            }), $(document).on("vclick", "#work-next a, #project-transition > div a", function(t) {
                Work._interaction.next_project.load(t)
            })
        },
        _events_unload: function() {
            clearInterval(Work._register.logo), $(document).off("vclick", "section.work-logo button[theme]"), $(document).off("vclick", "#work-next a, #project-transition > div a")
        },
        _functions: {
            linkedin: function() {
                let t = window.navigator.userAgent.toLowerCase().indexOf("linkedin") > 0;
                $("section.work-overview video").length && $("section.work-overview").find(t ? "video" : "img").remove(), $("section.mobile-walkthrough").each(function(e, i) {
                    $(i).find("video").length && $(i).find("div.image").find(t ? "video" : "img").remove()
                }), $("section.work-section.feature").each(function(e, i) {
                    $(i).find("video").length && $(i).find("div.image").find(t ? "video" : "img").remove()
                }), $("section.work-feature").each(function(e, i) {
                    $(i).find("video").length && $(i).find(t ? "img:not(.placeholder), video" : "img.placeholder").remove()
                }), $("section.work-image").each(function(e, i) {
                    $(i).find("video").length && $(i).find(t ? "video" : "img").remove()
                }), $("section.work-section.video").each(function(e, i) {
                    $(i).find("video").length && $(i).find(t ? "video" : "img").remove()
                })
            }
        },
        _interaction: {
            logo: function(t, e) {
                t.addClass("active").siblings().removeClass("active").end().parents("section.work-logo").attr("theme", t.attr("theme")), e && clearInterval(Work._register.logo)
            },
            next_project: {
                load: function(t) {
                    t.preventDefault(), SmoothScroll.lock();
                    var e = $("#work-next").offset().top + $("#work-next").height() - (window.scrollY + window.innerHeight);
                    $("#work").addClass("lock").css({
                        bottom: -e
                    }), $("header").addClass("scroll"), $("#work section").css("top", -($("#work-next").prev().offset().top + $("#work-next").prev().height() - window.scrollY)), $("#work-next").addClass("active").prop("complete", setTimeout(function() {
                        $("#work-next").addClass("complete")
                    }, 710)), $("#project-transition").addClass("transition").prop("complete", setTimeout(function() {
                        $("#project-transition").addClass("complete")
                    }, 710)), Website._register.transition.type = "project", setTimeout(function() {
                        Website._transition._init()
                    }, 710), Website._register.transition.duration = 720, Website._smoothState.load($("#work-next a").attr("href"))
                }
            }
        }
    };
Object.defineProperty(HTMLMediaElement.prototype, "playing", {
        get: function() {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
        }
    }), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function(t, e, i, n, o) {
            return jQuery.easing[jQuery.easing.def](t, e, i, n, o)
        },
        easeInQuad: function(t, e, i, n, o) {
            return n * (e /= o) * e + i
        },
        easeOutQuad: function(t, e, i, n, o) {
            return -n * (e /= o) * (e - 2) + i
        },
        easeInOutQuad: function(t, e, i, n, o) {
            return (e /= o / 2) < 1 ? n / 2 * e * e + i : -n / 2 * (--e * (e - 2) - 1) + i
        },
        easeInCubic: function(t, e, i, n, o) {
            return n * (e /= o) * e * e + i
        },
        easeOutCubic: function(t, e, i, n, o) {
            return n * ((e = e / o - 1) * e * e + 1) + i
        },
        easeInOutCubic: function(t, e, i, n, o) {
            return (e /= o / 2) < 1 ? n / 2 * e * e * e + i : n / 2 * ((e -= 2) * e * e + 2) + i
        },
        easeInQuart: function(t, e, i, n, o) {
            return n * (e /= o) * e * e * e + i
        },
        easeOutQuart: function(t, e, i, n, o) {
            return -n * ((e = e / o - 1) * e * e * e - 1) + i
        },
        easeInOutQuart: function(t, e, i, n, o) {
            return (e /= o / 2) < 1 ? n / 2 * e * e * e * e + i : -n / 2 * ((e -= 2) * e * e * e - 2) + i
        },
        easeInQuint: function(t, e, i, n, o) {
            return n * (e /= o) * e * e * e * e + i
        },
        easeOutQuint: function(t, e, i, n, o) {
            return n * ((e = e / o - 1) * e * e * e * e + 1) + i
        },
        easeInOutQuint: function(t, e, i, n, o) {
            return (e /= o / 2) < 1 ? n / 2 * e * e * e * e * e + i : n / 2 * ((e -= 2) * e * e * e * e + 2) + i
        },
        easeInSine: function(t, e, i, n, o) {
            return -n * Math.cos(e / o * (Math.PI / 2)) + n + i
        },
        easeOutSine: function(t, e, i, n, o) {
            return n * Math.sin(e / o * (Math.PI / 2)) + i
        },
        easeInOutSine: function(t, e, i, n, o) {
            return -n / 2 * (Math.cos(Math.PI * e / o) - 1) + i
        },
        easeInExpo: function(t, e, i, n, o) {
            return 0 == e ? i : n * Math.pow(2, 10 * (e / o - 1)) + i
        },
        easeOutExpo: function(t, e, i, n, o) {
            return e == o ? i + n : n * (1 - Math.pow(2, -10 * e / o)) + i
        },
        easeInOutExpo: function(t, e, i, n, o) {
            return 0 == e ? i : e == o ? i + n : (e /= o / 2) < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + i : n / 2 * (2 - Math.pow(2, -10 * --e)) + i
        },
        easeInCirc: function(t, e, i, n, o) {
            return -n * (Math.sqrt(1 - (e /= o) * e) - 1) + i
        },
        easeOutCirc: function(t, e, i, n, o) {
            return n * Math.sqrt(1 - (e = e / o - 1) * e) + i
        },
        easeInOutCirc: function(t, e, i, n, o) {
            return (e /= o / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + i : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + i
        },
        easeInElastic: function(t, e, i, n, o) {
            var s = 1.70158,
                r = 0,
                a = n;
            if (0 == e) return i;
            if (1 == (e /= o)) return i + n;
            if (r || (r = .3 * o), a < Math.abs(n)) {
                a = n;
                s = r / 4
            } else s = r / (2 * Math.PI) * Math.asin(n / a);
            return -a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * o - s) * (2 * Math.PI) / r) + i
        },
        easeOutElastic: function(t, e, i, n, o) {
            var s = 1.70158,
                r = 0,
                a = n;
            if (0 == e) return i;
            if (1 == (e /= o)) return i + n;
            if (r || (r = .3 * o), a < Math.abs(n)) {
                a = n;
                s = r / 4
            } else s = r / (2 * Math.PI) * Math.asin(n / a);
            return a * Math.pow(2, -10 * e) * Math.sin((e * o - s) * (2 * Math.PI) / r) + n + i
        },
        easeInOutElastic: function(t, e, i, n, o) {
            var s = 1.70158,
                r = 0,
                a = n;
            if (0 == e) return i;
            if (2 == (e /= o / 2)) return i + n;
            if (r || (r = o * (.3 * 1.5)), a < Math.abs(n)) {
                a = n;
                s = r / 4
            } else s = r / (2 * Math.PI) * Math.asin(n / a);
            return e < 1 ? a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * o - s) * (2 * Math.PI) / r) * -.5 + i : a * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * o - s) * (2 * Math.PI) / r) * .5 + n + i
        },
        easeInBack: function(t, e, i, n, o, s) {
            return null == s && (s = 1.70158), n * (e /= o) * e * ((s + 1) * e - s) + i
        },
        easeOutBack: function(t, e, i, n, o, s) {
            return null == s && (s = 1.70158), n * ((e = e / o - 1) * e * ((s + 1) * e + s) + 1) + i
        },
        easeInOutBack: function(t, e, i, n, o, s) {
            return null == s && (s = 1.70158), (e /= o / 2) < 1 ? n / 2 * (e * e * ((1 + (s *= 1.525)) * e - s)) + i : n / 2 * ((e -= 2) * e * ((1 + (s *= 1.525)) * e + s) + 2) + i
        },
        easeInBounce: function(t, e, i, n, o) {
            return n - jQuery.easing.easeOutBounce(t, o - e, 0, n, o) + i
        },
        easeOutBounce: function(t, e, i, n, o) {
            return (e /= o) < 1 / 2.75 ? n * (7.5625 * e * e) + i : e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + i : e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + i : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + i
        },
        easeInOutBounce: function(t, e, i, n, o) {
            return e < o / 2 ? .5 * jQuery.easing.easeInBounce(t, 2 * e, 0, n, o) + i : .5 * jQuery.easing.easeOutBounce(t, 2 * e - o, 0, n, o) + .5 * n + i
        }
    }),
    function(t, e, i) {
        "function" == typeof define && define.amd ? define(["jquery"], function(n) {
            return i(n, t, e), n.mobile
        }) : i(t.jQuery, t, e)
    }(this, document, function(t, e, i, n) {
        (function(t, e, i, n) {
            function o(t) {
                for (; t && void 0 !== t.originalEvent;) t = t.originalEvent;
                return t
            }

            function s(e, i) {
                var s, r, a, l, c, u, h, d, m, f = e.type;
                if ((e = t.Event(e)).type = i, s = e.originalEvent, r = t.event.props, f.search(/^(mouse|click)/) > -1 && (r = E), s)
                    for (h = r.length; h;) e[l = r[--h]] = s[l];
                if (f.search(/mouse(down|up)|click/) > -1 && !e.which && (e.which = 1), -1 !== f.search(/^touch/) && (f = (a = o(s)).touches, c = a.changedTouches, u = f && f.length ? f[0] : c && c.length ? c[0] : n))
                    for (d = 0, m = C.length; d < m; d++) e[l = C[d]] = u[l];
                return e
            }

            function r(e) {
                for (var i, n, o = {}; e;) {
                    for (n in i = t.data(e, $)) i[n] && (o[n] = o.hasVirtualBinding = !0);
                    e = e.parentNode
                }
                return o
            }

            function a(e, i) {
                for (var n; e;) {
                    if ((n = t.data(e, $)) && (!i || n[i])) return e;
                    e = e.parentNode
                }
                return null
            }

            function l() {
                D = !0
            }

            function c() {
                D = !1
            }

            function u() {
                h(), P = setTimeout(function() {
                    P = 0, z = 0, A.length = 0, O = !1, l()
                }, t.vmouse.resetTimerDuration)
            }

            function h() {
                P && (clearTimeout(P), P = 0)
            }

            function d(e, i, n) {
                var o;
                return (n && n[e] || !n && a(i.target, e)) && (o = s(i, e), t(i.target).trigger(o)), o
            }

            function m(e) {
                var i, n = t.data(e.target, x);
                !O && (!z || z !== n) && ((i = d("v" + e.type, e)) && (i.isDefaultPrevented() && e.preventDefault(), i.isPropagationStopped() && e.stopPropagation(), i.isImmediatePropagationStopped() && e.stopImmediatePropagation()))
            }

            function f(e) {
                var i, n, s, a = o(e).touches;
                a && 1 === a.length && ((n = r(i = e.target)).hasVirtualBinding && (z = L++, t.data(i, x, z), h(), c(), j = !1, s = o(e).touches[0], W = s.pageX, I = s.pageY, d("vmouseover", e, n), d("vmousedown", e, n)))
            }

            function p(t) {
                D || (j || d("vmousecancel", t, r(t.target)), j = !0, u())
            }

            function g(e) {
                if (!D) {
                    var i = o(e).touches[0],
                        n = j,
                        s = t.vmouse.moveDistanceThreshold,
                        a = r(e.target);
                    (j = j || Math.abs(i.pageX - W) > s || Math.abs(i.pageY - I) > s) && !n && d("vmousecancel", e, a), d("vmousemove", e, a), u()
                }
            }

            function b(t) {
                if (!D) {
                    l();
                    var e, i, n = r(t.target);
                    d("vmouseup", t, n), j || (e = d("vclick", t, n)) && e.isDefaultPrevented() && (i = o(t).changedTouches[0], A.push({
                        touchID: z,
                        x: i.clientX,
                        y: i.clientY
                    }), O = !0), d("vmouseout", t, n), j = !1, u()
                }
            }

            function v(e) {
                var i, n = t.data(e, $);
                if (n)
                    for (i in n)
                        if (n[i]) return !0;
                return !1
            }

            function _() {}

            function w(e) {
                var i = e.substr(1);
                return {
                    setup: function() {
                        v(this) || t.data(this, $, {}), t.data(this, $)[e] = !0, M[e] = (M[e] || 0) + 1, 1 === M[e] && H.bind(i, m), t(this).bind(i, _), q && (M.touchstart = (M.touchstart || 0) + 1, 1 === M.touchstart && H.bind("touchstart", f).bind("touchend", b).bind("touchmove", g).bind("scroll", p))
                    },
                    teardown: function() {
                        --M[e], M[e] || H.unbind(i, m), q && (--M.touchstart, M.touchstart || H.unbind("touchstart", f).unbind("touchmove", g).unbind("touchend", b).unbind("scroll", p));
                        var n = t(this),
                            o = t.data(this, $);
                        o && (o[e] = !1), n.unbind(i, _), v(this) || n.removeData($)
                    }
                }
            }
            var y, S, $ = "virtualMouseBindings",
                x = "virtualTouchID",
                k = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
                C = "clientX clientY pageX pageY screenX screenY".split(" "),
                T = t.event.mouseHooks ? t.event.mouseHooks.props : [],
                E = t.event.props.concat(T),
                M = {},
                P = 0,
                W = 0,
                I = 0,
                j = !1,
                A = [],
                O = !1,
                D = !1,
                q = "addEventListener" in i,
                H = t(i),
                L = 1,
                z = 0;
            for (t.vmouse = {
                    moveDistanceThreshold: 10,
                    clickDistanceThreshold: 10,
                    resetTimerDuration: 1500
                }, S = 0; S < k.length; S++) t.event.special[k[S]] = w(k[S]);
            q && i.addEventListener("click", function(e) {
                var i, n, o, s, r, a = A.length,
                    l = e.target;
                if (a)
                    for (i = e.clientX, n = e.clientY, y = t.vmouse.clickDistanceThreshold, o = l; o;) {
                        for (s = 0; s < a; s++)
                            if (r = A[s], 0, o === l && Math.abs(r.x - i) < y && Math.abs(r.y - n) < y || t.data(o, x) === r.touchID) return e.preventDefault(), void e.stopPropagation();
                        o = o.parentNode
                    }
            }, !0)
        })(t, 0, i),
        function(t) {
            t.mobile = {}
        }(t),
        function(t, e) {
            var n = {
                touch: "ontouchend" in i
            };
            t.mobile.support = t.mobile.support || {}, t.extend(t.support, n), t.extend(t.mobile.support, n)
        }(t),
        function(t, e, n) {
            function o(e, i, o, s) {
                var r = o.type;
                o.type = i, s ? t.event.trigger(o, n, e) : t.event.dispatch.call(e, o), o.type = r
            }
            var s = t(i),
                r = t.mobile.support.touch,
                a = "touchmove scroll",
                l = r ? "touchstart" : "mousedown",
                c = r ? "touchend" : "mouseup",
                u = r ? "touchmove" : "mousemove";
            t.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(e, i) {
                t.fn[i] = function(t) {
                    return t ? this.bind(i, t) : this.trigger(i)
                }, t.attrFn && (t.attrFn[i] = !0)
            }), t.event.special.scrollstart = {
                enabled: !0,
                setup: function() {
                    function e(t, e) {
                        o(s, (i = e) ? "scrollstart" : "scrollstop", t)
                    }
                    var i, n, s = this;
                    t(s).bind(a, function(o) {
                        t.event.special.scrollstart.enabled && (i || e(o, !0), clearTimeout(n), n = setTimeout(function() {
                            e(o, !1)
                        }, 50))
                    })
                },
                teardown: function() {
                    t(this).unbind(a)
                }
            }, t.event.special.tap = {
                tapholdThreshold: 750,
                emitTapOnTaphold: !0,
                setup: function() {
                    var e = this,
                        i = t(e),
                        n = !1;
                    i.bind("vmousedown", function(r) {
                        function a() {
                            clearTimeout(u)
                        }

                        function l() {
                            a(), i.unbind("vclick", c).unbind("vmouseup", a), s.unbind("vmousecancel", l)
                        }

                        function c(t) {
                            l(), n || h !== t.target ? n && t.preventDefault() : o(e, "tap", t)
                        }
                        if (n = !1, r.which && 1 !== r.which) return !1;
                        var u, h = r.target;
                        i.bind("vmouseup", a).bind("vclick", c), s.bind("vmousecancel", l), u = setTimeout(function() {
                            t.event.special.tap.emitTapOnTaphold || (n = !0), o(e, "taphold", t.Event("taphold", {
                                target: h
                            }))
                        }, t.event.special.tap.tapholdThreshold)
                    })
                },
                teardown: function() {
                    t(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"), s.unbind("vmousecancel")
                }
            }, t.event.special.swipe = {
                scrollSupressionThreshold: 30,
                durationThreshold: 1e3,
                horizontalDistanceThreshold: 30,
                verticalDistanceThreshold: 30,
                getLocation: function(t) {
                    var i = e.pageXOffset,
                        n = e.pageYOffset,
                        o = t.clientX,
                        s = t.clientY;
                    return 0 === t.pageY && Math.floor(s) > Math.floor(t.pageY) || 0 === t.pageX && Math.floor(o) > Math.floor(t.pageX) ? (o -= i, s -= n) : (s < t.pageY - n || o < t.pageX - i) && (o = t.pageX - i, s = t.pageY - n), {
                        x: o,
                        y: s
                    }
                },
                start: function(e) {
                    var i = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                        n = t.event.special.swipe.getLocation(i);
                    return {
                        time: (new Date).getTime(),
                        coords: [n.x, n.y],
                        origin: t(e.target)
                    }
                },
                stop: function(e) {
                    var i = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                        n = t.event.special.swipe.getLocation(i);
                    return {
                        time: (new Date).getTime(),
                        coords: [n.x, n.y]
                    }
                },
                handleSwipe: function(e, i, n, s) {
                    if (i.time - e.time < t.event.special.swipe.durationThreshold && Math.abs(e.coords[0] - i.coords[0]) > t.event.special.swipe.horizontalDistanceThreshold && Math.abs(e.coords[1] - i.coords[1]) < t.event.special.swipe.verticalDistanceThreshold) {
                        var r = e.coords[0] > i.coords[0] ? "swipeleft" : "swiperight";
                        return o(n, "swipe", t.Event("swipe", {
                            target: s,
                            swipestart: e,
                            swipestop: i
                        }), !0), o(n, r, t.Event(r, {
                            target: s,
                            swipestart: e,
                            swipestop: i
                        }), !0), !0
                    }
                    return !1
                },
                eventInProgress: !1,
                setup: function() {
                    var e, i = this,
                        n = t(i),
                        o = {};
                    (e = t.data(this, "mobile-events")) || (e = {
                        length: 0
                    }, t.data(this, "mobile-events", e)), e.length++, e.swipe = o, o.start = function(e) {
                        if (!t.event.special.swipe.eventInProgress) {
                            t.event.special.swipe.eventInProgress = !0;
                            var n, r = t.event.special.swipe.start(e),
                                a = e.target,
                                l = !1;
                            o.move = function(e) {
                                r && !e.isDefaultPrevented() && (n = t.event.special.swipe.stop(e), l || (l = t.event.special.swipe.handleSwipe(r, n, i, a)) && (t.event.special.swipe.eventInProgress = !1), Math.abs(r.coords[0] - n.coords[0]) > t.event.special.swipe.scrollSupressionThreshold && e.preventDefault())
                            }, o.stop = function() {
                                l = !0, t.event.special.swipe.eventInProgress = !1, s.off(u, o.move), o.move = null
                            }, s.on(u, o.move).one(c, o.stop)
                        }
                    }, n.on(l, o.start)
                },
                teardown: function() {
                    var e, i;
                    (e = t.data(this, "mobile-events")) && (i = e.swipe, delete e.swipe, e.length--, 0 === e.length && t.removeData(this, "mobile-events")), i && (i.start && t(this).off(l, i.start), i.move && s.off(u, i.move), i.stop && s.off(c, i.stop))
                }
            }, t.each({
                scrollstop: "scrollstart",
                taphold: "tap",
                swipeleft: "swipe.left",
                swiperight: "swipe.right"
            }, function(e, i) {
                t.event.special[e] = {
                    setup: function() {
                        t(this).bind(i, t.noop)
                    },
                    teardown: function() {
                        t(this).unbind(i)
                    }
                }
            })
        }(t, this),
        function(t, e, i) {
            t.extend(t.mobile, {
                version: "1.4.5",
                subPageUrlKey: "ui-page",
                hideUrlBar: !0,
                keepNative: ":jqmData(role='none'), :jqmData(role='nojs')",
                activePageClass: "ui-page-active",
                activeBtnClass: "ui-btn-active",
                focusClass: "ui-focus",
                ajaxEnabled: !0,
                hashListeningEnabled: !0,
                linkBindingEnabled: !0,
                defaultPageTransition: "fade",
                maxTransitionWidth: !1,
                minScrollBack: 0,
                defaultDialogTransition: "pop",
                pageLoadErrorMessage: "Error Loading Page",
                pageLoadErrorMessageTheme: "a",
                phonegapNavigationEnabled: !1,
                autoInitializePage: !0,
                pushStateEnabled: !0,
                ignoreContentEnabled: !1,
                buttonMarkup: {
                    hoverDelay: 200
                },
                dynamicBaseEnabled: !0,
                pageContainer: t(),
                allowCrossDomainPages: !1,
                dialogHashKey: "&ui-state=dialog"
            })
        }(t),
        function(t, e, i) {
            var n = {},
                o = t.find,
                s = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
                r = /:jqmData\(([^)]*)\)/g;
            t.extend(t.mobile, {
                ns: "",
                getAttribute: function(e, i) {
                    var n;
                    (e = e.jquery ? e[0] : e) && e.getAttribute && (n = e.getAttribute("data-" + t.mobile.ns + i));
                    try {
                        n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : s.test(n) ? JSON.parse(n) : n)
                    } catch (t) {}
                    return n
                },
                nsNormalizeDict: n,
                nsNormalize: function(e) {
                    return n[e] || (n[e] = t.camelCase(t.mobile.ns + e))
                },
                closestPageData: function(t) {
                    return t.closest(":jqmData(role='page'), :jqmData(role='dialog')").data("mobile-page")
                }
            }), t.fn.jqmData = function(e, i) {
                var n;
                return void 0 !== e && (e && (e = t.mobile.nsNormalize(e)), n = arguments.length < 2 || void 0 === i ? this.data(e) : this.data(e, i)), n
            }, t.jqmData = function(e, i, n) {
                var o;
                return void 0 !== i && (o = t.data(e, i ? t.mobile.nsNormalize(i) : i, n)), o
            }, t.fn.jqmRemoveData = function(e) {
                return this.removeData(t.mobile.nsNormalize(e))
            }, t.jqmRemoveData = function(e, i) {
                return t.removeData(e, t.mobile.nsNormalize(i))
            }, t.find = function(e, i, n, s) {
                return e.indexOf(":jqmData") > -1 && (e = e.replace(r, "[data-" + (t.mobile.ns || "") + "$1]")), o.call(this, e, i, n, s)
            }, t.extend(t.find, o)
        }(t),
        function(t, e) {
            function n(e, i) {
                var n, s, r, a = e.nodeName.toLowerCase();
                return "area" === a ? (s = (n = e.parentNode).name, !(!e.href || !s || "map" !== n.nodeName.toLowerCase()) && (!!(r = t("img[usemap=#" + s + "]")[0]) && o(r))) : (/input|select|textarea|button|object/.test(a) ? !e.disabled : "a" === a && e.href || i) && o(e)
            }

            function o(e) {
                return t.expr.filters.visible(e) && !t(e).parents().addBack().filter(function() {
                    return "hidden" === t.css(this, "visibility")
                }).length
            }
            var s = 0,
                r = /^ui-id-\d+$/;
            t.ui = t.ui || {}, t.extend(t.ui, {
                version: "c0ab71056b936627e8a7821f03c044aec6280a40",
                keyCode: {
                    BACKSPACE: 8,
                    COMMA: 188,
                    DELETE: 46,
                    DOWN: 40,
                    END: 35,
                    ENTER: 13,
                    ESCAPE: 27,
                    HOME: 36,
                    LEFT: 37,
                    PAGE_DOWN: 34,
                    PAGE_UP: 33,
                    PERIOD: 190,
                    RIGHT: 39,
                    SPACE: 32,
                    TAB: 9,
                    UP: 38
                }
            }), t.fn.extend({
                focus: function(e) {
                    return function(i, n) {
                        return "number" == typeof i ? this.each(function() {
                            var e = this;
                            setTimeout(function() {
                                t(e).focus(), n && n.call(e)
                            }, i)
                        }) : e.apply(this, arguments)
                    }
                }(t.fn.focus),
                scrollParent: function() {
                    var e;
                    return e = t.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                        return /(relative|absolute|fixed)/.test(t.css(this, "position")) && /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x"))
                    }).eq(0) : this.parents().filter(function() {
                        return /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x"))
                    }).eq(0), /fixed/.test(this.css("position")) || !e.length ? t(this[0].ownerDocument || i) : e
                },
                uniqueId: function() {
                    return this.each(function() {
                        this.id || (this.id = "ui-id-" + ++s)
                    })
                },
                removeUniqueId: function() {
                    return this.each(function() {
                        r.test(this.id) && t(this).removeAttr("id")
                    })
                }
            }), t.extend(t.expr[":"], {
                data: t.expr.createPseudo ? t.expr.createPseudo(function(e) {
                    return function(i) {
                        return !!t.data(i, e)
                    }
                }) : function(e, i, n) {
                    return !!t.data(e, n[3])
                },
                focusable: function(e) {
                    return n(e, !isNaN(t.attr(e, "tabindex")))
                },
                tabbable: function(e) {
                    var i = t.attr(e, "tabindex"),
                        o = isNaN(i);
                    return (o || i >= 0) && n(e, !o)
                }
            }), t("<a>").outerWidth(1).jquery || t.each(["Width", "Height"], function(i, n) {
                function o(e, i, n, o) {
                    return t.each(s, function() {
                        i -= parseFloat(t.css(e, "padding" + this)) || 0, n && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), o && (i -= parseFloat(t.css(e, "margin" + this)) || 0)
                    }), i
                }
                var s = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
                    r = n.toLowerCase(),
                    a = {
                        innerWidth: t.fn.innerWidth,
                        innerHeight: t.fn.innerHeight,
                        outerWidth: t.fn.outerWidth,
                        outerHeight: t.fn.outerHeight
                    };
                t.fn["inner" + n] = function(i) {
                    return i === e ? a["inner" + n].call(this) : this.each(function() {
                        t(this).css(r, o(this, i) + "px")
                    })
                }, t.fn["outer" + n] = function(e, i) {
                    return "number" != typeof e ? a["outer" + n].call(this, e) : this.each(function() {
                        t(this).css(r, o(this, e, !0, i) + "px")
                    })
                }
            }), t.fn.addBack || (t.fn.addBack = function(t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }), t("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (t.fn.removeData = function(e) {
                return function(i) {
                    return arguments.length ? e.call(this, t.camelCase(i)) : e.call(this)
                }
            }(t.fn.removeData)), t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), t.support.selectstart = "onselectstart" in i.createElement("div"), t.fn.extend({
                disableSelection: function() {
                    return this.bind((t.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(t) {
                        t.preventDefault()
                    })
                },
                enableSelection: function() {
                    return this.unbind(".ui-disableSelection")
                },
                zIndex: function(n) {
                    if (n !== e) return this.css("zIndex", n);
                    if (this.length)
                        for (var o, s, r = t(this[0]); r.length && r[0] !== i;) {
                            if (("absolute" === (o = r.css("position")) || "relative" === o || "fixed" === o) && (s = parseInt(r.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;
                            r = r.parent()
                        }
                    return 0
                }
            }), t.ui.plugin = {
                add: function(e, i, n) {
                    var o, s = t.ui[e].prototype;
                    for (o in n) s.plugins[o] = s.plugins[o] || [], s.plugins[o].push([i, n[o]])
                },
                call: function(t, e, i, n) {
                    var o, s = t.plugins[e];
                    if (s && (n || t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType))
                        for (o = 0; o < s.length; o++) t.options[s[o][0]] && s[o][1].apply(t.element, i)
                }
            }
        }(t),
        function(t, e, n) {
            t.extend(t.mobile, {
                window: t(e),
                document: t(i),
                keyCode: t.ui.keyCode,
                behaviors: {},
                silentScroll: function(i) {
                    "number" !== t.type(i) && (i = t.mobile.defaultHomeScroll), t.event.special.scrollstart.enabled = !1, setTimeout(function() {
                        e.scrollTo(0, i), t.mobile.document.trigger("silentscroll", {
                            x: 0,
                            y: i
                        })
                    }, 20), setTimeout(function() {
                        t.event.special.scrollstart.enabled = !0
                    }, 150)
                },
                getClosestBaseUrl: function(e) {
                    var i = t(e).closest(".ui-page").jqmData("url"),
                        n = t.mobile.path.documentBase.hrefNoHash;
                    return t.mobile.dynamicBaseEnabled && i && t.mobile.path.isPath(i) || (i = n), t.mobile.path.makeUrlAbsolute(i, n)
                },
                removeActiveLinkClass: function(e) {
                    !!t.mobile.activeClickedLink && (!t.mobile.activeClickedLink.closest("." + t.mobile.activePageClass).length || e) && t.mobile.activeClickedLink.removeClass(t.mobile.activeBtnClass), t.mobile.activeClickedLink = null
                },
                getInheritedTheme: function(t, e) {
                    for (var i, n, o = t[0], s = "", r = /ui-(bar|body|overlay)-([a-z])\b/; o && !((i = o.className || "") && (n = r.exec(i)) && (s = n[2]));) o = o.parentNode;
                    return s || e || "a"
                },
                enhanceable: function(t) {
                    return this.haveParents(t, "enhance")
                },
                hijackable: function(t) {
                    return this.haveParents(t, "ajax")
                },
                haveParents: function(e, i) {
                    if (!t.mobile.ignoreContentEnabled) return e;
                    var n, o, s, r, a = e.length,
                        l = t();
                    for (r = 0; r < a; r++) {
                        for (o = e.eq(r), s = !1, n = e[r]; n;) {
                            if ("false" === (n.getAttribute ? n.getAttribute("data-" + t.mobile.ns + i) : "")) {
                                s = !0;
                                break
                            }
                            n = n.parentNode
                        }
                        s || (l = l.add(o))
                    }
                    return l
                },
                getScreenHeight: function() {
                    return e.innerHeight || t.mobile.window.height()
                },
                resetActivePageHeight: function(e) {
                    var i = t("." + t.mobile.activePageClass),
                        n = i.height(),
                        o = i.outerHeight(!0);
                    e = function(e, i) {
                        var n = e.parent(),
                            o = [],
                            s = function() {
                                var e = t(this),
                                    i = t.mobile.toolbar && e.data("mobile-toolbar") ? e.toolbar("option") : {
                                        position: e.attr("data-" + t.mobile.ns + "position"),
                                        updatePagePadding: !1 !== e.attr("data-" + t.mobile.ns + "update-page-padding")
                                    };
                                return "fixed" !== i.position || !0 !== i.updatePagePadding
                            },
                            r = n.children(":jqmData(role='header')").filter(s),
                            a = e.children(":jqmData(role='header')"),
                            l = n.children(":jqmData(role='footer')").filter(s),
                            c = e.children(":jqmData(role='footer')");
                        return 0 === a.length && r.length > 0 && (o = o.concat(r.toArray())), 0 === c.length && l.length > 0 && (o = o.concat(l.toArray())), t.each(o, function(e, n) {
                            i -= t(n).outerHeight()
                        }), Math.max(0, i)
                    }(i, "number" == typeof e ? e : t.mobile.getScreenHeight()), i.css("min-height", ""), i.height() < e && i.css("min-height", e - (o - n))
                },
                loading: function() {
                    var e = this.loading._widget || t(t.mobile.loader.prototype.defaultHtml).loader(),
                        i = e.loader.apply(e, arguments);
                    return this.loading._widget = e, i
                }
            }), t.addDependents = function(e, i) {
                var n = t(e),
                    o = n.jqmData("dependents") || t();
                n.jqmData("dependents", t(o).add(i))
            }, t.fn.extend({
                removeWithDependents: function() {
                    t.removeWithDependents(this)
                },
                enhanceWithin: function() {
                    var e, i = {},
                        n = t.mobile.page.prototype.keepNativeSelector(),
                        o = this;
                    for (e in t.mobile.nojs && t.mobile.nojs(this), t.mobile.links && t.mobile.links(this), t.mobile.degradeInputsWithin && t.mobile.degradeInputsWithin(this), t.fn.buttonMarkup && this.find(t.fn.buttonMarkup.initSelector).not(n).jqmEnhanceable().buttonMarkup(), t.fn.fieldcontain && this.find(":jqmData(role='fieldcontain')").not(n).jqmEnhanceable().fieldcontain(), t.each(t.mobile.widgets, function(e, s) {
                            if (s.initSelector) {
                                var r = t.mobile.enhanceable(o.find(s.initSelector));
                                r.length > 0 && (r = r.not(n)), r.length > 0 && (i[s.prototype.widgetName] = r)
                            }
                        }), i) i[e][e]();
                    return this
                },
                addDependents: function(e) {
                    t.addDependents(this, e)
                },
                getEncodedText: function() {
                    return t("<a>").text(this.text()).html()
                },
                jqmEnhanceable: function() {
                    return t.mobile.enhanceable(this)
                },
                jqmHijackable: function() {
                    return t.mobile.hijackable(this)
                }
            }), t.removeWithDependents = function(e) {
                var i = t(e);
                (i.jqmData("dependents") || t()).remove(), i.remove()
            }, t.addDependents = function(e, i) {
                var n = t(e),
                    o = n.jqmData("dependents") || t();
                n.jqmData("dependents", t(o).add(i))
            }, t.find.matches = function(e, i) {
                return t.find(e, null, null, i)
            }, t.find.matchesSelector = function(e, i) {
                return t.find(i, null, null, [e]).length > 0
            }
        }(t, this),
        function(t, n) {
            e.matchMedia = e.matchMedia || function(t, e) {
                var i, n = t.documentElement,
                    o = n.firstElementChild || n.firstChild,
                    s = t.createElement("body"),
                    r = t.createElement("div");
                return r.id = "mq-test-1", r.style.cssText = "position:absolute;top:-100em", s.style.background = "none", s.appendChild(r),
                    function(t) {
                        return r.innerHTML = '&shy;<style media="' + t + '"> #mq-test-1 { width: 42px; }</style>', n.insertBefore(s, o), i = 42 === r.offsetWidth, n.removeChild(s), {
                            matches: i,
                            media: t
                        }
                    }
            }(i), t.mobile.media = function(t) {
                return e.matchMedia(t).matches
            }
        }(t),
        function(t, i) {
            t.extend(t.support, {
                orientation: "orientation" in e && "onorientationchange" in e
            })
        }(t),
        function(t, n) {
            function o(t) {
                var e, i = t.charAt(0).toUpperCase() + t.substr(1),
                    o = (t + " " + l.join(i + " ") + i).split(" ");
                for (e in o)
                    if (a[o[e]] !== n) return !0
            }
            var s, r = t("<body>").prependTo("html"),
                a = r[0].style,
                l = ["Webkit", "Moz", "O"],
                c = "palmGetResource" in e,
                u = e.operamini && "[object OperaMini]" === {}.toString.call(e.operamini),
                h = e.blackberry && !o("-webkit-transform");
            t.extend(t.mobile, {
                browser: {}
            }), t.mobile.browser.oldIE = function() {
                var t = 3,
                    e = i.createElement("div"),
                    n = e.all || [];
                do {
                    e.innerHTML = "\x3c!--[if gt IE " + ++t + "]><br><![endif]--\x3e"
                } while (n[0]);
                return t > 4 ? t : !t
            }(), t.extend(t.support, {
                pushState: "pushState" in history && "replaceState" in history && !(e.navigator.userAgent.indexOf("Firefox") >= 0 && e.top !== e) && -1 === e.navigator.userAgent.search(/CriOS/),
                mediaquery: t.mobile.media("only all"),
                cssPseudoElement: !!o("content"),
                touchOverflow: !!o("overflowScrolling"),
                cssTransform3d: function() {
                    var o, s, a, c = "transform-3d",
                        u = t.mobile.media("(-" + l.join("-" + c + "),(-") + "-" + c + "),(" + c + ")");
                    if (u) return !!u;
                    for (a in o = i.createElement("div"), s = {
                            MozTransform: "-moz-transform",
                            transform: "transform"
                        }, r.append(o), s) o.style[a] !== n && (o.style[a] = "translate3d( 100px, 1px, 1px )", u = e.getComputedStyle(o).getPropertyValue(s[a]));
                    return !!u && "none" !== u
                }(),
                boxShadow: !!o("boxShadow") && !h,
                fixedPosition: function() {
                    var t = e,
                        i = navigator.userAgent,
                        n = navigator.platform,
                        o = i.match(/AppleWebKit\/([0-9]+)/),
                        s = !!o && o[1],
                        r = i.match(/Fennec\/([0-9]+)/),
                        a = !!r && r[1],
                        l = i.match(/Opera Mobi\/([0-9]+)/),
                        c = !!l && l[1];
                    return !((n.indexOf("iPhone") > -1 || n.indexOf("iPad") > -1 || n.indexOf("iPod") > -1) && s && s < 534 || t.operamini && "[object OperaMini]" === {}.toString.call(t.operamini) || l && c < 7458 || i.indexOf("Android") > -1 && s && s < 533 || a && a < 6 || "palmGetResource" in e && s && s < 534 || i.indexOf("MeeGo") > -1 && i.indexOf("NokiaBrowser/8.5.0") > -1)
                }(),
                scrollTop: ("pageXOffset" in e || "scrollTop" in i.documentElement || "scrollTop" in r[0]) && !c && !u,
                dynamicBaseTag: function() {
                    var e, i = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
                        n = t("head base"),
                        o = null,
                        s = "";
                    return n.length ? s = n.attr("href") : n = o = t("<base>", {
                        href: i
                    }).appendTo("head"), e = t("<a href='testurl' />").prependTo(r)[0].href, n[0].href = s || location.pathname, o && o.remove(), 0 === e.indexOf(i)
                }(),
                cssPointerEvents: function() {
                    var t, n = i.createElement("x"),
                        o = i.documentElement,
                        s = e.getComputedStyle;
                    return "pointerEvents" in n.style && (n.style.pointerEvents = "auto", n.style.pointerEvents = "x", o.appendChild(n), t = s && "auto" === s(n, "").pointerEvents, o.removeChild(n), !!t)
                }(),
                boundingRect: void 0 !== i.createElement("div").getBoundingClientRect,
                inlineSVG: function() {
                    var i = e,
                        n = !(!i.document.createElementNS || !i.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect || i.opera && -1 === navigator.userAgent.indexOf("Chrome")),
                        o = function(e) {
                            (!e || !n) && t("html").addClass("ui-nosvg")
                        },
                        s = new i.Image;
                    s.onerror = function() {
                        o(!1)
                    }, s.onload = function() {
                        o(1 === s.width && 1 === s.height)
                    }, s.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                }
            }), r.remove(), s = function() {
                var t = e.navigator.userAgent;
                return t.indexOf("Nokia") > -1 && (t.indexOf("Symbian/3") > -1 || t.indexOf("Series60/5") > -1) && t.indexOf("AppleWebKit") > -1 && t.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)
            }(), t.mobile.gradeA = function() {
                return (t.support.mediaquery && t.support.cssPseudoElement || t.mobile.browser.oldIE && t.mobile.browser.oldIE >= 8) && (t.support.boundingRect || null !== t.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/))
            }, t.mobile.ajaxBlacklist = e.blackberry && !e.WebKitPoint || u || s, s && t(function() {
                t("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet")
            }), t.support.boxShadow || t("html").addClass("ui-noboxshadow")
        }(t)
    });
class ScrollableItem {
    constructor(t) {
        var e = this;
        this.item = t;
        var i = $(t);
        this.$item = i, this.target = i, this._triggers = {}, this.target._attributes = {}, this.item.is_hidden = !0, this.item.is_fixed = "fixed" == this.item.getAttribute("smoothscroll"), this.item.translateYModifier = !1, this.item.is_carousel = !1, this.update_followup = !1, this.item.getAttribute("scroll") && (this._triggers[this.item.getAttribute("scroll")] = [this.item]), this.item.querySelectorAll("[scroll]").forEach(function(t) {
            t.getAttribute("scroll").split(",").forEach(i => void 0 !== e._triggers[i] ? e._triggers[i].push(t) : e._triggers[i] = [t])
        }), this._resize = function() {
            e.update(), e.render(!1), e.update_followup = setTimeout(function() {
                e.update(), e.render(!1)
            }, 1)
        }, this._resize(), window.removeEventListener("resize", this._resize), window.addEventListener("resize", this._resize)
    }
    deconstruct() {
        window.removeEventListener("resize", this._resize)
    }
    update() {
        this.update_layout()
    }
    render(t) {
        if (!this.item.classList.contains("loading")) {
            var e = this.item.offsetHeight,
                i = this.item.offsetTop - (SmoothScroll._attributes.transition.previous + SmoothScroll._attributes.window.height);
            if (!this.item.is_fixed) {
                if (!this.item.translateYModifier && !this.item.is_carousel && (i > 1.5 * SmoothScroll._attributes.window.height || i + e + SmoothScroll._attributes.window.height < -1.5 * SmoothScroll._attributes.window.height) && (this.item.is_hidden || (this.item.is_hidden = !0, this.item.style.visibility = "hidden"), !t)) return;
                this.item.is_hidden && (this.item.is_hidden = !1, this.item.style.visibility = "visible"), .1 === SmoothScroll._attributes.transition.ease && (this.item.translateYModifier || (this.item.style.transform = `translate3d(0,${-1*SmoothScroll._attributes.transition.previous}px,0)`))
            }
            this.layout()
        }
    }
    update_layout() {
        for (let [t, e] of Object.entries(this._triggers))
            for (const e of this._triggers[t]) switch (t) {
                case "capabilities":
                    e.margin = parseInt(window.getComputedStyle(e).getPropertyValue("--revealMargin")) ? parseInt(window.getComputedStyle(e).getPropertyValue("--revealMargin")) : 0;
                    break;
                case "case-studies.image":
                    e.margin = parseInt(window.getComputedStyle(this.item.querySelector('span[scroll="case-studies.image"]')).getPropertyValue("--parallaxMargin")), e.video = e.querySelector("video");
                    break;
                case "culture.images":
                    e.images = e.querySelectorAll("figure:not(:last-of-type) img");
                    break;
                case "carousel":
                    this.item.is_carousel = !0, e.center = this.item.offsetTop + e.parentElement.offsetTop + e.offsetHeight / 2 - SmoothScroll._attributes.window.height / 2, e.center_position = parseInt(window.getComputedStyle(e).getPropertyValue("--offsetTop")) ? parseInt(window.getComputedStyle(e).getPropertyValue("--offsetTop")) : 0, e.fixed_header = !!e.hasAttribute("fixed-header"), e.margin = parseInt(this.target.children(':not([scroll="carousel-fixed"]):first').css("margin-right")), e.padding = parseInt(this.target.css("padding-top")) + parseInt(this.target.css("padding-bottom")), e.padding_bottom = parseInt(this.target.css("padding-bottom")), e.width = 0, e.items = this.item.querySelectorAll("[carousel-parallax]"), e.item_height = 0, Array.from(e.children).forEach(t => {
                        "carousel-fixed" != t.getAttribute("scroll") && t.offsetHeight > e.item_height && (e.item_height = t.offsetHeight)
                    }), e.bottom_padding = (SmoothScroll._attributes.window.height - e.item_height) / 2, $(e).children(':not([scroll="carousel-fixed"])').each(function() {
                        e.width += Math.ceil($(this).width() + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right")))
                    }).end(), e.height = Math.ceil(SmoothScroll._attributes.window.height - e.parentElement.offsetWidth + e.width - 2 * e.bottom_padding) + e.center_position, e.parentElement.style.height = `${e.height}px`, e.lock = {
                        container: e.parentElement.previousElementSibling,
                        section: !(!this.item.previousElementSibling || "SECTION" != this.item.previousElementSibling.nodeName) && this.item.previousElementSibling
                    }, e.next = !!this.item.classList.contains("work-section") && this.item.nextElementSibling, SmoothScroll._resize(!1, !0, !1);
                    break;
                case "culture.text":
                    if (!document.getElementById("agency-intro")) break;
                    e.top = document.getElementById("agency-intro").offsetTop - e.querySelector("h1").offsetHeight / 2, e.bottom = document.getElementById("agency-intro").offsetTop + SmoothScroll._attributes.window.height / 2 - e.querySelector("h1").offsetHeight / 2;
                    break;
                case "manifesto.counter":
                    e.lock = this.item.offsetTop + e.parentElement.offsetTop + e.offsetHeight / 2, e.release = {
                        item: this.item.querySelector("li:last-of-type")
                    }, e.release.center = Math.ceil(parseInt(window.getComputedStyle(e.release.item).getPropertyValue("line-height")) / 2), e.release.y = this.item.offsetTop + e.release.item.offsetTop + e.release.center, e.release.position = e.release.item.offsetTop - e.release.item.parentElement.offsetTop + e.release.center - e.offsetHeight / 2;
                    break;
                case "manifesto.heading":
                    e.release_item = this.item.querySelector("li:last-of-type"), e.release_margin = this.item.querySelector('strong[scroll="manifesto.counter"]'), e.release_margin.margin = (e.release_margin.offsetHeight - parseInt(window.getComputedStyle(e.release_item).getPropertyValue("line-height"))) / 2, e.release = this.item.offsetTop + e.release_item.offsetTop + e.release_margin.margin, e.margin = (e.offsetHeight - parseInt(window.getComputedStyle(e.release_item).getPropertyValue("line-height"))) / 2, e.top_lock = parseInt(window.getComputedStyle(e).getPropertyValue("--lock"));
                    break;
                case "manifesto.views":
                    e.margin = parseInt(window.getComputedStyle(this.item.querySelector("li:first-of-type")).getPropertyValue("margin-bottom")), this.item.last_view = this.item.querySelector("li:last-of-type"), this.item.counter_item = this.item.querySelector("strong span:first-of-type"), this.item.counter_base = this.item.querySelector("strong span:last-of-type");
                    break;
                case "menu":
                    e.menu = e.getAttribute("menu"), e.margin = parseInt(window.getComputedStyle(e).getPropertyValue("margin-bottom")), e.top = e.offsetTop + (e.offsetTop != this.item.offsetTop ? this.item.offsetTop : 0) - (SmoothScroll._attributes.document.header.offsetHeight - 8);
                    break;
                case "next-project":
                    e.img = e.querySelector("picture"), e.link = e.querySelector("a");
                    break;
                case "quote":
                    e.container = e.closest("div.container"), e.blockquote = e.querySelector("blockquote"), e.width = e.blockquote.offsetWidth + parseInt(window.getComputedStyle(e.blockquote).marginRight), e.height = Math.ceil(SmoothScroll._attributes.window.height + e.width - e.container.offsetWidth), e.container.style.height = `${e.height}px`, SmoothScroll._resize(!1, !0, !1);
                    break;
                case "reveal":
                    e.margin = parseInt(window.getComputedStyle(e).getPropertyValue("--revealMargin")) ? parseInt(window.getComputedStyle(e).getPropertyValue("--revealMargin")) : 0, e.delay = parseInt(window.getComputedStyle(e).getPropertyValue("--revealDelay")) ? parseInt(window.getComputedStyle(e).getPropertyValue("--revealDelay")) : 0, e.position = parseInt(window.getComputedStyle(e).getPropertyValue("--revealPosition")) ? e.offsetHeight * (parseInt(window.getComputedStyle(e).getPropertyValue("--revealPosition")) / 100) : 0, e.revealed = !1;
                    break;
                case "services":
                    e.scrollers = e.querySelectorAll("div");
                    break;
                case "video":
                    e.target = "VIDEO" == e.nodeName ? e : e.querySelector("video"), e.parallax = this.item.classList.contains("work-image")
            }
    }
    layout() {
        for (let [e, i] of Object.entries(this._triggers))
            for (const i of this._triggers[e]) switch (e) {
                case "button":
                    i.translateY = Math.min(Math.max(SmoothScroll._attributes.transition.previous, 0), 100), i.style.transform = `translate3d(0,${i.translateY}%,0)`, i.style.opacity = i.translateY / 100, SmoothScroll._attributes.transition.previous > 200 && i.classList.add("remove");
                    break;
                case "capabilities":
                    if (i.parentElement.parentElement.parentElement.classList.contains("active") || SmoothScroll._attributes.transition.baseline < this.item.offsetTop + i.offsetTop + i.margin) return;
                    i.classList.add("active"), i.parentElement.parentElement.parentElement.classList.add("active");
                    break;
                case "carousel":
                    i.translateX = SmoothScroll._attributes.transition.previous - i.center, i.translateY = SmoothScroll._attributes.transition.previous < i.center ? 0 : SmoothScroll._attributes.transition.baseline > this.item.offsetTop + this.item.offsetHeight - i.center_position - i.padding_bottom + i.bottom_padding ? this.item.offsetHeight - i.center_position - i.padding_bottom + i.bottom_padding - i.parentElement.offsetTop - i.offsetHeight / 2 - SmoothScroll._attributes.window.height / 2 : i.translateX, i.center_position && i.style.setProperty("top", `${i.center_position}px`), i.style.transform = `translate3d(${-i.translateX}px, ${Math.max(i.translateY,0)}px, 0px)`, i.style.setProperty("--translateY", `${Math.max(i.translateY,0)}px`);
                    for (let [t, e] of Object.entries(i.lock)) e && (e.translateYModifier = !0, e.style.transform = `translate3d(0px, ${("section"==t?-SmoothScroll._attributes.transition.previous:0)+Math.max(i.translateY,0)}px, 0px)`, e.style.setProperty("z-index", 4));
                    if (i.next && (i.next.translateYModifier = !0, i.next.style.transform = `translate3d(0px, ${-SmoothScroll._attributes.transition.previous-(i.height-i.item_height-Math.max(i.translateY,0))}px, 0px)`, i.next.style.setProperty("margin-bottom", `${Math.min(-(i.height-i.item_height-Math.max(i.translateY,0)),-1)}px`), i.next.style.setProperty("z-index", 4)), $(i).children("[carousel-parallax]").each(function() {
                            if ($("#_laptop_desktop_only:visible").length) {
                                let t = $(this).offset().left + ($(this).width() - 80) / 2,
                                    e = (Math.min(Math.max(t / $(window).width() * 100, -25), 125) - 50) / 8;
                                $(this).find("figure").css("transform", "translate3d(" + -e + "%, 0px, 0px)")
                            } else if (!$("#_laptop_desktop_only:visible").length) {
                                let t = $(this).position().top,
                                    e = t + $(this).parents("a").height() + SmoothScroll._attributes.window.height,
                                    i = $(this).height(),
                                    n = 100 * (SmoothScroll._attributes.transition.baseline - t) / (e - t) / 100 * 8 - 6;
                                SmoothScroll._attributes.transition.baseline >= t - i && SmoothScroll._attributes.transition.baseline <= e + i && $(this).find("figure").css("transform", "scale(1.3) translate3d(0px, " + n + "%, 0px)")
                            }
                        }), $(i).find('h2[scroll="carousel-fixed"]')) {
                        var t = this.target.find('h2[scroll="carousel-fixed"]').width() + parseInt(this.target.find('h2[scroll="carousel-fixed"]').css("margin-left")) - this.target.find('h2[scroll="carousel-fixed"] strong').width();
                        i.opacity = 1 - Math.min(Math.max(i.translateX / t, 0), 1), $(i).find("h2").css({
                            opacity: i.opacity,
                            transform: "translate3d(" + i.translateX + "px, 0px, 0px)"
                        }), SmoothScroll._attributes.transition.previous > 100 && !i.active && ($("div.carousel div").addClass("ready"), i.active = !0)
                    }
                    SmoothScroll._attributes.document.fixed_header = i.fixed_header && SmoothScroll._attributes.transition.baseline <= this.item.offsetTop + this.item.offsetHeight;
                    break;
                case "case-studies.image":
                    i.min = this.item.offsetTop + i.parentElement.offsetTop, i.max = i.min + i.parentElement.offsetHeight + SmoothScroll._attributes.window.height, SmoothScroll._attributes.transition.baseline >= i.min && SmoothScroll._attributes.transition.baseline <= i.max ? (i.translateY = 100 * (SmoothScroll._attributes.transition.baseline - i.min) / (i.max - i.min) / 100 * (2 * i.margin) - i.margin, i.style.transform = `translate3d(0,${i.translateY}%,0)`, i.video && !i.is_playing && (i.video.play(), i.is_playing = !0)) : i.video && i.is_playing && (i.video.pause(), i.is_playing = !1);
                    break;
                case "culture.images":
                    i.images.forEach(t => {
                        t.min = t.parentElement.offsetTop, t.max = t.min + t.parentElement.offsetHeight + SmoothScroll._attributes.window.height, t.translateY = 100 * (SmoothScroll._attributes.transition.baseline - t.min) / (t.max - t.min) / 100 * 30 - 15, t.style.transform = `translate3d(0,${t.translateY}%,0)`
                    });
                    break;
                case "culture.text":
                    i.style.opacity = Math.max(Math.min(100 - 100 * (SmoothScroll._attributes.transition.baseline - i.top) / (i.bottom - i.top), 100), 0) / 100, i.style.transform = `translate3d(0,${SmoothScroll._attributes.transition.previous}px,0)`;
                    break;
                case "footer":
                    i.position = -.8 * (this.item.offsetTop - SmoothScroll._attributes.transition.previous), i.opacity = Math.min(1200 + i.position, 1e3) / 1e3, i.style.transform = `translate3d(0,${i.position}px,0)`, i.style.opacity = i.opacity;
                    break;
                case "manifesto.counter":
                    i.position = SmoothScroll._attributes.transition.center <= i.lock ? 0 : SmoothScroll._attributes.transition.center > i.release.y ? i.release.position : SmoothScroll._attributes.transition.center - i.lock, i.style.transform = `translate3d(0,${i.position}px,0)`, i.classList.toggle("show", SmoothScroll._attributes.transition.center > i.lock && SmoothScroll._attributes.transition.center <= i.release.y);
                    break;
                case "manifesto.heading":
                    i.top = this.item.offsetTop + i.parentElement.offsetTop - i.top_lock, i.release_position = this.item.offsetHeight + i.margin - i.height / 2 - SmoothScroll._attributes.window.height / 2, this.item.released = SmoothScroll._attributes.transition.center > i.release, i.position = SmoothScroll._attributes.transition.previous < i.top ? 0 : SmoothScroll._attributes.transition.center > i.release ? i.release_position : SmoothScroll._attributes.transition.previous - i.top, i.style.transform = `translate3d(0,${i.position}px,0)`;
                    break;
                case "manifesto.views":
                    i.top = this.item.offsetTop + i.offsetTop, i.height = i.offsetHeight + i.margin, i.opacity_top = i.top, i.opacity_bottom = i.top + i.height, i.setAttribute("top", i.opacity_top), i.setAttribute("bottom", i.opacity_bottom), SmoothScroll._attributes.transition.center >= i.opacity_top && SmoothScroll._attributes.transition.center <= i.opacity_bottom || this.item.released && i == this.item.last_view ? i.opacity = 1 : SmoothScroll._attributes.transition.center < i.opacity_top ? i.opacity = Math.max((100 - Math.min(Math.abs(i.opacity_top - SmoothScroll._attributes.transition.center), 100)) / 100, .1) : i.opacity = Math.max((100 - Math.min(Math.abs(i.opacity_bottom - SmoothScroll._attributes.transition.center), 100)) / 100, .1), 1 === i.opacity && (this.item.counter_item.textContent = i.getAttribute("view")), this.item.counter_item.style.opacity = 1 - window.getComputedStyle(this.item.last_view).getPropertyValue("opacity"), this.item.counter_base.style.opacity = Math.max(window.getComputedStyle(this.item.last_view).getPropertyValue("opacity"), .1), i.style.opacity = i.opacity;
                    break;
                case "menu":
                    SmoothScroll._attributes.transition.previous >= i.top && SmoothScroll._attributes.transition.previous < i.top + i.offsetHeight + i.margin && (SmoothScroll._attributes.document.menu = !0);
                    break;
                case "next-project":
                    i.end = this.item.offsetTop - SmoothScroll._attributes.window.height + i.link.offsetHeight, i.position = -.8 * (i.end - SmoothScroll._attributes.transition.previous), i.style.transform = `translate3d(0,${i.position}px,0)`, i.img.style.opacity = i.link.style.opacity = Math.min(Math.max(1 - (i.end - SmoothScroll._attributes.transition.previous) / i.link.offsetHeight + .01, 0), 1);
                    break;
                case "parallax":
                    i.translateY = Math.min(Math.max(SmoothScroll._attributes.transition.baseline - this.item.offsetTop, 0), 2 * this.item.offsetHeight) / (2 * this.item.offsetHeight) * 100 - 50, i.style.transform = `translate3d(0,${i.translateY}%,0)`;
                    break;
                case "quote":
                    i.translateX = SmoothScroll._attributes.transition.previous - this.item.offsetTop, i.translateY = SmoothScroll._attributes.transition.previous < this.item.offsetTop ? 0 : SmoothScroll._attributes.transition.baseline > this.item.offsetTop + this.item.offsetHeight ? this.item.offsetHeight - SmoothScroll._attributes.window.height : i.translateX, i.style.transform = `translate3d(${-i.translateX}px, 0px, 0px)`, i.closest("div.quote-container").style.transform = `translate3d(0px, ${i.translateY}px, 0px)`;
                    break;
                case "reveal":
                    !i.revealed && SmoothScroll._attributes.transition.baseline > this.item.offsetTop + i.offsetTop + i.margin + i.position && (i.revealed = !0, setTimeout(function() {
                        i.classList.add("reveal")
                    }, i.delay));
                    break;
                case "services":
                    i.translateX = Math.min(Math.max(SmoothScroll._attributes.transition.baseline - i.offsetTop - i.offsetHeight, 0), SmoothScroll._attributes.window.height), i.scrollers[0].style.transform = `translate3d(${(SmoothScroll._attributes.window.height-i.translateX)/4}px, 0, 0)`, i.scrollers[1].style.transform = `translate3d(${(SmoothScroll._attributes.window.height-i.translateX)/4*-1}px, 0, 0)`;
                    break;
                case "sticky":
                    i.top = this.item.offsetTop + $(i).parents("div.split").position().top, i.height = $(i).parents("div.split").height(), i.position = SmoothScroll._attributes.transition.previous <= i.top ? 0 : SmoothScroll._attributes.transition.baseline > i.top + i.height ? i.height - SmoothScroll._attributes.window.height : SmoothScroll._attributes.transition.previous - i.top, i.style.transform = `translate3d(0,${i.position}px,0)`;
                    break;
                case "video":
                    !i.is_playing && "undefined" !== i.source && SmoothScroll._attributes.transition.baseline >= this.item.offsetTop + (i.parallax ? 0 : i.parentElement.offsetTop) + i.offsetTop && SmoothScroll._attributes.transition.previous <= this.item.offsetTop + (i.parallax ? 0 : i.parentElement.offsetTop) + i.offsetTop + i.offsetHeight && (i.target.play(), i.is_playing = !0), i.is_playing && !i.paused && (SmoothScroll._attributes.transition.baseline < this.item.offsetTop + (i.parallax ? 0 : i.parentElement.offsetTop) + i.offsetTop || SmoothScroll._attributes.transition.previous > this.item.offsetTop + (i.parallax ? 0 : i.parentElement.offsetTop) + i.offsetTop + i.offsetHeight) && (i.target.pause(), i.is_playing = !1)
            }
    }
}
SmoothScroll = {
        _MathUtils: {
            map: function(t, e, i, n, o) {
                return (t - e) * (o - n) / (i - e) + n
            },
            lerp: function(t, e, i) {
                return (1 - i) * t + i * e
            }
        },
        _attributes: {
            content: {
                sized: !1
            },
            document: {
                container: document.getElementById("smoothscroll"),
                fixed_header: !1,
                header: document.getElementsByTagName("header")[0],
                height: !1,
                last_menu: !1,
                main: document.getElementById("main"),
                menu: !1,
                scroll: !1
            },
            header: {
                display: !1,
                scroll: !1
            },
            window: {
                height: !1,
                width: !1
            },
            animation: {
                frame: !1,
                stop: !0,
                timeout: !1
            }
        },
        _items: [],
        _init: function(t) {
            if (_self = this, this._attributes.transition = {
                    previous: !1,
                    current: 0,
                    differential: 0,
                    ease: .1,
                    lock: !1
                }, this._resize(!1, !1, !1), this._items = [], document.querySelectorAll("[smoothscroll]").forEach(t => this._items.push(new ScrollableItem(t))), t) this._easing(), this._attributes.document.scroll = 0, this._attributes.document.main.scrollTo({
                top: 0
            }), setTimeout(function() {
                window.removeEventListener("resize", _self._binding.resize), window.addEventListener("resize", _self._binding.resize), _self._easing()
            }, 100), window.onbeforeunload = function() {
                _self.unload()
            };
            else {
                window.removeEventListener("resize", _self._binding.resize), window.addEventListener("resize", _self._binding.resize), this._attributes.document.fixed_header = !1;
                for (const t of this._items) t.deconstruct()
            }
            setTimeout(function() {
                _self._scroll(!1, !0), _self._resize(!1, !1, !0)
            }, t ? 0 : 600)
        },
        _binding: {
            resize: function() {
                _self._resize(!1, !1, !1)
            },
            scroll: function() {
                _self._scroll(!1, !1)
            }
        },
        _easing: function() {
            _self._attributes.document.main.removeEventListener("scroll", _self._binding.scroll.bind(this)), this._attributes.transition.ease = parseFloat(window.getComputedStyle(document.body).getPropertyValue("--smoothScroll")), this._attributes.document.main = .1 === this._attributes.transition.ease ? window : document.getElementById("main"), this._attributes.document.main_body = .1 === this._attributes.transition.ease ? document.body : document.getElementById("main"), _self._attributes.document.main.removeEventListener("scroll", _self._binding.scroll), _self._attributes.document.main.addEventListener("scroll", _self._binding.scroll)
        },
        _resize: function(t, e, i) {
            if (t || this._easing(), this._attributes.document.height != this._attributes.document.container.offsetHeight || i || e) {
                if (this._attributes.document.height = this._attributes.document.container.offsetHeight, this._attributes.window = {
                        height: window.innerHeight,
                        width: window.innerWidth
                    }, this._attributes.document.main_body.style.height = `${this._attributes.document.height}px`, !e)
                    for (const t of this._items) t._resize();
                t || this._scroll(!0, !1), i || e || (setTimeout(function() {
                    _self._resize(!0, !1, !1)
                }, 500), setTimeout(function() {
                    _self._resize(!0, !1, !1)
                }, 1e3), setTimeout(function() {
                    _self._resize(!0, !1, !1)
                }, 2e3), setTimeout(function() {
                    _self._resize(!0, !1, !1)
                }, 3e3), setTimeout(function() {
                    _self._resize(!0, !1, !1)
                }, 4e3), setTimeout(function() {
                    _self._resize(!0, !1, !1)
                }, 5e3))
            }
        },
        _scroll: function(t, e) {
            t || this._resize(!0, !1, !1), e || (this._attributes.document.main == window ? this._attributes.document.scroll = Math.round(window.pageYOffset || document.documentElement.scrollTop) : this._attributes.document.scroll = this._attributes.document.main.scrollTop), this._attributes.document.fixed_header || (this._attributes.transition.current > 0 && this._attributes.transition.direction && !this._attributes.header.scroll && !this._attributes.header.display && (this._attributes.header.scroll = !0, this._attributes.document.header.classList.add("scroll")), !this._attributes.transition.direction && this._attributes.header.scroll && (this._attributes.header.scroll = !1, this._attributes.document.header.classList.remove("scroll"))), this._attributes.animation.stop && (this._attributes.animation.stop = !1, cancelAnimationFrame(this._attributes.animation.frame), this._attributes.animation.frame = requestAnimationFrame(() => this.render(e, !1))), clearTimeout(this._attributes.animation.timeout), this._attributes.animation.timeout = setTimeout(function() {
                _self._attributes.animation.stop = !0
            }, 4e3)
        },
        render: function(t, e) {
            if (this._attributes.animation.stop || this._attributes.transition.lock) cancelAnimationFrame(this._attributes.animation.frame);
            else {
                this._attributes.transition.current = this._attributes.document.scroll, this._attributes.transition.direction = this._attributes.transition.current - this._attributes.transition.previous > 0 || !(this._attributes.transition.current - this._attributes.transition.previous < 0) && this._attributes.transition.direction;
                var i = parseFloat(SmoothScroll._MathUtils.lerp(this._attributes.transition.previous, this._attributes.transition.current, SmoothScroll._attributes.transition.ease).toFixed(2));
                if (this._attributes.transition.previous !== i || t) {
                    this._attributes.transition.previous = i, this._attributes.transition.baseline = this._attributes.transition.previous + this._attributes.window.height, this._attributes.transition.center = this._attributes.transition.previous + this._attributes.window.height / 2, this._attributes.document.menu = !1;
                    for (const t of this._items) t.render(!e);
                    (t || this._attributes.document.menu != this._attributes.document.last_menu) && (this._attributes.document.header.classList.toggle("dark", (this._attributes.document.menu || document.body.classList.contains("white")) && !(this._attributes.document.menu && document.body.classList.contains("white"))), this._attributes.document.last_menu = this._attributes.document.menu), this._attributes.animation.frame = requestAnimationFrame(() => this.render(t, !0))
                } else this._attributes.animation.stop = !0
            }
        },
        lock: function() {
            this._attributes.transition.lock = !0, window.removeEventListener("resize", _self._binding.resize), _self._attributes.document.main.removeEventListener("scroll", _self._binding.scroll)
        },
        reset: function() {
            this._attributes.document.main.scrollTo({
                top: 0
            }), this._attributes.transition.lock = !1, this._attributes.document.menu = !1, this._attributes.animation.stop = !0, cancelAnimationFrame(this._attributes.animation.frame);
            for (const t of this._items) t.deconstruct();
            this._init(!1)
        },
        unload: function() {
            SmoothScroll.lock(), this._attributes.document.main.scrollTo({
                top: 0
            });
            for (const t of this._items) t.deconstruct();
            this._items = []
        }
    },
    function(t, e, i, n) {
        "use strict";
        if (!e.history.pushState) return t.fn.smoothState = function() {
            return this
        }, void(t.fn.smoothState.options = {});
        if (!t.fn.smoothState) {
            var o = t("html, body"),
                s = e.console,
                r = {
                    isExternal: function(t) {
                        var i = t.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
                        return "string" == typeof i[1] && i[1].length > 0 && i[1].toLowerCase() !== e.location.protocol || "string" == typeof i[2] && i[2].length > 0 && i[2].replace(new RegExp(":(" + {
                            "http:": 80,
                            "https:": 443
                        }[e.location.protocol] + ")?$"), "") !== e.location.host
                    },
                    stripHash: function(t) {
                        return t.replace(/#.*/, "")
                    },
                    isHash: function(t, i) {
                        i = i || e.location.href;
                        var n = t.indexOf("#") > -1,
                            o = r.stripHash(t) === r.stripHash(i);
                        return n && o
                    },
                    translate: function(e) {
                        var i = {
                            dataType: "html",
                            type: "GET"
                        };
                        return "string" == typeof e ? t.extend({}, i, {
                            url: e
                        }) : t.extend({}, i, e)
                    },
                    shouldLoadAnchor: function(t, e, i) {
                        var n = t.prop("href");
                        return !(r.isExternal(n) || r.isHash(n) || t.is(e) || t.prop("target") || void 0 !== typeof i && "" !== i && -1 === t.prop("href").search(i))
                    },
                    clearIfOverCapacity: function(t, e) {
                        return Object.keys || (Object.keys = function(t) {
                            var e, i = [];
                            for (e in t) Object.prototype.hasOwnProperty.call(t, e) && i.push(e);
                            return i
                        }), Object.keys(t).length > e && (t = {}), t
                    },
                    storePageIn: function(e, i, n, o, s) {
                        var r = t("<html></html>").append(t(n));
                        return e[i] = {
                            status: "loaded",
                            title: r.find("title").first().text(),
                            html: r.find("#" + s),
                            doc: n
                        }, o && (e[i].classes = o), e
                    },
                    triggerAllAnimationEndEvent: function(e, i) {
                        i = " " + i || "";
                        var n = 0;
                        e.on("animationstart webkitAnimationStart oanimationstart MSAnimationStart", function(i) {
                            t(i.delegateTarget).is(e) && (i.stopPropagation(), n++)
                        }), e.on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function(i) {
                            t(i.delegateTarget).is(e) && (i.stopPropagation(), 0 == --n && e.trigger("allanimationend"))
                        }), e.on("allanimationend" + i, function() {
                            n = 0, r.redraw(e)
                        })
                    },
                    redraw: function(t) {
                        t.height()
                    }
                },
                a = function(n, a) {
                    var l, c = t(n),
                        u = a.trigger_container,
                        h = c.prop("id"),
                        d = null,
                        m = !1,
                        f = {},
                        p = e.location.href,
                        g = function(t) {
                            (t = t || !1) && f.hasOwnProperty(t) ? delete f[t] : f = {}, c.data("smoothState").cache = f
                        },
                        b = function(e, i) {
                            i = i || t.noop;
                            var n = r.translate(e);
                            if (!(f = r.clearIfOverCapacity(f, a.cacheLength)).hasOwnProperty(n.url) || void 0 !== n.data) {
                                f[n.url] = {
                                    status: "fetching"
                                };
                                var o = (n.url.indexOf("?") > -1 ? "&" : "?") + "smoothstate=true";
                                n.url += o;
                                var s = t.ajax(n);
                                n.url = n.url.slice(0, -17), s.success(function(t) {
                                    r.storePageIn(f, n.url, t, t.match(/body\sclass=['|"]([^'|"]*)['|"]/), h), c.data("smoothState").cache = f
                                }), s.error(function() {
                                    f[n.url].status = "error"
                                }), i && s.complete(i)
                            }
                        },
                        v = function(n) {
                            var r = "#" + h,
                                l = f[n] ? t(f[n].html.html()) : null;
                            l && l.length ? (i.title = f[n].title, c.data("smoothState").href = n, a.loadingClass && o.removeClass(a.loadingClass), a.onReady.render(c, l, f[n].classes, f[n] ? f[n].title : ""), c.one("ss.onReadyEnd", function() {
                                m = !1, a.onAfter(c, l, f[n].classes, n, f[n] ? f[n].title : ""), a.scroll && function() {
                                    if (d) {
                                        var e = t(d, c);
                                        if (e.length) {
                                            var i = e.offset().top;
                                            o.scrollTop(i)
                                        }
                                        d = null
                                    }
                                }()
                            }), e.setTimeout(function() {
                                c.trigger("ss.onReadyEnd")
                            }, a.onReady.duration)) : !l && a.debug && s ? s.warn("No element with an id of " + r + " in response from " + n + " in " + f) : e.location = n
                        },
                        _ = function(t, i, n) {
                            a.href = t.url;
                            var l = r.translate(t);
                            void 0 === i && (i = !0), void 0 === n && (n = !0);
                            var u = !1,
                                d = !1,
                                m = {
                                    loaded: function() {
                                        var t = u ? "ss.onProgressEnd" : "ss.onStartEnd";
                                        d && u ? d && v(l.url) : c.one(t, function() {
                                            v(l.url), n || g(l.url)
                                        }), i && e.history.pushState({
                                            id: h
                                        }, f[l.url].title, l.url), d && !n && g(l.url)
                                    },
                                    fetching: function() {
                                        u || (u = !0, c.one("ss.onStartEnd", function() {
                                            a.loadingClass && o.addClass(a.loadingClass), a.onProgress.render(c), e.setTimeout(function() {
                                                c.trigger("ss.onProgressEnd"), d = !0
                                            }, a.onProgress.duration)
                                        })), e.setTimeout(function() {
                                            f.hasOwnProperty(l.url) && m[f[l.url].status]()
                                        }, 10)
                                    },
                                    error: function() {
                                        a.debug && s ? s.log("There was an error loading: " + l.url) : e.location = l.url
                                    }
                                };
                            f.hasOwnProperty(l.url) || b(l), a.onStart.render(c, l.url), e.setTimeout(function() {
                                a.scroll && o.scrollTop(0), c.trigger("ss.onStartEnd")
                            }, Website._register.transition.duration), m[f[l.url].status]()
                        },
                        w = 0,
                        y = function() {
                            var t = null === a.repeatDelay,
                                e = parseInt(Date.now()) > w;
                            return !(t || e)
                        },
                        S = function() {
                            w = parseInt(Date.now()) + parseInt(a.repeatDelay)
                        };
                    return a = t.extend({}, t.fn.smoothState.options, a), null === e.history.state && e.history.replaceState({
                        id: h
                    }, i.title, p), r.storePageIn(f, p, i.documentElement.outerHTML, t(i).find("body").attr("class"), h), r.triggerAllAnimationEndEvent(c, "ss.onStartEnd ss.onProgressEnd ss.onEndEnd"), l = u, a.anchors && (l.on("click", a.anchors, function(i) {
                        var n = t(i.currentTarget);
                        if (!i.metaKey && !i.ctrlKey && r.shouldLoadAnchor(n, a.blacklist, a.hrefRegex) && (i.stopPropagation(), i.preventDefault(), !y())) {
                            S();
                            var o = r.translate(n.prop("href"));
                            if (m = !0, d = n.prop("hash"), o = a.alterRequest(o), e.location.href == o.url) return void Website._transition.scroll_to_top();
                            a.onBefore(n, c), _(o)
                        }
                    }), a.prefetch && l.on(a.prefetchOn, a.anchors, function(e) {
                        var i, n = t(e.currentTarget);
                        r.shouldLoadAnchor(n, a.blacklist, a.hrefRegex) && !m && (e.stopPropagation(), i = r.translate(n.prop("href")), i = a.alterRequest(i), b(i))
                    })), {
                        href: p,
                        blacklist: function(t) {
                            a.blacklist = t
                        },
                        cache: f,
                        clear: g,
                        load: _,
                        fetch: b,
                        restartCSSAnimations: function() {
                            var t = c.prop("class");
                            c.removeClass(t), r.redraw(c), c.addClass(t)
                        }
                    }
                };
            e.onpopstate = function(i) {
                if (null !== i.state) {
                    Website._transition._init();
                    var n = e.location.href,
                        o = t("#" + i.state.id).data("smoothState");
                    o.href === n || r.isHash(n, o.href) || o.load(n, !1)
                }
            }, t.smoothStateUtility = r, t.fn.smoothState = function(e) {
                return this.each(function() {
                    var i = this.tagName.toLowerCase();
                    this.id && "body" !== i && "html" !== i && !t.data(this, "smoothState") ? t.data(this, "smoothState", new a(this, e)) : !this.id && s ? s.warn("Every smoothState container needs an id but the following one does not have one:", this) : "body" !== i && "html" !== i || !s || s.warn("The smoothstate container cannot be the " + this.tagName + " tag")
                })
            }, t.fn.smoothState.options = {
                debug: !1,
                anchors: "a",
                hrefRegex: "",
                forms: "form",
                allowFormCaching: !1,
                repeatDelay: 500,
                blacklist: ".no-smoothState",
                prefetch: !1,
                prefetchOn: "mouseover touchstart",
                cacheLength: 0,
                loadingClass: "is-loading",
                scroll: !0,
                alterRequest: function(t) {
                    return t
                },
                onBefore: function(t, e) {},
                onStart: {
                    duration: 0,
                    render: function(t) {}
                },
                onProgress: {
                    duration: 0,
                    render: function(t) {}
                },
                onReady: {
                    duration: 0,
                    render: function(t, e, i, n) {
                        t.html(e)
                    }
                },
                onAfter: function(t, e) {}
            }
        }
    }(jQuery, window, document);