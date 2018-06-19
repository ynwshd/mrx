﻿
function EditSussceHander() {
    $('#form1').form({
        url: editUrl,
        complete: function () { HideWaitMessageDialog(ShowWaitMessageDialog()); },
        success: function (data) {
            result = jQuery.parseJSON(data);
            if (result.IsSuccess) {
                $("#divDailog").dialog('close');
                InitGrid();
            }
            else {
                $.messager.alert("错误提示", result.AppMsg, "info");
                return false;
            }
        }
    });
    $('#form1').form('submit');
}
function ShowPickerPage(href, innerdivId, getSuccessHandler) {
    $('#' + innerdivId).html(__waitHTML);
    $.ajax({
        url: href, type: "GET", dataType: "html", cache: false,
        //beforeSend: function() { $('#' + divId).hide(); },
        complete: function () { $('#' + innerdivId).fadeIn("fast"); },
        success: function (responseHtml) {
            // 设置结果，并设置表格样式
            $('#' + innerdivId).html(responseHtml);
            $("input[class='easyui-textbox']").textbox();
            $("input[class='easyui-combobox']").combobox();
            //// 重新绑定事件
            //$('#' + divId + ' a[autoRedire=true]').click(function() { ShowPickerPage($(this).attr("href"), divId, getSuccessHandler); return false; });
            //$('#' + divId + ' select[autoRedire=true]').removeAttr("onchange").change(function() { 
            //	if( $(this).val().length > 0 ) 	ShowPickerPage($(this).val(), divId, getSuccessHandler); 
            //	return false; 
            //});
            //$('#' + divId + ' :text[autoRedire=true]').removeAttr("onchange").unbind('change').change(function(){
            //	var num = parseInt($(this).val());
            //	if( num > 0 && num <= parseInt($(this).attr("max")) ) {
            //		var url = UrlCombine( $(this).attr("baseUrl") ,  $(this).attr("param") + "=" + num.toString());
            //		ShowPickerPage(url, divId, getSuccessHandler); 
            //	}
            //	return false;
            //})
            //.unbind('keypress').keypress(function(e){
            //	if( e.keyCode == 13 || e.keyCode == 10 ){
            //		$(this).change();
            //		return false;
            //	}
            //} );

            if (getSuccessHandler)
                getSuccessHandler(divId);
        }
    });
}

function ShowEditItemDialog(itemId, divId, okFunc, shownFunc, width, height) {
    if (typeof (width) != "number") width = 600;
    if (typeof (height) != "number") height = 430;

    var isEdit = (itemId.length > 0);
    var j_dialog = $("#" + divId);

    if (j_dialog.attr("srcTitle") == undefined)
        j_dialog.attr("srcTitle", j_dialog.attr("title"));	// title属性会在创建对话框后被清除！

    var dlgTitle = (isEdit ? "编辑" : "添加") + j_dialog.attr("srcTitle");

    j_dialog.show().dialog({
        width: width, height: height, modal: true, resizable: true, title: dlgTitle, closable: true,
        iconCls: 'icon-edit',
        buttons: [
            {
                text: (isEdit ? "保存" : "创建"), iconCls: 'icon-ok', plain: true,
                handler: function () {
                    if (typeof (okFunc) == "function")
                        okFunc(j_dialog);
                }
            },
            {
                text: '取消', iconCls: 'icon-cancel', plain: true,
                handler: function () {
                    j_dialog.dialog('close');
                }
            }],
        onOpen: function () {
            if (typeof (shownFunc) == "function")
                shownFunc(j_dialog);

            j_dialog.find(":text.myTextbox").first().focus();
        }
    });
}

function ShowPickerDialog(divId, url, okButtonHanlder, getSuccessHandler, width, height, maxable) {
    if (typeof (width) != "number") width = 650;
    if (typeof (height) != "number") height = 450;

    $("#" + divId).show().dialog({
        //  title: title,
        maximizable: maxable,
        height: height, width: width, modal: true, resizable: true,
        iconCls: 'icon-edit',
        buttons: [
            {
                text: '确定', iconCls: 'icon-ok', plain: true,
                handler: function () {
                    if (okButtonHanlder) {
                        if (okButtonHanlder(divId))
                            $("#" + divId).dialog('close');
                        $("#" + divId).dialog('close');
                    }
                    else
                        $("#" + divId).dialog('close');
                }
            },
            {
                text: '取消', iconCls: 'icon-cancel', plain: true,
                handler: function () {
                    $("#" + divId).dialog('close');
                }
            }],
        onOpen: function () {
            ShowPickerPage(url, divId + "_inner", getSuccessHandler);
        }
    });
}

