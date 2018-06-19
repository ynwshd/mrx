$(function () {
    $('#btnFindJob').linkbutton({ iconCls: "icon-search" }).unbind().click(function () {
        LoadJobData();
    });
    $('#txtJob').bind("click", (function () {
        $('#divJob').show().dialog({
            height: 430, width: 610, modal: true, resizable: true,
            title: '请选择要报考的岗位',
            buttons: [
                {
                    text: '确定', iconCls: 'icon-ok', plain: true,
                    handler: function () {
                        var jselected = $('#jobTable').datagrid('getSelected');
                        if (jselected) {
                            $('#txtJob').val(jselected.岗位代码 + "-" + jselected.招聘单位 + "|" + jselected.岗位名称);
                            $("#divJob").dialog('close');
                        } else {
                            $.messager.alert("提示", "请选择要报考的岗位。", "warning");
                            return false;
                        }
                    }
                },
                {
                    text: '取消', iconCls: 'icon-cancel', plain: true,
                    handler: function () {
                        $("#divJob").dialog('close');
                    }
                }],
            onOpen: function () {
                JobPageInit();
            }
        });

        return false;
    }));
    ///注册回车查询事件
    $('#txtFindJob').textbox('textbox').keydown(function (e) {
        if (e.keyCode == 13) {
            JobPageInit();
        }
    });
});
///初始化页面
function JobPageInit() {
    $('#ddlCity').combobox({
        url: '/Job/GetCityList/',
        valueField: '县区编码',
        textField: '县区名称',
        width: 100,
        panelHeight: '220',//自动高度适合  
        editable: false,
        onHidePanel: function () {
            LoadJobData();
        }
    });
    LoadJobData();
}

function LoadJobData() {
    var strkey = $("#txtFindJob").val();
    var citycode = $("#ddlCity").combobox('getValue');
    $('#jobTable').datagrid({
        title: '',
        width: 580,
        height: 320,
        iconCls: 'icon-save',
        nowrap: true,
        autoRowHeight: false,
        striped: true,
        collapsible: false,
        url: '/Job/GetJobList/?findkey=' + strkey + '&citycode=' + citycode,
        sortName: '岗位代码',
        sortOrder: 'asc',
        remoteSort: false,
        singleSelect: true,
        pagination: true,//分页控件  
        idField: '岗位代码',
        columns: [[
  { field: 'code', title: '', width: 50, checkbox: true },
{ field: '岗位代码', title: '岗位代码', width: 100, },
{ field: '招聘单位', title: '招聘单位', width: 250 },
{ field: '岗位名称', title: '岗位名称', width: 100 },
{ field: '招聘人数', title: '招聘人数', width: 80, align: 'center' }
        ]],

        rownumbers: false
    });

    //设置分页控件  
    var p = $('#jobTable').datagrid('getPager');
    $(p).pagination({
        pageSize: 10,//每页显示的记录条数，默认为10  
        pageList: [10],//可以设置每页记录条数的列表  
        beforePageText: '第',//页数文本框前显示的汉字  
        afterPageText: '页 共 {pages} 页',
        displayMsg: '当前显示 {from} - {to}    共 {total} 个岗位',
        onBeforeRefresh: function () {
            //    alert('before refresh');
        }
    });
}








