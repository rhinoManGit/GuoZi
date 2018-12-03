(function ($) {
    $.fn.jAlert = function (options) {
        var panel = this;
        this.option = jQuery.extend({ msg: '', loc: '', yeslogin: '', modal: true, buttons: { '확인': function () { $(this).dialog('close'); } } }, options);

        $(this).dialog({
            autoOpen: false,
            closeOnEscape: false,
            modal: this.option.modal,
            draggable: true,
            resizable: true,
            position: 'center',
            minWidth: 350,
            maxWidth: 600,
            maxHeight: 600,
            width: 350,
            zIndex: 10000,
            title: 'yes24.com ticket information',
            buttons: this.option.buttons,
            open: function (event, ui) { $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus(); },
            close: function (event, ui) {
                if (panel.option.yeslogin == '') {
                    if (panel.option.loc != '')
                        window.location.href = panel.option.loc;
                } else {
                    jsf_base_GoYes24Login();
                }
            }
        });

        if (this.option.msg != '') {
            $(this).html("<p align='center' class='dialogfont'><br/>" + this.option.msg + "</p>");
            $(this).dialog('open');
            return false;
        }
    }

    $.fn.jSlimAlert = function (options) {
        var panel = this;
        this.option = jQuery.extend({ msg: '', width: 350, height: 250 }, options);

        $(this).dialog({
            autoOpen: false,
            closeOnEscape: false,
            modal: true,
            draggable: true,
            resizable: false,
            position: 'center',
            width: this.option.width,
            height: this.option.height,
            zIndex: 10000,
            title: '',
            open: function (event, ui) { },
            close: function (event, ui) { $(this).html(""); }
        });

        $(this).parent().css('border', '1px solid #2A2A2A');
        $(this).parent().find('.ui-dialog-titlebar').css("display", "none");
        $(this).css('padding', "0");
        $(this).parent().css('padding', this.option.padding);
        $(this).css('overflow', 'hidden');

        if (this.option.msg != '') {
            $(this).html(this.option.msg);
            $(this).dialog('open');
            return false;
        }
    }

    $.fn.jConfirm = function (options) {
        this.option = jQuery.extend({ msg: '', buttons: { '확인': function () { $(this).dialog('close'); }, '취소': function () { $(this).dialog('close'); } } }, options);

        $(this).dialog({
            autoOpen: false,
            closeOnEscape: false,
            modal: true,
            draggable: true,
            resizable: true,
            position: 'center',
            minWidth: 350,
            maxWidth: 600,
            maxHeight: 600,
            width: 350,
            zIndex: 10000,
            title: 'yes24.com ticket confirm',
            buttons: this.option.buttons,
            open: function (event, ui) { $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus(); }
        });

        if (this.option.msg != '') {
            $(this).html("<p align='center' class='dialogfont'><br/>" + this.option.msg + "</p>");
            $(this).dialog('open');
            return false;
        }
    }

    $.fn.jMainPopup = function (options) {
        this.option = jQuery.extend({ left: 0, top: 0, width: 200, height: 200 }, options);

        $(this).dialog({
            autoOpen: false,
            closeOnEscape: false,
            modal: false,
            draggable: true,
            resizable: true,
            position: [this.option.left, this.option.top],
            width: this.option.width + 24,
            height: this.option.height + 93,
            zIndex: 10000,
            title: 'yes24.com ticket notice',
            buttons: {
                '오늘하루동안열지않기': function () {
                    $.cookie('' + $(this).attr('ID') + '', 'done', { expires: 1, path: '/', domain: 'ticket.yes24.com' });
                    $(this).dialog('close');
                },
                '취소': function () {
                    $(this).dialog('close');
                }
            },
            open: function (event, ui) { $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus(); } //1-3
        });

        if ($.cookie('' + $(this).attr('ID') + '') != 'done') {
            $(this).dialog('open');
            return false;
        }
    }

    $.fn.jPopup = function (options) {
        var panel = this;
        this.option = jQuery.extend({ modal: false, width: 200, height: 200, url: '', title: '', position: 'center', scrollbars: 'no' }, options);

        $(this).dialog({
            autoOpen: false,
            closeOnEscape: false,
            modal: this.option.modal,
            draggable: true,
            resizable: false,
            position: this.option.position,
            width: this.option.width + 22,
            height: this.option.height + 94,
            zIndex: 1000,
            title: 'yes24.com ticket' + (this.option.title == '' ? '' : ' - ' + this.option.title),
            open: function (event, ui) {
                $(this).focus();
                window.setTimeout(function () { $(document).unbind('mousedown.dialog-overlay').unbind('mouseup.dialog-overlay'); }, 100);
            },
            close: function (event, ui) { $(this).html(""); }
        });

        $(this).parent().css('border', '1px solid #a6c9e2');
        $(this).parent().find('.ui-dialog-titlebar').css("display", "block");
        $(this).parent().removeClass('ui-corner-all').addClass('ui-corner-all');
        if ($(this).css('padding') == "0px") $(this).css('padding', "0.5em 1em");
        if ($(this).parent().css('padding') == "0px") $(this).parent().css('padding', '2px');

        if (this.option.url != '') {
            $(this).html("<iframe id='dialogIFrame' width='100%' height='100%' marginwidth='0' marginheight='0' frameborder='0' scrolling='" + this.option.scrollbars + "'></iframe>");
            $(this).find("#dialogIFrame").attr('src', this.option.url);
            $(this).dialog('open');
            return false;
        }
    }

    $.fn.jSlimPopup = function (options) {
        var panel = this;
        this.option = jQuery.extend({
            modal: false,
            width: 200,
            height: 200,
            url: '',
            title: '',
            position: 'center',
            scrollbars: 'no',
            titlebar: 'no',
            padding: '0',
            corner: 'all'
        }, options);

        var loWidth = this.option.width;
        var loHeight = this.option.height;

        $(this).dialog({
            autoOpen: false,
            closeOnEscape: false,
            modal: this.option.modal,
            draggable: true,
            resizable: false,
            position: this.option.position,
            width: loWidth,
            height: loHeight,
            zIndex: 1000,
            title: 'yes24.com ticket' + (this.option.title == '' ? '' : ' - ' + this.option.title),
            open: function (event, ui) {
                $(this).focus();
                window.setTimeout(function () { $(document).unbind('mousedown.dialog-overlay').unbind('mouseup.dialog-overlay'); }, 100);
            },
            close: function (event, ui) { /*$(this).html("");*/ }
        });

        $(this).parent().css('border', '1px solid #2A2A2A');
        if (this.option.titlebar == 'no') $(this).parent().find('.ui-dialog-titlebar').css("display", "none");
        if (this.option.corner = 'no') $(this).parent().removeClass('ui-corner-all');
        $(this).css('padding', this.option.padding);
        if (this.option.padding == 0) $(this).parent().css('padding', this.option.padding);

        if (this.option.url != '') {
            $(this).html("<iframe id='dialogIFrame' width='100%' height='100%' marginwidth='0' marginheight='0' frameborder='0' scrolling='" + this.option.scrollbars + "'></iframe>");
            $(this).find("#dialogIFrame").attr('src', this.option.url);
            $(this).dialog('open');
            return false;
        }
    }

})(jQuery);