function ShowViewerDialog(divId, url, getSuccessHandler, width, height, maxable) {
    if (typeof (width) != "number") width = 850;
    if (typeof (height) != "number") height = 530;

    $("#" + divId).show().dialog({
        // title: title,
        maximizable: maxable,
        height: height, width: width, modal: true, resizable: true,
        iconCls: 'icon-edit',
        buttons: [
            {
                text: '关闭', iconCls: 'icon-cancel', plain: true,
                handler: function () {
                    $("#" + divId).dialog('close');
                }
            }],
        onOpen: function () {
            ShowPickerPage(url, divId + "_inner", getSuccessHandler);
        }
    });
}


function ShowNormalDialog(divId, okButtonHanlder, width, height) {
    if (typeof (width) != "number") width = 850;
    if (typeof (height) != "number") height = 530;

    $("#" + divId).show().dialog({
        height: height, width: width, modal: true, resizable: true,
        iconCls: 'icon-edit',
        buttons: [
            {
                text: '确定', iconCls: 'icon-ok', plain: true,
                handler: function () {
                    if (okButtonHanlder) {
                        okButtonHanlder(divId);
                    }
                    else
                        $("#" + divId).dialog('close');
                }
            },
            {
                text: '取消', iconCls: 'icon-cancel', plain: true,
                handler: function () {
                    $("#" + divId).dialog('close');
                }
            }]
    });
}


function ShowUserControlInDiv(href, divId) {
    $('#' + divId).html(__waitHTML);
    $.ajax({
        url: href, type: "GET", dataType: "html", cache: false,
        //beforeSend: function() { $('#' + divId).hide(); },
        complete: function () { $('#' + divId).fadeIn("fast"); },
        success: function (responseHtml) {
            // 设置结果，并设置表格样式
            $('#' + divId).html(responseHtml).FindAndSetGridStyle();

            // 重新绑定事件
            $('#' + divId + ' a[autoRedire=true]').click(function () { ShowUserControlInDiv($(this).attr("href"), divId); return false; });
            $('#' + divId + ' select[autoRedire=true]').removeAttr("onchange").change(function () {
                if ($(this).val().length > 0) ShowUserControlInDiv($(this).val(), divId);
                return false;
            });
            $('#' + divId + ' :text[autoRedire=true]').removeAttr("onchange").unbind('change').change(function () {
                var num = parseInt($(this).val());
                if (num > 0 && num <= parseInt($(this).attr("max"))) {
                    var url = UrlCombine($(this).attr("baseUrl"), $(this).attr("param") + "=" + num.toString());
                    ShowUserControlInDiv(url, divId);
                }
                return false;
            })
			.unbind('keypress').keypress(function (e) {
			    if (e.keyCode == 13 || e.keyCode == 10) {
			        $(this).change();
			        return false;
			    }
			});
        }
    });
}

function ShowSelectedItem(divId, txtName, hiddenId) {
    var jselected = $("#" + divId + " table.GridView :radio").filter(":checked");
    if (jselected.length != 1) return false;

    var itemId = jselected.attr("sid").substring(7);
    var name = $("#" + divId + " span[sid=itemName_" + itemId + "]").text();
    $("#" + txtName).val($.trim(name));
    $("#" + hiddenId).val(itemId);
    return true;
}

function BaseView(showEditUrl, winWidth, winHeiht) {
    ShowViewerDialog('divDailog', showEditUrl, null, winWidth, winHeiht, false);
}

function BaseAdd(showEditUrl, EditSussceHander, EditInitHander, winWidth, winHeiht) {

    ShowPickerDialog('divDailog', showEditUrl, EditSussceHander, EditInitHander, winWidth, winHeiht, false);
}

function BaseEdit(showEditUrl, EditSussceHander, EditInitHander, winWidth, winHeiht) {

    ShowPickerDialog('divDailog', showEditUrl, EditSussceHander, EditInitHander, winWidth, winHeiht, true);
}


