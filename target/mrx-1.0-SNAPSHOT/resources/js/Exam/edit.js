

$(function () {

    $(document).ready(function () {
        setBtnTime($('#btnPost'), $('#btnPost').val());
        SetAjaxForm();
    });


    ifShowAwardMark();
    ifShowWorkDep();
    ifShowOtherSub();
    $("#ddlAward").combobox({
        onChange: function () {
            ifShowAwardMark();
        }

    });

    $("#ddlWorkYear").combobox({
        onChange: function () {
            ifShowWorkDep();
        }

    });


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
                            $('#txtJob').val(jselected.岗位代码 + "-" + jselected.招聘单位 + "-" + jselected.岗位名称);
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
    //==以下是专业的
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

});



function ifShowAwardMark() {
    if ($('#ddlAward').combobox('getValue') > "0") {
        $('#trAwardMark').show();
    } else {
        $('#trAwardMark').hide();
    }
}
function ifShowWorkDep() {
    if ($('#ddlWorkYear').combobox('getValue') > "0") {
        $('#trWorkDep').show();
    } else {
        $('#trWorkDep').hide();
    }
}

function ifShowOtherSub() {
    if ($('#txtSub').val().substring(0, 8) == "11111111") {
        $('#trOtherSubName').show();
        $('#trSubRemark').show();
    } else {
        $('#trOtherSubName').hide();
        $('#trSubRemark').hide();
    }
}



///初始化页面
function jobPageInit() {
    $('#ddlcity').combobox({
        url: '/Job/getcitylist/',
        valuefield: '县区编码',
        textfield: '县区名称',
        width: 100,
        panelheight: '220',//自动高度适合  
        editable: false,
        onhidepanel: function () {
            loadjobdata();
        }
    });
    loadjobdata();
}

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
{ field: 'ID', title: 'ID', width: 100, },
{ field: 'SubName', title: 'SubName', width: 350 },
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





