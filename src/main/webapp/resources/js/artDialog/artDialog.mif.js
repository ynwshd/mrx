
var mif = new mifCommon();
function mifCommon() {

    toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
        positionClass: "toast-top-center",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "3000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
}


mifCommon.prototype.open = function (_url, _title, _width, _height, _closeFun) {
    var myHeight = _height == 0 ? $(window).innerHeight() - 45 : _height;
    var myWidth = _width == 0 ? $(window).innerWidth() - 20 : _width;
    if (myWidth > 1200) {
        myWidth = 1200;
    }
    if (myHeight > 1000) {
        myHeight = 1000;
    }
    art.dialog.open(_url, { title: _title, id: 'detail', width: myWidth, height: myHeight, lock: true, opacity: 0.3, close: _closeFun });
}

mifCommon.prototype.regEnter = function (obj, okfun) {
    if (!obj) {
        return false;
    }
    obj.keydown(function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            var index = $(obj).index(this);
            var newIndex = index + 1;
            if (length == newIndex) {
                newIndex = 0;
            }
            $(":button:eq(" + newIndex + ")").focus();
            $(obj).focus();
            if (typeof (okfun) != 'undefined' && okfun != null) {
                okfun();
            }
        }
    });


}
///将json里的/data2414123412/ 改为中文惯用的输出格式
mifCommon.prototype.jsonDateFormat = function (jsonDate) {
    try {
        var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));

        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var dateStr = date.getFullYear() + "-" + month + "-" + day;
        if (dateStr < "1900-01-01")
            return "";
        else
            return dateStr;
    } catch (ex) {
        return "";
    }
}
mifCommon.prototype.jsonDateTimeFormat = function (jsonDate) {
    try {
        var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var dateStr = date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        if (dateStr < "1900-01-01")
            return "";
        else
            return dateStr;
    } catch (ex) {
        return "";
    }
}
mifCommon.prototype.ajaxLoadDropDownItems = function (id, url, addblank, dispalyName, valueName, defaultValue, triggerOnChange) {
    if (typeof (addblank) == 'undefined') {
        addblank = true;
    }
    if (typeof (dispalyName) == 'undefined') {
        dispalyName = 'Key';
    }
    if (typeof (valueName) == 'undefined') {
        valueName = 'Val';
    }
    $.getJSON(url, function (data) {
        var jsondata = eval(data);
        var ddl = $('#' + id);
        ddl.empty();
        if (addblank) {
            var blankItem = $("<option value=''>-</option>");
            blankItem.appendTo(ddl);
        }
        $.each(jsondata, function (i, item) {
            var val1 = null;
            var val2 = null;
            $.each(item, function (key) {
                if (key == dispalyName) {
                    val1 = item[key];
                }
                else if (key == valueName) {
                    val2 = item[key];
                }

            })
            if (val1 != null && val2 != null) {
                var tempItem = $("<option style='height:25px;' value=" + val2 + ">" + val1 + "</option>");
                tempItem.appendTo(ddl);
            }
        })
        if (typeof (defaultValue) != 'undefined' && defaultValue != null) {
            ddl.val(defaultValue);
            if (typeof (triggerOnChange) != 'undefined' && triggerOnChange) {
                ddl.change(); //
            }
        }
    });
}
mifCommon.prototype.showOkMessageBox = function (msg, autoCloseForm) {
    art.dialog({
        icon: 'succeed',
        content: msg,
        ok: true,
        close: function () {
            if (typeof (autoCloseForm) != 'undefined' && autoCloseForm) {
                mif.closeForm();
            }
            return true;
        },

        lock: true, opacity: 0
    });
}
mifCommon.prototype.showWarningMessageBox = function (msg) {
    art.dialog({
        icon: 'warning',
        content: msg,
        ok: true,
        lock: true, opacity: 0
    });
}
mifCommon.prototype.showErrorMessageBox = function (msg) {
    art.dialog({
        icon: 'error',
        content: msg,
        ok: true,
        lock: true, opacity: 0
    });
}
mifCommon.prototype.showQueryMessageBox = function (msg, okfun, cancelfun) {
    art.dialog({
        icon: 'question',
        content: msg,
        ok: function () {
            if (typeof (okfun) != 'undefined' && okfun != null) {
                okfun();
            }
            else {
                return true;
            }
        },
        cancelVal: '取消',
        cancel: function () {
            if (typeof (cancelfun) != 'undefined' && cancelfun != null) {
                cancelfun();
            }
            else {
                return true;
            }
        },
        lock: true, opacity: 0
    });
}
mifCommon.prototype.showWaittingBox = function (msg) {
    art.dialog({
        id: 'waittingDlg',
        content: '<span><img src="/images/progress_loading.gif" style="vertical-align:middle;" /> ' + msg + '</span>',
        title: false,
        cancel: false,
        lock: true, opacity: 0.3
    });
}
mifCommon.prototype.closeWaittingBox = function (openByParent) {
    mif.closeForm('waittingDlg', openByParent);
}
mifCommon.prototype.getCheckBoxListVal = function (id, splitChar) {
    var result = "";
    var split = ',';
    if (typeof (splitChar) != undefined && splitChar != null && splitChar != '') {
        split = splitChar;
    }
    $('input[type=checkbox,name="' + id + '"]:checked').each(function () {
        result += $(this).val() + split;
    })
    return result;

    //    for (var i = 0; i < 500; i++) {
    //        var itemId = id + 'i';
    //        if ($("#" + itemId).length <= 0) {
    //            break;
    //        }
    //        else {
    //            if ($("#" + itemId).attr("checked") == true) {
    //                if (result != "") {
    //                    result += split;
    //                }
    //                result += split;
    //            }
    //        }
    //    }
}
mifCommon.prototype.setCheckBoxListVal = function (valArray) {
    //    var result = "";
    //    var split = ',';
    //    if (typeof (splitChar) != undefined && splitChar != null && splitChar != '') {
    //        split = splitChar;
    //    }
    //    for (var i = 0; i < 500; i++) {
    //        var itemId = id + 'i';
    //        if ($("#" + itemId).length <= 0) {
    //            break;
    //        }
    //        else {
    //            if($("#" + itemId).attr("value"))
    //        }
    //    }
}

