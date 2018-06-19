function warningStyle(row, index) {
    return {
        classes: 'alert alert-warning'
    };
}
function dangerStyle(row, index) {
    return {
        classes: 'alert alert-danger'
    };
}
function successStyle(row, index) {
    return {
        classes: 'alert alert-success'
    };
}
(function ($) {
    //向ko里面新增一个bootstrapTableViewModel方法
    ko.bootstrapTableViewModel = function (tablePara) {
        var that = this;
        var defaultTablePara = {
            // toolbar: '#toolbar',                //工具按钮用哪个容器
            queryParams: function (param) {
                return {
                    limit: param.limit, offset: param.offset
                };
            },//传递参数（*）
            pagination: true,                   //是否显示分页（*）
            sidePagination: "server",           //分页方式：client客户端分lo页，server服务端分页（*）
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10],        //可供选择的每页的行数（*）
            method: 'get',
            uniqueId: 'Id',
            //   search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            //   showColumns: true,                  //是否显示所有的列
            cache: false,
            // showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            // showToggle: true,

            onLoadError: function (status) {
                mif.error('数据加载错误，错误代码：' + status);
            },
            onLoadSuccess: function (data) {
                if (data.IsSuccess == false)
                    mif.error('数据加载错误，错误提示：' + data.AppMsg);
            },
        };
        this.params = $.extend({}, defaultTablePara, tablePara || {});
        //得到选中的记录
        this.getSelections = function () {
            return that.bootstrapTable("getSelections")
        };

        //得到选中的记录
        this.getRowById = function (id) {
            return that.bootstrapTable("getRowByUniqueId", id)
        };
        //数据校验
        this.operateCheck = function () {
            var arrRes = that.bootstrapTable("getSelections")
            if (arrRes.length <= 0) {
                (data.error);
                toastr.error("请至少选择一行数据");
                return false;
            }
            if (arrRes.length > 1) {
                toastr.error("只能编辑一行数据");
                return false;
            }
            return true;
        }
        //刷新
        this.refresh = function () {
            that.bootstrapTable("refresh");
        };


    };

    //添加ko自定义绑定
    ko.bindingHandlers.bootstrapTableHandler = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            //这里的oParam就是绑定的viewmodel
            var oViewModel = valueAccessor();
            var $ele = $(element).bootstrapTable(oViewModel.params);
            //给viewmodel添加bootstrapTable方法
            oViewModel.bootstrapTable = function () {
                return $ele.bootstrapTable.apply($ele, arguments);
            }
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        }
    };
})(jQuery);
var bttb = {};
$(document).ready(function () {
    bttb = {
        //data可以是一个地址，也可以是一个js对象，里面有urls
        Init: function (data, $ele, tablepara) {
            var geturl = "";
            if (data && data.urls && data.urls.table) {
                geturl = data.urls.table
            } else {
                geturl = data;
            }
            this.defaultQueryParams = {
                url: geturl,
                method: 'post',
                sidePagination: "server",
                queryParams: bttb.queryParams
            };
            if (tablepara) {
                var tableParams = $.extend(this.defaultQueryParams, tablepara);
                this.mybttbViewModel = new ko.bootstrapTableViewModel(tableParams);
            } else {
                this.mybttbViewModel = new ko.bootstrapTableViewModel(this.defaultQueryParams);

            }
            ko.applyBindings(this.mybttbViewModel, $ele);

            ///页面应该给一个toolmodel
            if ($("#toolbar") != null) {
                //先给控件加事件
                var selectArray = $("#toolbar").find('select');
                selectArray.each(function (i, item) {
                    $(item).on('change', function () { bttb.Refresh(); })

                });
                var inputArray = $("#toolbar").find(':text');
                inputArray.each(function (i, item) {
                    mif.regEnter($(item), function () { bttb.Refresh(); });
                });
                //如果有ko对象,就帮绑定
                if (typeof (toolmodel) != 'undefined' && toolmodel != null) {
                    bttb.queryParams = function (param) {
                        var params = ko.mapping.oJS(toolmodel)
                        try { params.removeAttr("__ko_mapping__"); } catch (ex) { }
                        params.limit = param.limit;
                        params.offset = param.offset;
                        return params;
                    };
                    ko.applyBindings(toolmodel, document.getElementById("toolbar"));
                }


            }
            ///给查询条绑定事件
            var selectArray = $('body').find('select');
            selectArray.each(function (i, item) {
                if ($(item).hasClass('refresh')) {
                    $(item).on('change', function () { bttb.Refresh(); })
                }
            });
            var inputArray = $('body').find(':text');
            inputArray.each(function (i, item) {
                if ($(item).hasClass('refresh')) {
                    mif.regEnter($(item), function () { bttb.Refresh(); });
                }
            });
            var btnArray = $('body').find('button');
            btnArray.each(function (i, item) {
                if ($(item).hasClass('refresh')) {
                    $(item).click(function () { bttb.Refresh(); });
                }
            });

            if ($("#btnRefresh") != null) {
                $("#btnRefresh").on('click', function () { bttb.Refresh(); });
            }
        },
        Refresh: function () {
            this.mybttbViewModel.refresh();
        },
        GetRowById: function (id) {
            if (!id) {
                mif.showWarningMessageBox("表格主键不能为空");
                return false;
            }
            var rowData = this.mybttbViewModel.getRowById(id);
            if (!rowData) {
                mif.warning('找不到操作的行');
                return false;
            }
            return rowData;
        },
        ///如果有ID就选回指定ID的行，否则判断是否有选中的行
        GetRowData: function (id) {
            if (id) {
                return this.GetRowById(id);
            }
            arr = this.mybttbViewModel.getSelections();
            if (arr.length <= 0) {
                mif.warning('请选择要操作的行');
                return false;
            }
            if (arr.length > 1) {
                mif.warning('不能选择多行');
                return false;
            }
            if (arr[0]) {
                return arr[0];
            }
        },
        GetSelectRows: function () {
            arr = this.mybttbViewModel.getSelections();
            if (arr.length <= 0) {
                mif.showWarningMessageBox("请选择要操作的行");
                return false;
            }
            return arr;
        },
        //数据校验
        RowCheck: function (arr) {
            arr = this.mybttbViewModel.getSelections();
            if (arr.length <= 0) {
                mif.warning('请选择要操作的行');
                return false;
            }
            return true;
        },
        //数据校验，是否只选了一行
        RowIfOneRow: function (arr) {
            arr = this.mybttbViewModel.getSelections();
            if (arr.length <= 0) {
                mif.showWarningMessageBox("请选择要操作的行");
                return false;
            }
            if (arr.length > 1) {
                mif.showWarningMessageBox("不能选择多行");
                return false;
            }
            return true;
        }

    };

});


