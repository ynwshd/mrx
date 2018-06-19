
var mif = new mifCommon();
function mifCommon() {

    toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
        positionClass: "toast-top-center",
        onclick: null,
        showDuration: "300",
        hideDuration: "600",
        timeOut: "2000",
        extendedTimeOut: "2000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
}

mifCommon.prototype.tostring = function (o) {
    var r = [];
    if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    }
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + mif.tostring(o[i]));
            }
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(mif.tostring(o[i]))
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}
mifCommon.prototype.open = function (_url, _title, _width, _height, _closeFun) {
    var myHeight = _height == 0 ? $(window).innerHeight() - 60 : _height;
    var myWidth = _width == 0 ? $(window).innerWidth() - 20 : _width;
    if (myWidth > 1200) {
        myWidth = 1200;
    }
    if (myHeight > 1000) {
        myHeight = 1000;
    }
    art.dialog.open(_url, { title: _title, id: 'detail', width: myWidth, height: myHeight, lock: true, opacity: 0.3, close: _closeFun });
}
/**
* 以POST表单方式打开新窗口的JQUERY实现
@param:url 需要打开的URL
@param:args URL的参数，数据类型为object
@param:name 打开URL窗口的名字，如果同一按钮需要重复地打开新窗口，
而不是在第一次打开的窗口做刷新，此参数应每次不同
@param:windowParam 新打开窗口的参数配置
*/
mifCommon.prototype.postWindow = function (url, args, name, windowParam) {

    //创建表单对象
    var _form = $("<form></form>", {
        'id': 'tempForm',
        'method': 'post',
        'action': url,
        'target': name,
        'style': 'display:none'
    }).appendTo($("body"));

    //将隐藏域加入表单
    for (var i in args) {
        _form.append($("<input>", { 'type': 'hidden', 'name': i, 'value': args[i] }));
    }



    //绑定提交触发事件
    _form.bind('submit', function () {
        window.open("about:blank", name, '');
    });

    //触发提交事件
    _form.trigger("submit");
    //表单删除
    _form.remove();
}
mifCommon.prototype.regEnter = function (obj, successFun) {
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
            if (typeof (successFun) != 'undefined' && successFun != null) {
                successFun();
            }
        }
    });


}