mifCommon.prototype.ajax = function (url, params, sucFun) {
    var dataParam = "";
    if (typeof (params) != 'undefined' && params != null) {
        dataParam = params;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: dataParam,//"name=John&location=Boston",
        traditional: true,
        cache: false,
        success: function (result) {
            if (result.IsSuccess) {
                if (typeof (sucFun) != 'undefined' && sucFun != null) {
                    sucFun();
                }
                if (result.AppMsg.length > 0) {
                    toastr.success(result.AppMsg);
                }
            }
            else {
                mif.showWarningMessageBox(result.AppMsg);
            }
        },
        error: function (x, e) {
            mif.showErrorMessageBox(x.responsetText);
        }
    });
}
mifCommon.prototype.ajaxBack = function (url, params, sucFun) {
    var dataParam = "";
    if (typeof (params) != 'undefined' && params != null) {
        dataParam = params;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: dataParam,//"name=John&location=Boston",
        traditional: true,
        cache: false,
        success: function (data) {
            if (typeof (sucFun) != 'undefined' && sucFun != null) {
                sucFun(data);
            }
        },
        error: function (x, e) {
            mif.showErrorMessageBox(x.responsetText);
        }
    });
}
mifCommon.prototype.result = function (result, okfun) {
    if (result.IsSuccess) {
        if (typeof (okfun) != 'undefined' && okfun != null) {
            okfun();
        }
        toastr.success(result.AppMsg);
    }
    else {
        this.showWarningMessageBox(result.AppMsg);
    }
}
mifCommon.prototype.warning = function (msg) {
    toastr.warning(msg);
}
mifCommon.prototype.error = function (msg) {
    toastr.error(msg);
}
mifCommon.prototype.success = function (msg) {
    toastr.success(msg);
}
mifCommon.prototype.success = function (msg, url) {
    toastr.success(msg);
    if (url) {
        setTimeout(function () { window.location.href = url; }, 3000);
    }
}
mifCommon.prototype.closeForm = function (formId, openByParent) {
    var dlgId = 'detail';
    if (typeof (formId) != "undefined") {
        dlgId = formId;
    }
    if (typeof (openByParent) != "undefined" && openByParent == false) {
        art.dialog({ id: dlgId }).close();
    }
    else {
        parent.art.dialog({ id: dlgId }).close();
    }
}
mifCommon.prototype.claerInput = function (id, exceptIds) {//奇了怪了，只能用claerInput
    var exceptIdstring = "";
    if (typeof (exceptIds) != 'undefined' && exceptIds != null) {
        for (var i = 0; i < exceptIds.length; i++) {
            if ($.trim(exceptIds[i]) != "") {
                if (exceptIdstring != "") {
                    exceptIdstring += ",";
                }
                exceptIdstring += "#" + $.trim(exceptIds[i]);
            }
        }

    }
    $(':input', '#' + id)
     .not(':button, :submit, :reset,' + exceptIdstring)
     .val('')
     .removeAttr('checked')
     .removeAttr('selected');
}
mifCommon.prototype.setEnable = function (id, exceptIds, enable) {
    var exceptIdstring = "";
    if (typeof (exceptIds) != 'undefined' && exceptIds != null) {
        for (var i = 0; i < exceptIds.length; i++) {
            if ($.trim(exceptIds[i]) != "") {
                if (exceptIdstring != "") {
                    exceptIdstring += ",";
                }
                exceptIdstring += "#" + $.trim(exceptIds[i]);
            }
        }

    }
    $(':input[type!=hidden]', '#' + id)
     .not(exceptIdstring)
     .attr('disabled', !enable);

}
mifCommon.prototype.setEnable2 = function (ids, enable) {
    if (typeof (ids) != 'undefined' && ids != null) {
        for (var i = 0; i < ids.length; i++) {
            $('#' + $.trim(ids[i])).attr('disabled', !enable);
        }

    }
}
mifCommon.prototype.submit = function (beforeSubmit, formId) {
    var submit = true;
    if (typeof (beforeSubmit) != 'undefined' && beforeSubmit != null) {
        submit = beforeSubmit();
    }
    if (submit || typeof (submit) == 'undefined' || submit == null) {
        if (typeof (formId) != 'undefined' && formId != null) {
            $("#" + formId).submit();
        }
        else {
            $("form").submit();
        }
    }
}

