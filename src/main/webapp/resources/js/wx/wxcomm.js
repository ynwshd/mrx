
//?生成验证码? 
function generateVCode(pageContext) {
    var html = '<img id="vCodeImg" src="' + pageContext + '/vd2img.jpg" onclick="javascript:refreshVCode(\'' + pageContext + '\');" />';
    $("#vCodeSpan").html(html);
    vdImg = false;
}


//?刷新验证码
function refreshVCode(pageContext) {
    $("#vCodeImg").attr("src", pageContext + '/vd2img.jpg?' + Math.random() + '"');
}

// 判断字符串是否为空
function isEmpty(variable) {

    return (variable == null || variable == undefined || variable == '');
}

// 校验手机号
function validateCellPhoneNO(variable) {
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (isEmpty(variable))
        return false;
    return reg.test(variable);

}

// 校验身份证号????
function validateSocialNO(variable) {
    var patrn = /^\s*\d{15}\s*$/;
    var patrn1 = /^\s*\d{16}[\dxX]{2}\s*$/;
    if (!patrn.exec(variable) && !patrn1.exec(variable)) {
        return false;
    }
    return true;
}

// 微信风格的提示框
function WxAlert(alertContent) {
    var $dialog = $('#dialog2');
    $('#alertContent').html(alertContent);
    $dialog.show();
    $dialog.find('.weui_btn_dialog').one('click', function () {
        $dialog.hide();
    });
}

// 比较两个字符串是否相等
function equalsIgnoreCase(str1, str2) {
    if (str1.toUpperCase() == str2.toUpperCase()) {
        return true;
    }
    return false;
}

// 弹出加载图标
function loading() {
    var $loadingToast = $('#loadingToast');
    if ($loadingToast.css('display') != 'none') {
        return;
    }

    $loadingToast.show();
    setTimeout(function () {
        //functionName();

        $loadingToast.hide();
    }, 2000);
}
