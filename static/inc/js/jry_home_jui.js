(function ($) {
    /* Top Menu */
    $.fn.jry_home_ShowTopMenu = function (options) {

    }

    /* Left Menu */
    $.fn.jry_home_ShowLeftMenu = function (options) {
        this.option = jQuery.extend({}, options);

        var thispage = $.url().attr("path").toLowerCase();
        $(this).find("li:not(.lbtn)")
        .each(function (i) {
            var atag = $(this).find("a");
            var imgtag = $(this).find("img");
            var initSrc = imgtag.attr('src');
            var newSrc = initSrc.substring(0, initSrc.lastIndexOf('.'));

            var pageArray = atag.attr("pagename").toLowerCase().split('|');
            // 버튼 hover 셋팅
            imgtag.hover(function () {
                imgtag.attr("src", newSrc + "_ov." + /[^.]+$/.exec(initSrc));
            },
            function () {
                imgtag.attr("src", imgtag.attr("src").replace("_ov.gif", ".gif"));
            });

            for (var i = 0; i < pageArray.length; i++) {
                if (atag.attr("pagename").toLowerCase() != "" && thispage.indexOf(pageArray[i]) != -1) {
                    // 현재 페이지일 경우
                    imgtag.attr("src", newSrc + "_ov." + /[^.]+$/.exec(initSrc));
                    imgtag.hover(function () {
                        imgtag.attr("src", newSrc + "_ov." + /[^.]+$/.exec(initSrc));
                    },
                    function () {
                        imgtag.attr("src", newSrc + "_ov." + /[^.]+$/.exec(initSrc));
                    });                    
                    break;
                }
            }
        });
    }

    /* Navigator */
    $.fn.jry_home_ShowNavigator = function (options) {
        this.option = jQuery.extend({ depth: 1 }, options);

        var homeTag = $(this).find("a:first");
        homeTag.attr("href", jsf_base_GetSiteMainURL());
        homeTag.addClass("dcursor");

        var targetDIV = (this.option.depth == 1 ? $(this).find("div:first") : $(this).find("div:eq(1)"));
        var targetView = (this.option.depth == 1 ? targetDIV.find("ul#nav01") : targetDIV.find("ul#nav02"));

        var thispage = $.url().attr("file").toLowerCase();
        var sameitem = null;

        targetView
            .find("a")
            .each(function (i) {
                if ($(this).attr("pagename").toLowerCase().indexOf(thispage) != -1) {
                    sameitem = $(this);
                    return false;
                }
            });

        var selTag = targetDIV.find("a:first");

        if (sameitem != null) {
            //selTag.attr("href", sameitem.attr("href"));
            selTag.html("<em>" + sameitem.text() + "</em>");
            sameitem.parent().parent().css("display", "none");
        }

        selTag
        //.unbind("click.TNavigator mouseenter.TNavigator")
        //.bind("click.TNavigator", function (event) { targetView.toggle(); })
            .unbind("mouseenter.TNavigator")
            .bind("mouseenter.TNavigator", function (event) {
                targetView.stop(true, true);
                targetView.slideDown('slow');
                //if (targetView.css("display") == "none") targetView.css("display", "block"); 
            })

        targetView
            .unbind("mouseleave.TNavigator")
            .bind("mouseleave.TNavigator", function (event) {
                targetView.stop(true, true);
                targetView.slideUp('slow');
                //if (targetView.css("display") == "block") targetView.css("display", "none"); 
            });
    }
})(jQuery);

//    /* AutoCompete */

//    (function ($) {
//        $.fn.jry_home_ShowAutoComplete = function (options) {
//            var panel = this;
//            var joCtrl = $(this);
//            this.option = jQuery.extend({ ajaxurl: '', idkeyctrl: '', minlength: 1, splitchar: '$$', serviceId: '1' }, options);