//--------------------json region--------------------------
function obj2str(o, flag, replace, fieldArray) {
    var arr_start = "ARRAY_S";
    var arr_end = "ARRAY_E";
    if (flag == null) {
        flag = "\""; //默认是双引号  
    }
    if (replace == null) {
        replace = true;
    }
    var r = [];
    if (typeof o == "string" || o == null) {
        return o;
    }
    //alert(typeof(o));  
    if (typeof o == "object") {
        //alert(o.sort);  
        if (!o.sort) {
            //alert("in if");  
            r[0] = "{";
            for (var i in o) {
                if (typeof (fieldArray) != undefined && fieldArray != null) {
                    var find = false;
                    for (var n = 0; n < fieldArray.length; n++) {
                        if (fieldArray[n] == i) {
                            find = true;
                            break;
                        }
                    }
                    if (find == false) {
                        continue;
                    }
                }
                r[r.length] = flag;
                r[r.length] = i;
                r[r.length] = flag;
                r[r.length] = ":";
                r[r.length] = flag;
                r[r.length] = obj2str(o[i], flag, false, fieldArray);
                r[r.length] = flag;
                r[r.length] = ",";
            }
            r[r.length - 1] = "}";
        } else {//数组元素  
            r[0] = arr_start;
            for (var i = 0; i < o.length; i++) {
                r[r.length] = flag;
                r[r.length] = obj2str(o[i], flag, false, fieldArray);
                r[r.length] = flag;
                r[r.length] = ",";
            }
            r[r.length - 1] = arr_end;
        }

        var str = r.join("");
        //alert("结果:"+str);  
        //针对{} 就是没有属性的对象，会返回单个 },把它补齐  
        if (str == "}") {
            str = "{}";
        }
        //针对[] 就是长度为0的数组，会返回单个 ],把它补齐  
        if (str == arr_end) {
            str = arr_start + arr_end;
        }

        if (replace) {//在递归子循环中不替换,到最后统一替换  
            //替换掉 "{ }" "[ ]"  
            var reg = new RegExp(flag + "{", "g"); // 包含字符 "{  
            str = str.replace(reg, "{");

            reg = new RegExp("}" + flag, "g"); // 包含字符 }"  
            str = str.replace(reg, "}");

            reg = new RegExp(flag + arr_start, "g"); // 包含字符 "[  
            str = str.replace(reg, "[");

            reg = new RegExp(arr_end + flag, "g"); // 包含字符 ]"  
            str = str.replace(reg, "]");

            //alert(str);  

            if (str.indexOf(arr_start + "{") > -1) {
                reg = new RegExp(arr_start + "{", "g");
                str = str.replace(reg, "[{");
            }
            if (str.indexOf("}" + arr_end) > -1) {
                reg = new RegExp("}" + arr_end, "g");
                str = str.replace(reg, "}]");
            }
        }
        //alert("--"+str);  
        return str;
    }
    return o.toString();
}
//====================json end=============================
//---------------ztree region----------------------------
mifCommon.prototype.initTree = function (treeId, setting, nodeJson, asyncUrl) {

    var set = {
        data: {
            simpleData: {
                enable: true
            }
        },
        async: {
            enable: true,
            url: asyncUrl,
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: { "otherParam": "zTreeAsyncTest" },
            dataFilter: filter
        }

    };
    if (typeof (setting) != 'undefined' && setting != null) {
        set = setting;
    }

    $.fn.zTree.init($("#" + treeId), set, nodeJson);
}
mifCommon.prototype.initAsyncTree = function (treeId, asyncUrl, fnOnClick, fnonAsyncSuccess) {
    var setting = {
        view: {
            dblClickExpand: false,
            showLine: false
        },

        async: {
            enable: true,
            url: asyncUrl,
            autoParam: ["id", "name=n", "level=lv"]
        },
        callback: {
            onClick: fnOnClick,
            onAsyncSuccess: fnonAsyncSuccess
        }


    };
    if (typeof (setting) != 'undefined' && setting != null) {
        set = setting;
    }
    var ztree = $.fn.zTree.init($("#" + treeId), setting);
    return $.fn.zTree.getZTreeObj(treeId);
}
//================ztree end===============================
function KeyValObj(key, val) {
    this.Key = key;
    this.Val = val;
}
