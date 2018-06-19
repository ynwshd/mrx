
$(function () {

    $('#treeSata').tree({
        onClick: function (node) {
            $('#txtItemID').val(node.id);
            $('#divTitle').text(node.text + "报考情况");
            LoadSataData();
        }
    });

    $('#btnFindSata').linkbutton({ iconCls: "icon-search" }).unbind().click(function () {

        LoadSataData();
    });
    ///注册回车查询事件
    $('#txtFindSata').textbox('textbox').keydown(function (e) {
        if (e.keyCode == 13) {
            LoadSataData();
        }
    });
    
});



function LoadSataData() {
    
    var citycode = $("#txtFindSata").val();
    var nodeid = $('#txtItemID').val();
   
    if (citycode && citycode.length != 8) {
        $('#txtMsg').text('出错:岗位代码应为8位数字,不输入岗位代码将显示所有');
        return;
    } else {
        $('#txtMsg').text('');
    }

    $('#SataTable').datagrid({
        title: '',
        iconCls: 'icon-save',
        pageSize:20,
        nowrap: true,
        autoRowHeight: false,
        striped: true,
        collapsible: false,
        url: '/Sata/GetPage/?itemid=' + nodeid + '&jobcode=' + citycode,
        sortName: '岗位代码',
        sortOrder: 'asc',
        remoteSort: false,
        singleSelect: true,
        pagination: true,//分页控件  
        idField: '岗位代码',
        columns: [[

{ field: '岗位代码', title: '岗位代码', width: 100, },
{ field: '岗位名称', title: '岗位名称', width: 400 },
{ field: '招聘人数', title: '招聘人数', width: 80, align: 'center' },
        { field: '通过并锁定人数', title: '通过并锁定人数', width: 100, align: 'center' },
{ field: '交费人数', title: '交费人数', width: 80, align: 'center' }
        ]],

        rownumbers: false
    });

    //设置分页控件  
    var p = $('#SataTable').datagrid('getPager');
    $(p).pagination({
        pageSize: 20,//每页显示的记录条数，默认为10  
        pageList: [20,30,50],//可以设置每页记录条数的列表  
        beforePageText: '第',//页数文本框前显示的汉字  
        afterPageText: '页 共 {pages} 页',
        displayMsg: '当前显示 {from} - {to}    共 {total} 个岗位',
        onBeforeRefresh: function () {
            //    alert('before refresh');
        }
    });
    setHeight();
}

///初始化页面
function SataPageInit() {
    $('#ddlCity').combobox({
        url: '/Job/GetJobList/',
        valueField: '县区编码',
        textField: '县区名称',
        width: 100,
        panelHeight: '220',//自动高度适合  
        editable: false,
        onHidePanel: function () {
            LoadSataData();
        }
    });
    LoadSataData();
}





