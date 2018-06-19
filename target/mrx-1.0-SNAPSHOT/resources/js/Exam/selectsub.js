$(function () {
    ///点击专业
    $('#txtSub').click(function () {
        $('#divSub').show().dialog({
            height: 430, width: 610, modal: true, resizable: true,
            title: '请选择所学专业',
            buttons: [
                {
                    text: '确定', iconCls: 'icon-ok', plain: true,
                    handler: function () {
                        var jselected = $('#subTable').datagrid('getSelected');
                        if (jselected) {
                            $('#txtSub').val(jselected.ID + "-" + jselected.SubName);
                            ifShowOtherSub();
                            $("#divSub").dialog('close');
                        } else {
                            $.messager.alert("提示", "请选择您的专业。", "warning");
                            return false;
                        }
                    }
                },
                {
                    text: '取消', iconCls: 'icon-cancel', plain: true,
                    handler: function () {
                        $("#divSub").dialog('close');
                    }
                }],
            onOpen: function () {
                SubPageInit();
            }
        });
        SubPageInit();
        return false;
    });
    ///注册按钮事件
    $('#btnFindSub').linkbutton({ iconCls: "icon-search" }).unbind().click(function () {

        LoadSubData();
    });

    ///注册回车查询事件
    $('#txtFindSub').textbox('textbox').keydown(function (e) {
        if (e.keyCode == 13) {
            LoadSubData();
        }
    });
    SubPageInit();
});








///初始化专业页面
function SubPageInit() {
    $('#xk').combobox({
        url: '/Sub/GetXkList/',
        valueField: 'ID',
        textField: 'SubName',
        width: 100,
        panelHeight: '250',//自动高度适合  
        editable: false,

        onHidePanel: function () {
            $("#ml").combobox("setValue", '');//清空课程  
            var id = $('#xk').combobox('getValue');
            // alert(id);  
            $.ajax({
                type: "POST",
                url: '/Sub/GetMlList/?xkcode=' + id,
                cache: false,
                dataType: "json",
                success: function (data) {
                    $("#ml").combobox("loadData", data);
                }
            });
            LoadSubData();

        }
    });

    $('#ml').combobox({
        editable: false, 
        cache: false,
        width: 150,
        panelHeight: '250',//自动高度适合  
        valueField: 'ID',
        textField: 'SubName',
        onHidePanel: function () {
            LoadSubData();
        }

    });

    LoadSubData();
}


function LoadSubData() {
    var xkcode = $('#xk').combobox('getValue');
    var mlcode = $('#ml').combobox('getValue');
    var findkey = $("#txtFindSub").val();
    $('#subTable').datagrid({
        title: '',
        width: 580,
        height: 320,
        iconCls: 'icon-save',
        nowrap: true,
        autoRowHeight: false,
        striped: true,
        collapsible: false,
        url: '/Sub/GetSubList/?findkey=' + findkey + '&xkcode=' + xkcode + '&mlcode=' + mlcode,
        sortName: 'ID',
        sortOrder: 'asc',
        remoteSort: false,
        singleSelect: true,
        pagination: true,//分页控件  
        idField: 'ID',
        columns: [[
{ field: 'code', title: '', width: 50, checkbox: true },
{ field: 'ID', title: '编号', width: 100, },
{ field: 'SubName', title: '专业名称', width: 350 },
        ]],

        rownumbers: false
    });

    //设置分页控件  
    var p = $('#subTable').datagrid('getPager');
    $(p).pagination({
        pageSize: 10,//每页显示的记录条数，默认为10  
        pageList: [10],//可以设置每页记录条数的列表  
        beforePageText: '第',//页数文本框前显示的汉字  
        afterPageText: '页 共 {pages} 页',
        displayMsg: '当前显示 {from} - {to}    共 {total} 个专业',
        onBeforeRefresh: function () {
            //    alert('before refresh');
        }
    });
}





