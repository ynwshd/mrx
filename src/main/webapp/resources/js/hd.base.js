﻿var g_MsgBoxTitle = "便民大厅-文山智慧人社";
var __waitHTML = '<div style="padding: 20px;"><img src="/sysimg/360-1.jpg" /><span style="font-weight: bold;padding-left: 10px; color: #FF66CC;">请稍候...</span></div>';
var g_deleteButtonFilter = "a[title='删除']";
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);


//为日期增加一个格式化方法
//hd@20171109
//调用 Data.format("yyy-MM-dd")等
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

$(function () {
    // 设置Ajax操作的默认设置
    $.ajaxSetup({
        cache: false,
        crossDomain: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //if (typeof (errorThrown) != "undefined")
            //    mif.showErrorMessageBox("调用服务器失败。<br />" + errorThrown, 'error');
            //else {
                var error = "<b style='color: #f00'>" + XMLHttpRequest.status + "  " + XMLHttpRequest.statusText + "</b>";
                var start = XMLHttpRequest.responseText.indexOf("<title>");
                var end = XMLHttpRequest.responseText.indexOf("</title>");
                if (start > 0 && end > start)
                    error += "<br /><br />" + XMLHttpRequest.responseText.substring(start + 7, end);
                mif.showErrorMessageBox("调用服务器失败。出错信息：<br />" + error, 'error');
            //}
        },
        complete: function (xhr, status) {
            var sessionStatus = xhr.getResponseHeader('sessionstatus');
            if (sessionStatus == 'timeout') {
                var top = getTopWinow();
                mif.showErrorMessageBox("由于您长时间没有操作, session已过期, 请重新登录.");
                top.location.href = '/account/login/';

            }
        }
    });

});



// 显示Ajax操作时的提示窗口
function ShowWaitMessageDialog(dlgTitle) {
    if (typeof (dlgTitle) != "string")
        dlgTitle = "请求处理中";

    var j_dialog = $(__waitHTML);
    j_dialog.appendTo('body').show().dialog({
        height: 120, width: 350, modal: true, resizable: false, closable: false, title: dlgTitle
    });
    return j_dialog;
}

// 关闭Ajax操作时的提示窗口
function HideWaitMessageDialog(j_dialog) {
    if (j_dialog == null)
        return;
    j_dialog.dialog('close');
    j_dialog.remove();
    j_dialog = null;
}

// 将一个select控件显示成Easy-UI的ComboBox样式
jQuery.fn.SetComboBox = function () {
    return this.each(function () {
        var jComboBox = $(this);
        var maxheight = 0;
        // 说明：使用 panelWidth 这个自定义标签实在是没有办法的事，因为如果下拉框放在隐藏的层中，Easy-UI在显示时，宽度会为2px
        //       panelHeight 的使用，也是类似的原因。
        if (jComboBox.is("[panelHeight]"))
            maxheight = parseInt(jComboBox.attr("panelHeight"));
        else {
            maxheight = $("option", this).length * 20;
            if (maxheight > 500) maxheight = 500;
            else maxheight += 15;	// 不多加一点，有时会出现滚动条，不好看
        }

        var pWidth = 0;
        if (jComboBox.is("[panelWidth]"))
            pWidth = parseInt(jComboBox.attr("panelWidth"));
        else
            pWidth = (jComboBox.width() < 10 ? (parseInt(jComboBox.css("width")) + 20) : null);

        $(this).data("originalVal", $(this).val());

        jComboBox.combobox({
            panelHeight: maxheight, panelWidth: pWidth,
            editable: jComboBox.is("[combobox=editable]"),
            onSelect: function () { jComboBox.val($(this).combobox('getValue')); /*$(this).combobox("hidePanel");*/ jComboBox.change(); }
        });
    });
};

// 设置下拉框的当前选择值
jQuery.fn.SetComboBoxValue = function (val) {
    // 由于Easy-UI的Combobox的setValue()方法有BUG，调用后，有时候取的值会不对。
    return this.each(function () {
        $(this).val(val).combobox("setValue", val);
    });
}

// 重置FORM中的所有控件的值
jQuery.fn.ResetControlValues = function (val) {
    return this.each(function () {
        var j_form = $(this);
        j_form.clearForm();
        $("select.combobox-f", j_form).each(function () { // 纠正上句调用所产生的错误。
            $(this).SetComboBoxValue($(this).data("originalVal"));
        });
    });
}

