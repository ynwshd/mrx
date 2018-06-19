$(document).keypress(function (e) {
    var k = e.keyCode || e.which;
    // alert(k);
    //~号  
    if (k == 96) {
        ReadCard_onclick();
    }
    //-号
    if (k == 45) {
        ChangeStatu(0);
    }
    //+号
    if (k == 61) {
        Add();
    }
});



var dev1;
var dev2;
var video1;
var video2;

var PicPath;

function plugin() {
    return document.getElementById('view1');
}

function view1() {
    return document.getElementById('view1');
}

function view2() {
    return document.getElementById('view2');
}

function thumb1() {
    return document.getElementById('thumb1');
}

function addEvent(obj, name, func) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + name, func);
    } else {
        obj.addEventListener(name, func, false);
    }
}
function OpenVideo() {
    CloseVideo();

    var select1 = document.getElementById('selRes1');
    var nResolution1 = select1.selectedIndex;

    video1 = plugin().Device_CreateVideo(dev1, nResolution1, 0);
    if (video1) {
        if (plugin().Device_GetEloamType(dev1) == 1)//主头显示在右边，副头显示在左边
        {
            view1().View_SelectVideo(video1);
            view1().View_SetText("打开视频中，请等待...", 0);
        }
        else {
            view2().View_SelectVideo(video1);
            view2().View_SetText("打开视频中，请等待...", 0);
        }
    }

    var select2 = document.getElementById('selRes2');
    var nResolution2 = select2.selectedIndex;

    video2 = plugin().Device_CreateVideo(dev2, nResolution2, 0);
    if (video2) {
        if (plugin().Device_GetEloamType(dev2) == 1)//主头显示在右边，副头显示在左边
        {
            view1().View_SelectVideo(video2);
            view1().View_SetText("打开视频中，请等待...", 0);
        }
        else {
            view2().View_SelectVideo(video2);
            view2().View_SetText("打开视频中，请等待...", 0);
        }
    }
}

function CloseVideo() {
    if (video1) {
        plugin().Video_Release(video1);
        video1 = null;

        if (plugin().Device_GetEloamType(dev1) == 1) {
            view1().View_SetText("", 0);
        }
        else {
            view2().View_SetText("", 0);
        }
    }
    if (video2) {
        plugin().Video_Release(video2);
        video2 = null;

        if (plugin().Device_GetEloamType(dev2) == 1) {
            view1().View_SetText("", 0);
        }
        else {
            view2().View_SetText("", 0);
        }
    }
}
function Load() {
    //我的理解将这个事件添加到plugin()对象里
    addEvent(plugin(), 'IdCard', function (ret) {
        if (1 == ret) {
            var str = "";
            for (var i = 0; i < 16; i++) {
                str += plugin().Global_GetIdCardData(i + 1);
                str += ",";
            }
            mif.success(str);
        }
    });
    //初始化设备
    plugin().Global_InitDevs();
    //初始化二代证，（必须在所有二代证函数前调用）
    plugin().Global_InitIdCard();
    //识别二代证 （异步，返回不代表识别成功，需要在二代证初始化后调用）
    plugin().Global_DiscernIdCard();
}

function Unload() {
    plugin().Global_DeinitIdCard();
    plugin().Global_DeinitDevs();
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