mifCommon.prototype.ynFormat = function (value, row, index) {

    if (value == "1" || value == 1 || value == true) {
        return "<span class='text text-success glyphicon glyphicon-ok'>是</span>";
    } else {
        return "<span class='text text-danger glyphicon glyphicon-remove'>否</span>";

    }
}
mifCommon.prototype.ynFormatter = function (value, row, index) {

    if (value == "1" || value == 1 || value == true) {
        return "<span class='text text-success glyphicon glyphicon-ok'>是</span>";
    } else {
        return "<span class='text text-danger glyphicon glyphicon-remove'>否</span>";

    }
}
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
mifCommon.prototype.showQueryMessageBox = function (msg, successFun, cancelfun) {
    art.dialog({
        icon: 'question',
        content: msg,
        ok: function () {
            if (typeof (successFun) != 'undefined' && successFun != null) {
                successFun();
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

mifCommon.prototype.ajax = function (url, params, successFun, silence) {
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
            mif.result(result, successFun, silence);
            return result;
        }
    });
}
mifCommon.prototype.ajaxBack = function (url, params, successFun) {
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
            if (typeof (successFun) != 'undefined' && successFun != null) {
                successFun(data);
            }
        }
    });
}
mifCommon.prototype.result = function (result, successFun, silence) {
    if (result.IsSuccess) {
        if (typeof (successFun) != 'undefined' && successFun != null) {
            successFun(result);
        }
        if (!silence) {
            toastr.success(result.AppMsg);
        }

    }
    else {
        mif.showWarningMessageBox(result.AppMsg);
    }
}
mifCommon.prototype.warning = function (msg) {
    toastr.warning(msg);
}
mifCommon.prototype.error = function (msg) {
    toastr.error(msg, { timeOut: "6000" });
}
mifCommon.prototype.alert = function (msg) {
    mif.showErrorMessageBox(msg);
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

mifCommon.prototype.editTG = function (_editUrl, _title, _width, _height, _closeFun, _gridId) {

    if (!_gridId) {
        _gridId = "grid";
    }
    if (!_closeFun) {
        _closeFun = function () { $('#' + _gridId).treegrid('reload'); }
    }
    var row = $('#' + _gridId).treegrid('getSelected');
    if (row) {
        _editUrl = _editUrl + "?id=" + row.Id;
        mif.open(_editUrl, _title, _width, _height, _closeFun);
    }
    else {
        mif.warning("请选择要操作的行");
    }
}
mifCommon.prototype.delTG = function (delUrl, gridId, okFun, errFun) {
    if (!gridId) {
        gridId = "grid";
    }
    var row = $('#' + gridId).treegrid('getSelected');
    if (row) {
        mif.showQueryMessageBox('你确定要删除[' + row.Name + ']吗?', function () {
            mif.ajax(delUrl, { id: row.Id }, okFun, errFun);
            $('#' + gridId).treegrid('reload');
        }
        );
    }
    else {
        mif.warning("请选择要操作的行");
    }
}
mifCommon.prototype.postRowTG = function (postUrl, postName, gridId, okFun, errFun) {
    if (!gridId) {
        gridId = "grid";
    }
    var row = $('#' + gridId).treegrid('getSelected');
    if (row) {
        mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
            mif.ajax(postUrl, row, okFun, errFun);
            $('#' + gridId).treegrid('reload');
        }
        );
    }
    else {
        mif.warning("请选择要" + postName + "的行");
    }
}
mifCommon.prototype.editDG = function (_editUrl, _title, _width, _height, _closeFun, _gridId) {

    if (!_gridId) {
        _gridId = "grid";
    }
    if (!_closeFun) {
        _closeFun = function () { $('#' + _gridId).datagrid('reload'); }
    } else {
        _closeFun = function () { _closeFun(); $('#' + _gridId).datagrid('reload'); }
    }
    var row = $('#' + _gridId).datagrid('getSelected');
    if (row) {
        _editUrl = _editUrl + "?id=" + row.Id;
        mif.open(_editUrl, _title, _width, _height, _closeFun);
    }
    else {
        mif.warning("请选择要操作的行");
    }
}
mifCommon.prototype.postRowDG = function (postUrl, postName, gridId, okFun, errFun) {
    if (!gridId) {
        gridId = "grid";
    }
    var row = $('#' + gridId).datagrid('getSelected');
    if (row) {
        mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
            mif.ajax(postUrl, row, okFun, errFun);
            $('#' + gridId).datagrid('reload');
        }
        );
    }
    else {
        mif.warning("请选择要" + postName + "的行");
    }
}
mifCommon.prototype.postRowDGIn = function (postUrl, postName, index, notAsk, gridId, okFun, errFun) {

    if (!gridId) {
        gridId = "grid";
    }
    if (typeof (index) != 'undefined' && index != null) {
        $('#' + gridId).datagrid("selectRow", index);

    } else {
        mif.warning("找不到操作的行");
        return false;
    }
    var row = $('#' + gridId).datagrid('getSelected');
    if (row) {
        ///不提示，默认
        if (notAsk == true) {
            mif.ajax(postUrl, row, okFun, errFun);
            $('#' + gridId).datagrid('reload');

        } else {
            mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
                mif.ajax(postUrl, row, okFun, errFun);
                $('#' + gridId).datagrid('reload');

            }
            );
        }

    }

}
mifCommon.prototype.delDG = function (delUrl, gridId, okFun, errFun) {
    mif.postRowDG(delUrl, "删除", gridId, okFun, errFun);
    $('#' + gridId).datagrid('reload');
}
mifCommon.prototype.saveForm = function (formid, postUrl, okFun, errFun, btnObjId, silence, completeFun) {
    var myForm = $(formid);
    var btnText = "提交";
    var btnObj = $('#btnSave');
    if (!myForm) {
        mif.error('找不到表单');
        return;
    }
    if (btnObjId) {
        btnObj = $(btnObjId);
        btnText = btnObj.text();
    }
    myForm.ajaxForm({
        url: postUrl,
        beforeSubmit: function () {
            if (btnObj) {
                btnText = btnObj.text();
                btnObj.addClass('disabled');
                btnObj.text("正在提交数据");
            }
            return true;
        },
        complete: function () {
            if (btnObj) {
                btnObj.removeClass("disabled");
                btnObj.text(btnText);
            }
            if (typeof (completeFun) != 'undefined' && completeFun != null) {
                completeFun();
            }
        }
        ,
        success: function (result) {

            if (okFun != null && okFun != 'undefined') {
                mif.result(result, okFun(result), silence);
            }
            mif.result(result);
        }
    });
}


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