// 设置数据网格样式
jQuery.fn.SetGridStyle = function () {
    return this.each(function () {
        $(this).find('>tbody>tr')
			//.filter(':not(.GridView_SelectedRowStyle)')
			.removeClass()
			.filter(':first').addClass("GridView_HeaderStyle").end()	// 如果使用thead，则可以不用这种处理
			.filter(':gt(0)')
			.filter(':odd').addClass("GridView_AlternatingRowStyle").end()
			.filter(':even').addClass("GridView_RowStyle");		//.end()
        //.filter(':last').has("div.pagination").removeClass().addClass("GridView_FooterStyle");	//如果使用tfoot，则可以不用这种处理 
    });
}

// 查找所有的数据网格，并设置样式
jQuery.fn.FindAndSetGridStyle = function () {
    return this.each(function () {
        $(this).find('table.GridView').SetGridStyle();
    });
}

function UrlCombine(str1, str2) {
    var flag = (str1.indexOf('?') >= 0 ? '&' : '?');
    return (str1 + flag + str2);
}

function SetPageNumberTextbox(ctlId) {
    $('#' + ctlId).change(function () {
        var num = parseInt($(this).val());
        if (num > 0 && num <= parseInt($(this).attr("max"))) {
            var url = UrlCombine($(this).attr("baseUrl"), $(this).attr("param") + "=" + num.toString());
            window.location.href = url;
        }
        return false;
    })
	.keypress(function (e) {
	    if (e.keyCode == 13 || e.keyCode == 10) {
	        $(this).change();
	        return false;
	    }
	});
}

// 检查文本框是否已有输入内容
function CheckTextboxIsInputed(textbox, errorMessage) {
    if ($.trim($("#" + textbox).val()).length == 0) {
        $.messager.alert(g_MsgBoxTitle, errorMessage, 'warning', function () { $("#" + textbox).focus(); });
        return false;
    }
    else
        return true;
}

// 将文本框“改造”成“有搜索对话框功能”的控件
function SetSearchTextbox(textboxId, hiddenId, pickButtonClick) {
    var j_text = $('#' + textboxId);
    if (j_text.attr("readonly") == "readonly" || j_text.attr("disabled") == "disabled")
        return false;

    var width = j_text.width();
    var height = j_text.height() - 2;

    var j_div = $("<div></div>").insertBefore(j_text).addClass(j_text.attr("class")).css("width", width).css("padding", "1px");

    j_text.removeClass("myTextbox").addClass("myTextboxReadonly").css("width", (width - 42)).css("float", "left").css("border", "0px").css("height", height).attr("readonly", "readonly");
    j_div.append(j_text);

    $("<a></a>").attr("title", "选择").addClass("floatButton").addClass("searchButton").appendTo(j_div).click(pickButtonClick);
    $("<a></a>").attr("title", "清除").addClass("floatButton").addClass("clearButton").appendTo(j_div).click(function () {
        j_text.val("").change();
        $("#" + hiddenId).val("");
        return false;
    });
}

// 将Fieldset“改造”成“有折叠”功能
jQuery.fn.MakeFieldsetCollapseEnabled = function () {
    return this.each(function () {
        var j_legend = $(this).find("legend");
        if (j_legend.length == 1) {
            var j_title = $("<span></span>").text(j_legend.text()).css("display", "block").css("float", "left");
            var j_h1 = $("<h1></h1>").prependTo(this).addClass("legend_h1").append(j_title);
            j_legend.nextAll().css("margin", "8px");
            j_legend.remove();
            var j_button = $("<a></a>").addClass("layout_button").addClass("layout_button_down").click(function () {
                if ($(this).hasClass("layout_button_down")) {
                    $(this).removeClass("layout_button_down").addClass("layout_button_up");
                    j_h1.nextAll().hide();
                }
                else {
                    $(this).removeClass("layout_button_up").addClass("layout_button_down");
                    j_h1.nextAll().show();
                }
                return false;
            })
			.appendTo(j_h1);
            j_h1.click(function () { j_button.click(); });
            $(this).css("padding", "0px").css("width", "99%");
        }
    });
}



// 解析一个字符串中的日期
function parseDate(str) {
    if (typeof (str) == 'string') {
        var results = str.match(/^\s*0*(\d{4})-0?(\d{1,2})-0?(\d{1,2})\s*$/);
        if (results && results.length > 3)
            return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]));
    }
    return null;
}

