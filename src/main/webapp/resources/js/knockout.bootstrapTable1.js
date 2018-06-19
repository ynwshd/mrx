var bttb1 = {};
$(document).ready(function () {
    bttb1 = {
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
                queryParams: bttb1.queryParams
            };
            if (tablepara) {
                var tableParams = $.extend(this.defaultQueryParams, tablepara);
                this.mybttb1ViewModel = new ko.bootstrapTableViewModel(tableParams);
            } else {
                this.mybttb1ViewModel = new ko.bootstrapTableViewModel(this.defaultQueryParams);

            }

            ko.applyBindings(this.mybttb1ViewModel, $ele);
        },

        Refresh: function () {
            this.mybttb1ViewModel.refresh();
        },
        GetRowById: function (id) {
            if (!id) {
                mif.showWarningMessageBox("表格主键不能为空");
                return false;
            }
            var rowData = this.mybttb1ViewModel.getRowById(id);
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
            arr = this.mybttb1ViewModel.getSelections();
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
            arr = this.mybttb1ViewModel.getSelections();
            if (arr.length <= 0) {
                mif.showWarningMessageBox("请选择要操作的行");
                return false;
            }
            return arr;
        },
        //数据校验
        RowCheck: function (arr) {
            arr = this.mybttb1ViewModel.getSelections();
            if (arr.length <= 0) {
                mif.warning('请选择要操作的行');
                return false;
            }
            return true;
        },
        //数据校验
        RowIfOneRow: function (arr) {
            arr = this.mybttb1ViewModel.getSelections();
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


var btac1 = new bootstrapaction1();
function bootstrapaction1() {

}
bootstrapaction1.prototype.editRow = function (_editUrl) {
    if (!bttb1.RowCheck()) {
        return;
    }
    var row = bttb1.GetRowData();
    window.location.href = _editUrl + row.Id;
}
bootstrapaction1.prototype.delRow = function (delUrl, postName, uId, notAsk, okFun, errFun) {
    var row = bttb1.GetRowData(uId);
    if (row) {
        if (notAsk == true) {
            mif.ajax(delUrl, { id: row.Id }, okFun, errFun);
        } else {
            mif.showQueryMessageBox('你确定要删除[' + row.Name + ']吗?', function () {
                mif.ajax(delUrl, { id: row.Id }, okFun, errFun);
                bttb1.Refresh();
            }
            );
        }
    }
    else {
        mif.warning("请选择要操作的行");
    }
}
bootstrapaction1.prototype.postRow = function (postUrl, postName, okFun, errFun) {
    if (!bttb1.RowCheck()) {
        return;
    }
    var row = bttb1.GetRowData();
    if (row) {
        mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
            mif.ajax(postUrl, row, okFun, errFun);
            bttb1.Refresh();
        }
        );
    }
    else {
        mif.warning("请选择要" + postName + "的行");
    }
}
bootstrapaction1.prototype.saveForm = function (formid, postUrl, okFun, errFun) {
    var myForm = $(formid);
    var btnText = "提交";
    var btnObj = $('#btnSave');
    if (!myForm) {
        mif.error('找不到表单');
        return;
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
        }
        ,
        success: function (result) {
            if (parent.mif) {
                parent.mif.result(result, okFun);
            } else {
                mif.result(result, okFun);
            }
        }
    });
    //  myForm.submit();
}
bootstrapaction1.prototype.setYYYYMMDD = function (objid) {
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
}
bootstrapaction1.prototype.postInRow = function (postUrl, postName, uId, notAsk, okFun, errFun) {
    var row = bttb1.GetRowData(uId);
    if (row) {
        ///不提示，默认
        if (notAsk == true) {
            mif.ajax(postUrl, row, okFun, errFun);
        } else {
            mif.showQueryMessageBox('你确定要' + postName + '[' + row.Name + ']吗?', function () {
                mif.ajax(postUrl, row, okFun, errFun);
            }
            );
        }
        bttb1.Refresh();
    }

}

