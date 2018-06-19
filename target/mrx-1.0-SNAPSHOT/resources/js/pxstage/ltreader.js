
var dev1;
var dev2;
var video1;
var video2;

var PicPath;

function plugin() {
    return document.getElementById('view1');
}

function addEvent(obj, name, func) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + name, func);
    } else {
        obj.addEventListener(name, func, false);
    }
}

function AutoReadIdCard(okfun, $btnId) {
    var openedText="已开启刷卡注册"
    if ($btnId && $btnId.text() == openedText) {
        StopReadIdCard($btnId);
        return;
    }
    //我的理解将这个事件添加到plugin()对象里
    addEvent(plugin(), 'IdCard', function (ret) {
        if (1 == ret) {
            var str = "";
            for (var i = 0; i < 16; i++) {
                str += plugin().Global_GetIdCardData(i + 1);
                str += ",";
            }
            if (typeof (okfun) != 'undefined' && okfun != null) {
                okfun(str);
            } else {
                mif.success("读取到的信息:" + str);
            }
        }
    });

    plugin().Global_DeinitDevs();
    plugin().Global_DeinitIdCard();
    //初始化设备
    var devInit = plugin().Global_InitDevs();

    //初始化二代证，（必须在所有二代证函数前调用）
    var idcarddev = plugin().Global_InitIdCard();
    if (idcarddev == 1) {
        mif.success("身份证阅读器初始化成功，可以刷身份证");
        if ($btnId) {
            $btnId.text(openedText);
            $btnId.attr("class", " btn btn-sm btn-success glyphicon glyphicon-credit-card");

        }
    } else {
        mif.showErrorMessageBox("身份证阅读器初始化失败，请确保硬件设备电源和连接正确。");
    }
    //识别二代证 （异步，返回不代表识别成功，需要在二代证初始化后调用）
    plugin().Global_DiscernIdCard();
}

function StopReadIdCard($btnId) {
    plugin().Global_DeinitIdCard();
    plugin().Global_DeinitDevs();
    mif.success("不再自动检测身份证");
    if ($btnId) {
        $btnId.text("未开启刷卡注册");
        $btnId.attr("class", " btn btn-sm btn-default glyphicon glyphicon-pause");
    }
}
function EnableDate(obj) {
    if (obj.checked) {
        var offsetx = 1000;
        var offsety = 60;

        var font;
        font = plugin().Global_CreateTypeface(50, 50, 0, 0, 2, 0, 0, 0, "宋体");

        if (video1) {
            var width = plugin().Video_GetWidth(video1);
            var heigth = plugin().Video_GetHeight(video1);

            plugin().Video_EnableDate(video1, font, width - offsetx, heigth - offsety, 0xffffff, 0);
        }
        if (video2) {
            var width = plugin().Video_GetWidth(video2);
            var heigth = plugin().Video_GetHeight(video2);

            plugin().Video_EnableDate(video2, font, width - offsetx, heigth - offsety, 0xffffff, 0);
        }
        plugin().Font_Release(font);
    }
    else {
        if (video1) {
            plugin().Video_DisableDate(video1);
        }
        if (video2) {
            plugin().Video_DisableDate(video2);
        }
    }
}
function UnReadIdCard() {
    if (video1) {
        view1().View_SetText("", 0);
        plugin().myvideo_Release(video1);
        video1 = null;
    }
    if (dev1) {
        plugin().Device_Release(dev1);
        dev1 = null;
    }
    if (dev2) {
        plugin().Device_Release(dev2);
        dev2 = null;
    }
    plugin().Global_DeinitDevs();
}