function BasePostEdit(url, postSucessHandler) {
    $('#form1').form({
        type: "post",
        url: url,
        complete: function () { HideWaitMessageDialog(ShowWaitMessageDialog()); },
        success: function (data) {
            result = jQuery.parseJSON(data);
            if (result.IsSuccess) {
                $("#divDailog").dialog('close');
                if (postSucessHandler) {
                    postSucessHandler();
                } else {
                    TipMessageBox(result.AppCode, "", result.AppMsg);
                }
             
            }
            else {
                $.messager.alert("错误提示", result.AppMsg, "info");
            }
        }
    });
    $('#form1').form('submit');
    return true;
}
function BaseUnDel(_unDelUrl, _rowId, _rowName) {
    $.messager.confirm('恢复确认', '您确定要恢复[' + _rowName + ']吗？', function (r) {
        if (r) {
            $.ajax({
                type: "post",
                url: _unDelUrl,
                data: {
                    id: _rowId,
                    DeleteType: 0
                },
                success: function (data) {
                    var result = jQuery.parseJSON(data);
                    if (result.IsSuccess) {
                        TipMessageBox(1, "提示", result.AppMsg, 3000);
                        $('#grid').datagrid('reload');
                    } else {
                        $.messager.alert('提示', result.AppMsg, "info");
                    }
                }
            });
        }
    });
}

function BaseDel(_delUrl, _rowId, _rowName) {
    $.messager.confirm('删除确认', '您确定要将[' + _rowName + ']放入回收站吗？', function (r) {
        if (r) {
            $.ajax({
                type: "post",
                url: _delUrl,
                data: {
                    id: _rowId,
                    DeleteType: 1
                },
                success: function (data) {
                    var result = jQuery.parseJSON(data);
                    if (result.IsSuccess) {
                        TipMessageBox(1, "提示", result.AppMsg, 3000);
                        $('#grid').datagrid('reload');
                    } else {
                        $.messager.alert('提示', result.AppMsg, "info");
                    }
                }
            });
        }
    });
}
function BaseRemove(_delUrl, _rowId, _rowName) {

    $.messager.confirm('删除确认', '您确定要彻底删除[' + _rowName + ']吗？', function (r) {
        if (r) {
            $.ajax({
                type: "post",
                url: _delUrl,
                data: {
                    id: _rowId,
                    DeleteType: 2
                },
                success: function (data) {
                    var result = jQuery.parseJSON(data);
                    if (result.IsSuccess) {
                        TipMessageBox(1, "提示", result.AppMsg, 3000);
                        $('#grid').datagrid('reload');
                    } else {
                        $.messager.alert('提示', result.AppMsg, "info");
                    }
                }
            });
        }
    });
}
function BaseDelTreeGrid(rowId, rowName) {

    $.messager.confirm('删除确认', '您确定要删除[' + rowName + ']吗？', function (r) {
        if (r) {
            $.ajax({
                url: delUrl,
                data: { id: rowId },
                success: function (data) {
                    var result = jQuery.parseJSON(data);
                    if (result.IsSuccess) {
                        $('#grid').treegrid('reload');
                    } else {
                        $.messager.alert('提示', result.AppMsg, "info");
                    }
                }
            });
        }
    });
}
function BaseCheckSelect(row) {
    if (!row) {
        $.messager.alert("错误提示", "请选择要编辑的行", "info");
        return false;
    }
    return true;
}

//显示本页面功能按钮
function ShowPopButton(popCode) {
    $.ajax({
        url: '/AjaxComm/GetBtn.jsp?code=' + popCode, type: "GET", dataType: "html", cache: false,
        success: function (responseHtml) {
            // 设置结果，并设置表格样式
            $('#popButton').html(responseHtml);
        }
    });
}

//显示本页面功能按钮
function GetAjaxText(Url) {
    var result = '';
    $.ajax({
        url: Url, type: "GET", cache: false,
        async: false,
        success: function (responseHtml) {
            // 设置结果，并设置表格样式
            result = responseHtml;
        }
    });
    return result;
}

function ValidateControl(expression, message) {
    if ($.trim($(expression).val()).length == 0) {
        $.messager.alert(g_MsgBoxTitle, message, 'warning');
        return false;
    }
    return true;
}