var btac = new bootstrapaction();
function bootstrapaction() {

};
bootstrapaction.prototype.refresh = function (_editUrl) {
    bttb.GetRowData();
};
bootstrapaction.prototype.editRow = function (_editUrl) {
    if (!bttb.RowCheck()) {
        return;
    }
    var row = bttb.GetRowData();
    window.location.href = _editUrl + row.Id;
};
bootstrapaction.prototype.delRow = function (delUrl, postName, uId, notAsk, okFun, errFun) {
    var row = bttb.GetRowData(uId);
    if (!postName) {
        postName = "删除";
    }
    if (row) {
        if (notAsk == true) {
            mif.ajax(delUrl, { id: row.Id }, okFun, errFun);
        } else {

            mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
                if (okFun) {
                    mif.ajax(delUrl, { id: row.Id }, okFun, errFun);
                } else {
                    mif.ajax(delUrl, { id: row.Id }, function () {

                        bttb.Refresh();
                    }, errFun);
                }
            }
            );
        }
    }
    else {
        mif.warning("请选择要操作的行");
    }
};
bootstrapaction.prototype.postRow = function (postUrl, postName, okFun, errFun) {
    if (!bttb.RowCheck()) {
        return;
    }
    var row = bttb.GetRowData();
    if (row) {
        mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
            if (okFun) {
                mif.ajax(postUrl, row, okFun, errFun);
            } else {
                mif.ajax(postUrl, row, function () {
                    bttb.Refresh();
                }, errFun);
            }
        }
        );
    }
    else {
        mif.warning("请选择要" + postName + "的行");
    }
};
bootstrapaction.prototype.postInRow = function (postUrl, postName, uId, notAsk, okFun, errFun) {

    var row = bttb.GetRowData(uId);
    if (row) {
        ///不提示，默认
        if (notAsk == true) {
            mif.ajax(postUrl, row, okFun, errFun);
            bttb.Refresh();

        } else {
            mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
                mif.ajax(postUrl, row, okFun, errFun);
                bttb.Refresh();
            }
            );
        }
    }

};

bootstrapaction.prototype.saveForm = function (formid, postUrl, okFun, errFun, btnObjId, silence, completeFun) {

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
            if (typeof (okFun) != 'undefined' && okFun != null) {
                okFun(result);
            }
            mif.result(result, null, silence);

        }
    });
};
bootstrapaction.prototype.setYYYYMMDD = function (objid) {
    var obj = $('#' + objid);
    if (!obj || obj == undefined) {
        return;
    }
    obj.bind("change", function () {
        var outdate = obj.val();
        if (!isdate(outdate)) {
            mif.showWarningMessageBox("日期格式错误，应为年月月日日，例如：20160102");
            return false;
        }
        if (isyyyymmdd(outdate)) {
            outdate = outdate.replace("-", "")
            var dataFormat = outdate.substr(0, 4) + "-" + outdate.substr(4, 2) + "-" + outdate.substr(6, 2);
            obj.val(dataFormat);
        }
    });
    var objdate = obj.val();
    objdate = objdate.replace("T00:00:00", "")
    obj.val(objdate)
    if (objdate < "1990-01-01") {
        var outdate = new Date(obj.val());
        var mindate = new Date('2000-01-01');
        if (!isdate(outdate) || outdate < mindate) {
            obj.val("");
        }
    }
};
bootstrapaction.prototype.setSubAction = function (parentUiName, funame) {
    var selectArray = $("#" + parentUiName).find('select');
    selectArray.each(function (i, item) {
        $(item).on('change', function () { funame(); })
    });
    var inputArray = $("#" + parentUiName).find(':text');
    inputArray.each(function (i, item) {
        mif.regEnter($(item), function () { funame(); });
    });
};