//            this.pagename = $.url().attr("file").replace(".aspx", "").toLowerCase();
//            this.createtime = (new Date()).getTime();
//            this.onlyone = panel.pagename + panel.createtime;

//            $("#" + panel.option.idkeyctrl)
//            .unbind('.' + panel.onlyone + '_NoInput')
//            .bind('keydown.' + panel.onlyone + '_NoInput', jsf_def_NoInput)
//			.bind('paste.' + panel.onlyone + '_NoInput', jsf_def_NoPaste)
//			.bind('cut.' + panel.onlyone + '_NoInput', jsf_def_NoCut);

//            joCtrl.autocomplete({
//                source: function (request, response) {
//                    $.ajax({
//                        async: true,
//                        type: "POST",
//                        url: panel.option.ajaxurl,
//                        data: JSON.stringify({
//                            serviceId: panel.option.serviceId,
//                            searchValue: $.trim(request.term),
//                            token: panel.option.splitchar
//                        }),
//                        dataType: "json",
//                        contentType: "application/json",
//                        success: function (data) {
//                            response($.map(data.d, function (item) {
//                                itemText = item.Text.split(panel.option.splitchar);
//                                return {
//                                    label: itemText,
//                                    value: item.Value
//                                }
//                            }))
//                        },
//                        error: function (xhr, textStatus, errorThrown) {
//                            alert("검색 조회 에러입니다.");
//                        },
//                        beforeSend: function (xhr, settings) { jsf_com_AjaxLoader(jcAJAX_BEFORESEND, "", "#" + panel.attr("id")); },
//                        complete: function (xhr, textStatus) { jsf_com_AjaxLoader(jcAJAX_COMPLETE, "", "#" + panel.attr("id")); }
//                    });
//                },
//                minLength: panel.option.minlength,
//                select: function (event, ui) {
//                    var keyValue = ui.item.value.split(panel.option.splitchar);

//                    if ($("#" + panel.option.idkeyctrl).length > 0) {
//                        $("#" + panel.option.idkeyctrl).val((keyValue[0] == "0" ? "" : keyValue[0])).trigger("focusout");
//                        $("#" + panel.option.idkeyctrl).change();
//                        joCtrl.val((keyValue[0] == "0" ? "" : keyValue[1])).trigger("focusout");
//                        jsf_mm_Search(); // 선택시 자동조회
//                    }

//                    return false;
//                }
//            });
//        }
//    })(jQuery);

    /* AutoCompete */

