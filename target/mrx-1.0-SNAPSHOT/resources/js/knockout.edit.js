(function ($) {

    ko.EditInit = function (geturl) {
        $.get(geturl, function (data) {
            if (data != undefined) {
                var resultJS = ko.mapping.fromJSON(data);
            }
            ko.bindingEditViewModel(resultJS);
        });
        $('#formEdit').ajaxForm({
            beforeSubmit: function () {
                var bootstrapValidator = $("#formEdit").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    mif.error("部分项目没有填写规范!");
                    return false;
                }
            },
            success: function (data) {
                var result = jQuery.parseJSON(data);
                mif.result(result, function () { window.location.href = '/gssb/cl.aspx?id=' + result.OutValue; });
            }
        });

    };
    ko.bindingEditViewModel = function (data) {
        that.editModel = ko.mapping.fromJS(data.editModel);
        that.dics = ko.mapping.fromJS(data.dics);
        that.urls = data.urls;
        that.html = data.html;
        ko.applyBindings(that, document.getElementById("formEdit"));
    };

})(jQuery);

var model = {};
var botViewModel = {};
$(document).ready(function () {
    botViewModel = {
        Init: function (geturl, $ele) {
            $.get(geturl, function (data) {
                if (data != undefined) {
                    var resultJS = ko.mapping.fromJSON(data);
                    model.editModel = ko.mapping.fromJS(resultJS.editModel);
                    model.dics = ko.mapping.fromJS(resultJS.dics);
                    model.urls = resultJS.urls;
                    model.html = resultJS.html;
                    ko.applyBindings(model, $ele);
                }

            });

        },
        RefreshData: function (geturl) {
            $.get(geturl, function (data) {
                if (data != undefined) {
                    var resultJS = ko.mapping.fromJSON(data);
                    model.editModel = ko.mapping.fromJS(resultJS.editModel);
                    model.dics = ko.mapping.fromJS(resultJS.dics);
                    model.urls = resultJS.urls;
                    model.html = resultJS.html;

                }

            });
        }
    }

});