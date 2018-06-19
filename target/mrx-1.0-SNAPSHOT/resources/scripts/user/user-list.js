var myjqgrid = new HdJqGrid("#gridExam", "#pagerExam", basePath+"user/getpage/1", basePath+"user/getpage/", basePath+"user/getpage/");
$(function () {
    myjqgrid.SetPara = function () {
        myjqgrid.postData = {
            examid: $('#examid').val(),
            photostatu: $('#phototostatu').val(),
            examcardstatu: $('#examcardstatu').val(),
            findkey: $('#findkey').val()
        };
    };
    myjqgrid.colmodel = [
        { label: '编号', name: 'id', index: 'id', width: 80,  fixed: true,editable: true },
        { label: '姓名', name: 'name', index: 'name', width: 150, fixed: true, align: 'center', editable: true },   
        { label: '年龄', name: 'age', index: 'age', width: 150, fixed: true, align: 'center', editable: true },
        {
            label: '操作', width: 50, editable: false,  sortable: false,
            formatter: function (cellvalue, options, rowObject) {
                var temp = "<a  class='btn btn-xs btn-danger glyphicon glyphicon-trash' onclick=\"myjqgrid.DelInRow('/exam/delUser/','" + rowObject.Id + "','你确定要删除名称为【" + rowObject.Name + "】的考生吗？') \"  ></a>";
                return temp;
            }
        }
    ];
    myjqgrid.Init({ rowNum: 10, height: '95%' });
});
