$(document).ready(function () {
    $('#btnPostReg').click(function () {
        if ($('#formReg').form('validate')) {
            $('#formReg').submit();
        }
    });

    $('#formReg').form({
        onSubmit: function () {
            $('#btnPostReg').css('display', 'none');
            $('#posting').css('display', '');
            posting
        },
        success: function (data) {
            result = jQuery.parseJSON(data);
            $('#btnPostReg').css('display', '');
            $('#posting').css('display', 'none');
            if (result.IsSuccess) {
                $.messager.alert('提示', result.AppMsg + ",3秒后跳转登录", "info");
                var returnUrl = $.getUrlParam('ReturnUrl');
                if (returnUrl) {
                    waitGo(returnUrl, 3000);
                } else {
                    waitGo("/Exam/", 3000);
                }

            } else {
                $.messager.alert('提示', result.AppMsg, "info");
            }
        }
    });

});