function jsf_dialog_PopupClose() {
    $j('#dialogPopup').dialog('close');
}

function jsf_dialog_PopupResize(jpiFrameDocWidth, jpiFrameDocHeight) {
    $j('#dialogPopup').dialog({ "width": jpiFrameDocWidth + 22, "height": jpiFrameDocHeight + 44 });
    $j('#dialogPopup').dialog({ "position": "center" });
}

function jsf_dialog_PopupResizeHeight(jpiFrameDocHeight) {
    $j('#dialogPopup').dialog("option", "height", jpiFrameDocHeight + 44);
    $j('#dialogPopup').dialog({ "position": "center" });
}

function jsf_dialog_SlimPopupResizeHeight(jpiFrameDocHeight) {

    if ($j.browser.msie) {
        jpiFrameDocHeight -= 2;
    } else {
    }    

    $j('#dialogPopup').dialog("option", "height", jpiFrameDocHeight);
    //$j('#dialogPopup').dialog({ "position": "center" });
}

var jcMODE_JQUERY = 1;
var jcMODE_WINDOW = 2;

/* 사이트용 정의 */
var jgSiteAlert = jcMODE_JQUERY;

function jsf_Alert(jpMsg) {
    if (jgSiteAlert == jcMODE_WINDOW) {
        jpMsg = jpMsg.replace(/<br \/>/g, "\n").replace(/<br\/>/g, "\n");
        alert(jpMsg);
    } else if (jgSiteAlert == jcMODE_JQUERY) {
        jpMsg = jpMsg.replace(/\r\n/g, "<br \/>").replace(/\n/g, "<br \/>");
        $j("#dialogAlert").jAlert({ "msg": jpMsg });
    }
}

function jsf_axAlert(jpMsg) {
    if (jgSiteAlert == jcMODE_JQUERY)
        $j("#dialogAlert").jAlert({ "msg": jpMsg });
}

var jgSitePopup = jcMODE_JQUERY;

/* 예매용 정의 */
var jgBookTAlert = jcMODE_JQUERY; // 티켓예매창
var jgBookPAlert = jcMODE_JQUERY; // 패키지예매창
var jgBookSAlert = jcMODE_JQUERY; // 좌석지정창

var jgBookAlert; // 각각의 예매창 안에서 위의 값으로 초기 셋팅

function fbk_Alert(jpMsg) {
    if (jgBookAlert == jcMODE_WINDOW) {
        jpMsg = jpMsg.replace(/<br \/>/g, "\n").replace(/<br\/>/g, "\n");
        alert(jpMsg);
    } else if (jgBookAlert == jcMODE_JQUERY)
        $j("#dialogAlert").jAlert({ "msg": jpMsg });
}

function fbk_axAlert(jpMsg) {
    if (jgBookAlert == jcMODE_JQUERY)
        $j("#dialogAlert").jAlert({ "msg": jpMsg });
}

var jgBookTPopup = jcMODE_WINDOW; // 티켓예매창
var jgBookPPopup = jcMODE_WINDOW; // 패키지예매창
var jgBookSPopup = jcMODE_WINDOW; // 좌석지정예매창

var jgBookPopup; // 각각의 예매창 안에서 위의 값으로 초기 셋팅
