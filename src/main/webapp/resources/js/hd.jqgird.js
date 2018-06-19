///依赖:1.jqgrid表格组件 2.HD包装过的提示框组件(hd.mif.js)
///作用:试着将jqgrid包装成自己想要的方式
///主要功能有,提供url和colmodel就能加载表格
///实现刷新\选中行能批量执行(传入执行的方法)\获取行数据\插入新行(有些固定列如上级id可通过参数传值)\
///HD@2018.02-24


function HdJqGrid($gridDomId, $pagerDomId, $url, $editUrl, $delUrl) {
    var self = this;
    this.caption = "";
    this.clickedit = false;
    this.gridelem = $gridDomId;
    this.pagerelem = $pagerDomId;
    this.toolbarelem = "#toolbar";
    this.colmodel = [];
    this.loadurl = $url;
    this.editurl = $editUrl;
    this.delurl = $delUrl;
    this.lastsel;//最后选择(或编辑)的行索引
    this.jsonReader = {
        root: "rows", page: "page", total: "pagetotal", records: "total"
    };
    this.refreshBtn = "#btnRefresh";
    this.editPara = {
        keys: true,
        successfunc: function (p1) {
            self.lastsel = -1;
            var result = p1.responseJSON;
            if (result.IsSuccess) {

                self.Refresh();
            }
            mif.result(result);
            return;
        },
        errorfunc: function (p1, p2) {
            if (p2.status !== 200) {
                //var s = mif.tostring(p2)
                //console.log(s);
                mif.alert("保存时发生错误<br/>代码:" + p2.status + "<br/>说明：" + p2.statusText);
            }
        }
    }
    this.postData = {};
    ///!!!这个方法需要在html页面重写方法,写入postData,才能将html控件值传进来,应该有更好的办法 ?    
    this.SetPara = function () { };

    ///初始化表格,并加载数据
    this.Init = function (extendOption, $gridDomId, $pagerDomId, url) {
        if ($gridDomId) { this.gridelem = $gridDomId; }
        if ($pagerDomId) { this.pagerelem = $pagerDomId; }
        if (url) { this.loadurl = url; }
        this.SetPara();
        this.defaultOption = {
            subGrid: false,
            mtype: "post",
            url: self.loadurl,
            datatype: "json",
            postData: self.postData,
            viewrecords: true,
            sortable: false,
            rowNum: 10,
            height: 400,
            rowList: [10, 15, 20, 50, 100, 200],
            pager: self.pagerelem,
            altRows: true,
            multiselect: true,
            multiboxonly: false,
            jsonReader: self.jsonReader,
            loadComplete: function () {
                var table = this;
                setTimeout(function () {
                    self.SetAceStyle(table);
                    self.enableTooltips(table);
                }, 0);

            },

            gridComplete: function () {
                if (self.editurl) {
                    var ids = $(self.gridelem).jqGrid('getDataIDs');
                    for (var i = 0; i < ids.length; i++) {
                        var cl = ids[i];
                        be = " <div class='btn-group btn-group-xs' role='group'><button class='btn-xs  text text-primary glyphicon glyphicon-pencil' onclick=\"$('" + self.gridelem + "').editRow('" + cl + "');\"></button >";
                        se = "<button class='btn-xs text text-success glyphicon glyphicon-ok' onclick=\"$('" + self.gridelem + "').saveRow('" + cl + "');\" ></button>";
                        ce = "<button class='btn-xs text text-defaulr glyphicon glyphicon-share-alt' onclick=\"$('" + self.gridelem + "').restoreRow('" + cl + "');\" ></button>";
                        $(self.gridelem).jqGrid('setRowData', ids[i], { act: be + se + ce + "</div>" });
                    }
                }
            },
            ondblClickRow: function (id) {
                if (self.editurl && id && id !== self.lastsel) {
                    $(self.gridelem).jqGrid('saveRow', self.lastsel, self.editPara);//保存上一行
                    $(self.gridelem).jqGrid('editRow', id, self.editPara);
                    self.lastsel = id;
                }
            },
            colModel: self.colmodel,
            editurl: self.editurl,
            caption: this.caption,
            autowidth: true

        };
        if (extendOption) {
            var defaultOption = $.extend(this.defaultOption, extendOption);
        }
        self.SetPara();
        $(self.gridelem).jqGrid(this.defaultOption);

        ///给查询条绑定事件
        var selectArray = $(this.toolbarelem).find('select');
        selectArray.each(function (i, item) {
            if ($(item).hasClass('refresh')) {
                $(item).on('change', function () { self.Refresh(); })
            }
        });
        var inputArray = $(this.toolbarelem).find(':text');
        inputArray.each(function (i, item) {
            if ($(item).hasClass('refresh')) {
                mif.regEnter($(item), function () { self.Refresh(); });
            }
        });
        var btnArray = $(this.toolbarelem).find('button');
        btnArray.each(function (i, item) {
            if ($(item).hasClass('refresh')) {
                $(item).click(function () { self.Refresh(); });
            }
        });
    };
    this.enableTooltips = function (table) {
        $('.navtable .ui-pg-button').tooltip({ container: 'body' });
        $(table).find('.ui-pg-div').tooltip({ container: 'body' });
    }
    this.SetAceStyle = function (table) {
        $(table).find('input:checkbox').addClass('ace')
            .wrap('<label />')
            .after('<span class="lbl align-top" />')
        $('.ui-myjqgrid-labels th[id*="_cb"]:first-child')
            .find('input.cbox[type=checkbox]').addClass('ace')
            .wrap('<label />').after('<span class="lbl align-top" />');
        var replacement =
            {
                'ui-icon-seek-first': 'glyphicon glyphicon-step-backward ',
                'ui-icon-seek-prev': 'glyphicon glyphicon-chevron-left',
                'ui-icon-seek-next': 'glyphicon glyphicon-chevron-right',
                'ui-icon-seek-end': 'glyphicon glyphicon-step-forward'
            };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
            if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
        })
    };
    ///刷新表格,带一些查询参数
    this.Refresh = function () {
        self.SetPara();
        $(self.gridelem).jqGrid('setGridParam', {
            postData: this.postData
        }).trigger("reloadGrid");
        self.lastsel = -1;
        // console.log("refresh lastsel:" + self.lastsel);

    };
    ///刷新表格,带一些查询参数
    this.DelInRow = function (url, id, confrimMsg, successFun, silence) {
        if (successFun == null || typeof (successFun) == 'undefined') {
            successFun = function () { self.Refresh(); }
        }

        if (confrimMsg && confrimMsg.length > 0) {
            mif.showQueryMessageBox(confrimMsg, function () {
                mif.ajax(url, { id: id }, successFun, silence);
            });
        } else {
            mif.ajax(url, { Id: id }, successFun, silence);
        };
    };
    this.PostInRow = function (url, id, confrimMsg, successFun, silence) {
        if (successFun == null || typeof (successFun) == 'undefined') {
            successFun = function () { self.Refresh(); }
        }

        if (confrimMsg && confrimMsg.length > 0) {
            mif.showQueryMessageBox(confrimMsg, function () {

                var row = self.GetRowData(id)
                mif.ajax(url, row, successFun, silence);
            });
        } else {
            mif.ajax(url, row, successFun, silence);
        };
    };
    this.GetSelectRows = function () {
        var idArr = $(self.gridelem).jqGrid("getGridParam", "selarrrow");
        var arrList = new Array();
        if (idArr.length) {
            for (var i = 0; i < idArr.length; i++) {
                // suppose the name in colModel is NIF
                var myrow = $(self.gridelem).jqGrid('getRowData', idArr[i]);
                arrList[i] = myrow;
            }
        }
        return arrList;
    }
    ///选回选中行的数据
    this.GetRowData = function (rowIndex) {
        //如果有行的索引返回指定的行，否则判断是否有选中的行
        if (rowIndex) {
            var row = $(self.gridelem).getRowData(rowIndex);
            return row;
        }
        var idArr = $(self.gridelem).jqGrid("getGridParam", "selarrrow");
        if (idArr.length <= 0) {
            mif.warning('请选择要操作的行');
            return false;
        }
        if (idArr.length > 1) {
            mif.warning('不能选择多行');
            return false;
        }
        ///返回第一行
        if (idArr[0]) {
            return $(self.gridelem).getRowData(arr[0]);
        }
    };
    //校验有没有选中的行
    this.SelectCheck = function () {
        var arr = $(self.gridelem).jqGrid("getGridParam", "selarrrow");
        if (!arr || arr.length <= 0) {
            mif.showWarningMessageBox("请选择要操作的行");
            return false;
        }
        return true;
    }
    this.SelectCheckSign = function () {
        var arr = $(self.gridelem).jqGrid("getGridParam", "selarrrow");
        if (!arr || arr.length <= 0) {
            mif.showWarningMessageBox("请选择要操作的行");
            return false;
        }
        if (arr && arr.length > 1) {
            mif.showWarningMessageBox("不能选择多行");
            return false;
        }
        return true;
    }
    ///添加一个行,行内编辑
    this.AddRow = function (rowData) {
        var newrowid = 1;
        var ids = $(self.gridelem).jqGrid('getDataIDs');
        if (ids.length > 0) {
            //获得当前最大行号（数据行号）
            newrowid = Math.max.apply(Math, ids) + 1;
        }
        //将新添加的行插入到第一列
        $(self.gridelem).jqGrid("addRowData", newrowid, rowData, "first");
        if (newrowid && newrowid !== self.lastsel) {
            $(self.gridelem).jqGrid('restoreRow', self.lastsel);
            $(self.gridelem).jqGrid('editRow', newrowid, self.editPara);
            self.lastsel = newrowid;
        }

    }
    this.UnSelect = function (rowData) {
        $(self.gridelem).jqGrid('restoreRow', self.lastsel);
    }
    //对选中行进行批量操作,如删除/锁定等
    //确认内容可选,有内容就会弹出确认窗
    //执行名称可选,默认为'执行'
    this.BachExecute = function (actionFun, confrimMsg, actionName, silence, notRefresh) {
        var doName = '执行';
        if (actionName) { doName = actionName };
        var indexArr = $(self.gridelem).jqGrid("getGridParam", "selarrrow");
        if (indexArr.length <= 0) {
            mif.showWarningMessageBox("请选择要操作的行!");
            return false;
        }
        var doAction = function (actionFun) {
            var selectedRowIds = $(self.gridelem).jqGrid("getGridParam", "selarrrow");
            var len = selectedRowIds.length;
            var actionCount = 0;
            for (var i = 0; i < len; i++) {
                var rowId = selectedRowIds[i];
                var row = self.GetRowData(rowId);
                actionFun(row);
                actionCount++;
            }
            if (!notRefresh) {
                self.Refresh();
            }
            if (!silence) {
                mif.alert("成功" + doName + "了" + actionCount + "行!");
            }
        };

        if (confrimMsg && confrimMsg.length > 0) {
            mif.showQueryMessageBox(confrimMsg + "(共" + indexArr.length + "行)", function () {
                doAction(actionFun);
            });

        } else {
            doAction(actionFun);
        };

    };
}

