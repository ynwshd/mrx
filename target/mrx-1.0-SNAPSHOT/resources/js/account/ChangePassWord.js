(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);
$(document).ready(function () {

    document.onkeydown = function (e) {
        if (!e) e = window.event; //火狐中是 window.event
        if ((e.keyCode || e.which) == 13) {
            $('#formLogin').submit();
        }
    };
    SetCheckCodeDivDisplay();

    $('#btnLogin').click(function () {
        $('#formLogin').submit();
    });


    $('#formLogin').ajaxForm({
        url: "/account/CheckLogin/",
        type: "Post",
        beforeSubmit: function () {
            if ($('#UserName').val() == null || $('#UserName').val().length == 0) {
                mif.error("用户名不能为空", '错误提示');
                return false;
            }
            if ($('#PassWord').val() == null || $('#PassWord').val().length == 0) {
                mif.error("密码不能为空", '错误提示');
                return false;
            }
            //return $('#formLogin').form('validate');
        },
        success: function (result) {
            if (result && result.IsSuccess == true) {
                var returnUrl = $.getUrlParam('ReturnUrl');
                mif.success("登录成功，正在转到用户中心", '成功提示')
                if (returnUrl) {
                    window.location.href = returnUrl;
                } else {
                    window.location.href = "/me/";
                }
            } else {
                mif.error(result.AppMsg);
            }
        }

    });
    $("#UserName").focus().select();
    $('#UserName').val();

});

function SetCheckCodeDivDisplay() {
    $.ajax(
    {
        url: "/account/IfTryOut",
        type: "get",
        success: function (result) {
            //  $("#CheckCode").attr('src', '/login/chkcode.aspx?Action=adminLogin&amp;n=' + Math.random());
            if (result.IsSuccess == true) {
                $("#divCheckCode").css("display", "");
            } else {
                $("#divCheckCode").css("display", "none");
            }
        }
    });


    $('#info').html("<img id='chcekImg' style='CURSOR: pointer;' onclick='showImg();' alt='点击刷新验证码' src='/account/showchkcode/?n=" + Math.random() + "' />");
}
function showImg() {
    $("#chcekImg").attr('src', '/account/showchkcode/?n=' + Math.random());
}