// 根据二个字符串，返回一个日期范围。
function GetDateRange(txtStart, txtEnd) {
    //	var _date1 = $("#" + txtStart).val();
    //	var _date2 = $("#" + txtEnd).val();
    var _date1 = $("#" + txtStart).datebox("getValue");
    var _date2 = $("#" + txtEnd).datebox("getValue");

    var _d1 = parseDate(_date1);
    var _d2 = parseDate(_date2);
    if (_date1.length > 0 && _d1 == null) {
        alert("日期格式输入无效。"); $("#" + txtStart).focus(); return null;
    }
    if (_date2.length > 0 && _d2 == null) {
        alert("日期格式输入无效。"); $("#" + txtEnd).focus(); return null;
    }
    if (_date1.length > 0 && _date2.length > 0 && _d1 > _d2) {
        alert("日期范围输入无效。"); $("#" + txtEnd).focus(); return null;
    }
    var obj = { StartDate: _date1, EndDate: _date2 };
    return obj;
}


function ValidateControl(expression, message) {
    if ($.trim($(expression).val()).length == 0) {
        $.messager.alert(g_MsgBoxTitle, message, 'warning');
        return false;
    }
    return true;
}


//几秒后转到页面
function waitGo(p_URL, p_Time) {
    setTimeout("window.location.href='" + p_URL + "';", p_Time);
}

///打印
function printDiv(divId) {
    var headstr = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
    headstr += "<head><link rel=\"Stylesheet\" href=\"/Content/css/bootstrap.min.css\" type=\"text/css\" /> <link rel=\"Stylesheet\" href=\"/Content/css/css.css\" type=\"text/css\" />   <title></title></head><body>";
    var footstr = "</body>";
    var newstr = $('#' + divId).html();
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    document.body.innerHTML = oldstr;
}

function setVillageTree() {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', '折叠这个机构');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', '展开这个机构').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', '折叠这个机构').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });
}

function isdate(strDate) {
    re = /(^(\d{4})(\d{2})(\d{2})$)|(^(\d{4})-(\d{1,2})-(\d{1,2})$)/g;//正则表达式
    if (re.test(strDate))//判断日期格式符合YYYY-MM-DD或YYYYMMDD
    {
        return true;
    }
}

function isyyyymmdd(strDate) {
    re = /(^(\d{4})(\d{2})(\d{2})$)/g;//正则表达式
    if (re.test(strDate))//判断日期格式符合YYYYMMDD
    {
        return true;
    }
}

function getNowyyyymm() {
    var date = new Date();

    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + "" + month;
    return currentdate;
}
function getdatestr() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + "-" + month + "-" + strDate;
    return currentdate;
}
function formatdate(date) {
    if (!date) {
        return;
    }
    var mydate = new Date(date);
    var month = mydate.getMonth() + 1;
    var strDate = mydate.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = mydate.getFullYear() + "-" + month + "-" + strDate;
    return currentdate;
}

$.extend($.fn.validatebox.defaults.rules, {
    password: {
        validator: function (value, param) {
            var regstr = /^[a-zA-Z0-9_]{6,16}$/
            return regstr.test(value);
        },
        message: '登录密码应为6-16位'
    },
    regpassword: {
        validator: function (value, param) {
            var regstr = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            return regstr.test(value);
        },
        message: '注册密码应为6-16位，且同时包含字母和数字'
    },
    equalTo: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '重复输入不一致'
    },

    cnname: {
        validator: function (value, param) {
            var regstr = /^[\u4e00-\u9fa5]+$/;
            return regstr.test(value) && value.length >= 2 && value.length <= 5;
        },
        message: "姓名只能是2-5个字的中文"
    },
    officetel: {
        validator: function (value, param) {
            var regstr = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
            return regstr.test(value);
        },
        message: "坐机电话号码格式不正确"
    },
    mobile: {
        validator: function (value, param) {
            var regstr = /^0?(1[0-9])[0-9]{9}$/;
            return regstr.test(value);
        },
        message: "手机号码格式不正确"
    },

    idcard: {
        validator: function (value, param) {
            var regstr = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return regstr.test(value);
        },
        message: "身份证号格式不正确"
    },

    imgcode: {
        validator: function (value, param) {
            if (value.length != 4) {
                return false;
            } else {
                var result = false;
                $.ajax({
                    url: '/comm/CheckImgCode/',
                    type: 'get',
                    async: false,
                    data: { 'ImgCode': value },
                    success: function (data) {
                        result = data == "true";
                    }
                });
                return result;
            }
        },
        message: "验证码错误"
    },
    confirmPass: {
        validator: function (value, param) {
            var pass = $(param[0]).passwordbox('getValue');
            return value == pass;
        },
        message: '确认密码不一致.'
    }


});

//校验手机号是否合法
function isPhoneNum(phonenum) {
    var myreg = /^0?(1[0-9])[0-9]{9}$/;
    if (!myreg.test(phonenum)) {
        return false;
    } else {
        return true;
    }
}