(function ($) {
    $.fn.jry_home_ShowAutoComplete = function (options) {
        var panel = this;
        var joCtrl = $(this);
        this.option = jQuery.extend({ ajaxurl: '', idkeyctrl: '', minlength: 1, splitchar: '$$', serviceId: '1' }, options);

        this.pagename = $.url().attr("file").replace(".aspx", "").toLowerCase();
        this.createtime = (new Date()).getTime();
        this.onlyone = panel.pagename + panel.createtime;
           
        joCtrl.autocomplete({
            source: function (request, response) {
                $.ajax({
                    async: true,
                    type: "POST",
                    url: panel.option.ajaxurl,
                    data: JSON.stringify({ 
                        serviceId: panel.option.serviceId,
                        searchValue: $.trim(request.term),
                        token: panel.option.splitchar  
                    }),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        response($.map(data.d, function (item) {
                            //itemText = item.Text.split(panel.option.splitchar);
                            return {
                                label: item.Text,
                                value: item.Text
                            }
                        }))
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        alert("검색 조회 에러입니다.");
                    },
                    beforeSend: function (xhr, settings) { jsf_com_AjaxLoader(jcAJAX_BEFORESEND, "", "#" + panel.attr("id")); },
                    complete: function (xhr, textStatus) { jsf_com_AjaxLoader(jcAJAX_COMPLETE, "", "#" + panel.attr("id")); }
                });
            },
            focus: function(event, ui){
                event.preventDefault();
            },
            minLength: panel.option.minlength,
            select: function (event, ui) {
                var keyValue = ui.item.value;

                $("#" + panel.option.idkeyctrl).val(keyValue).trigger("focusout");
                $("#" + panel.option.idkeyctrl).change();
                joCtrl.val(keyValue).trigger("focusout");
                jsf_mm_Search(); // 선택시 자동조회


                return false;
            }
        }).data("autocomplete")._renderItem = function (ul, item) 
        { 
             return $j("<li></li>") 
                  .data("item.autocomplete", item) 
                  .append($j("<a></a>").html(item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<font color='red'>$1</font>"))) 
                  .appendTo(ul); 
        };
    }
})(jQuery);

/* Inline Tooltip */

(function ($) {
    $.fn.jry_home_ShowInlineTooltip = function () {
        var panel = this;
        var joCtrl = $(this);
        
        this.pagename = ($.url().attr("file") == null ? "def" : $.url().attr("file").replace(".aspx", "").toLowerCase());

        this.showtitle = function (jpCtrl) {
            var jvtitletext = jpCtrl.attr("vtooltip");
            if(jpCtrl.val() == "") jpCtrl.val(jvtitletext).addClass("inlinetooltip");
        }

        this.hidetitle = function (jpCtrl) {
            var jvtitletext = jpCtrl.attr("vtooltip");
            if(jpCtrl.val() == jvtitletext) jpCtrl.val("").removeClass("inlinetooltip");
        }
        
        this.init = function () {
            joCtrl.each(function (idx) {
                var jvcreatetime = (new Date()).getTime();
                var jvonlyone = panel.pagename + jvcreatetime;

                $(this)
                    .unbind('.' + jvonlyone + '_tooltip')
                    .bind('focusin.' + jvonlyone + '_tooltip', function () { panel.hidetitle($(this)); })
                    .bind('focusout.' + jvonlyone + '_tooltip', function () { panel.showtitle($(this)); });
                
                $(this).trigger("focusout");
            });
        }

        this.init();
    }
})(jQuery);

/* Real Only Number */
(function ($) {
    $.fn.jry_home_RealNumber = function (options) {
        var panel = this;
        var joCtrl = $(this);
        this.option = jQuery.extend({}, options);

        this.pagename = $.url().attr("file").replace(".aspx", "").toLowerCase();
        this.createtime = (new Date()).getTime();
        this.onlyone = panel.pagename + panel.createtime;

        joCtrl
            .unbind('.' + panel.onlyone + '_onlynumber')
			.bind('blur.' + panel.onlyone + '_onlynumber', jsf_def_InputBlur)
			.bind('keydown.' + panel.onlyone + '_onlynumber', jsf_def_InputRealNumber);
    }
})(jQuery);


/* Only Number */

(function ($) {
    $.fn.jry_home_OnlyNumber = function (options) {
        var panel = this;
        var joCtrl = $(this);
        this.option = jQuery.extend({ }, options);

        this.pagename = $.url().attr("file").replace(".aspx", "").toLowerCase();
        this.createtime = (new Date()).getTime();
        this.onlyone = panel.pagename + panel.createtime;

        joCtrl
            .unbind('.' + panel.onlyone + '_onlynumber')
			.bind('blur.' + panel.onlyone + '_onlynumber', jsf_def_InputBlur)
			.bind('keydown.' + panel.onlyone + '_onlynumber', jsf_def_InputOnlyNumber);
    }
})(jQuery);

/* Auto Tab 
<%=Include_JQuery_BaseExternalPluginScript%>
<script type="text/javascript" src="/inc/js/jcom/jcaret/jquery.caret.1.02.min.js"></script> <-- 삽입
입력박스 maxlenth 값 지정 필수
*/

(function ($) {
    $.fn.jry_home_AutoTab = function (options) {
        var panel = this;
        var joCtrl = $(this);
        this.option = jQuery.extend({ isonlynumber: false }, options);

        this.pagename = $.url().attr("file").replace(".aspx", "").toLowerCase();
        this.createtime = (new Date()).getTime();
        this.onlyone = panel.pagename + panel.createtime;

        joCtrl.each(function (i) {
            $j(this).attr("autotab", i+1);
            $j(this).attr("autotabmax", joCtrl.length);
            $j(this).attr("autotabgroup", panel.onlyone);
        });
        
        if(panel.option.isonlynumber) {   
            joCtrl
                .unbind('.' + panel.onlyone + '_autotab')
			    .bind('blur.' + panel.onlyone + '_autotab', jsf_def_InputBlur)
			    .bind('keydown.' + panel.onlyone + '_autotab', jsf_def_InputOnlyNumberWithAutoTab)
			    .bind('keydown.' + panel.onlyone + '_autotab keyup.' + panel.onlyone + '_autotab', jsf_def_InputAutoTab);
        } else {
            joCtrl
                .unbind('.' + panel.onlyone + '_autotab')
			    .bind('keydown.' + panel.onlyone + '_autotab keyup.' + panel.onlyone + '_autotab', jsf_def_InputAutoTab);
        }
    }
})(jQuery);

/* Byte Check */

(function ($) {
    $.fn.jry_home_CheckTextByte = function (options) {
        var panel = this;
        var joCtrl = $(this);
        this.option = jQuery.extend({ type: 'word', idshowctrl: '', maxlimitbyte: 80 }, options);

        this.pagename = $.url().attr("file").replace(".aspx", "").toLowerCase();
        this.createtime = (new Date()).getTime();
        this.onlyone = panel.pagename + panel.createtime;
        this.isshowcount = ($("#" + panel.option.idshowctrl).length > 0 ? true : false);
        this.showCtrl = $("#" + panel.option.idshowctrl);

        this.showcount = function (countval) {
            if(panel.isshowcount) {
                panel.showCtrl.val(countval + ' / ' + panel.option.maxlimitbyte);
            }
        }

        this.checksmsbyte = function () {
            var tempByteLength = 0, cutByteLength = 0;
            if (panel.option.type == "byte")
            {
                for (var i = 0; i < joCtrl.val().length; i++) {
                    if (escape(joCtrl.val().charAt(i)).length > 4) {
                        tempByteLength += 2;
                    } else {
                        tempByteLength++;
                    }

                    if (tempByteLength < panel.option.maxlimitbyte) {
                        cutByteLength++;
                    }
                }
            }
            else if(panel.option.type == "word")
            {
                for (var i = 0; i < joCtrl.val().length; i++) {
                    tempByteLength++;
                    if (tempByteLength < panel.option.maxlimitbyte) {
                        cutByteLength++;
                    }
                }
            }
            
            if (tempByteLength > panel.option.maxlimitbyte) {               
                jsf_Alert("입력텍스트는 " + panel.option.maxlimitbyte + "자로 제한됩니다.<br />현재 입력하신 내용은 " + tempByteLength + "자입니다.<br />초과로 입력된 내용은 자동으로 삭제됩니다.");
                joCtrl.val(joCtrl.val().substr(0, (cutByteLength % 2 == 1) ? cutByteLength : cutByteLength + 1));
                
                panel.checksmsbyte();
            } else { panel.showcount(tempByteLength); }
        }

        if($.browser.mozilla || $.browser.opera) {
            joCtrl
                .unbind('.' + panel.onlyone + '_checksmsbyte')
                .bind('textchange.' + panel.onlyone + '_checksmsbyte', function () { panel.checksmsbyte(); });
        } else {
            joCtrl
                .unbind('.' + panel.onlyone + '_checksmsbyte')
                .bind('keyup.' + panel.onlyone + '_checksmsbyte', function () { panel.checksmsbyte(); });
        }
        panel.showcount(0);
    }
})(jQuery);