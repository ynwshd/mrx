
var ltdev1;
var ltdev2;
var myvideo;
//加载
function Load1(okfun) {
    //返初始化
    myplugin().Global_DeinitDevs();

    //返初始化读卡器
    myplugin().Global_DeinitIdCard();

    //设备接入和丢失
    //type设备类型， 1 表示视频设备， 2 表示音频设备
    //idx设备索引
    //dbt 1 表示设备到达， 2 表示设备丢失		
    addEvent(myplugin(), 'DevChange', function (type, idx, dbt) {
        mif.success('触发设备接入');
        if (1 == type) {
            if (0 == idx) {
                if (1 == dbt) {
                    ltdev1 = myplugin().Global_CreateDevice(1, 0);
                    if (ltdev1) {
                        var select = document.getElementById('mydevice');
                        var name = myplugin().Global_GetFriendlyName(1, 0);
                        select.add(new Option(name));
                        var select = document.getElementById('mydevice');
                        select.selectedIndex = 0;
                        Openmyvideo();
                    }
                }
                else if (2 == dbt) {
                    if (ltdev1) {
                        if (myplugin().Device_GetIndex(ltdev1) == idx) {
                            if (myvideo) {
                                view1().View_SetText("", 0);
                                myplugin().myvideo_Release(myvideo);
                                myvideo = null;
                            }
                            myplugin().Device_Release(ltdev1);
                            ltdev1 = null;

                            document.getElementById('mydevice').options[0] = null;
                        }
                    }
                    if (ltdev2) {
                        if (myplugin().Device_GetIndex(ltdev2) == idx) {
                            if (myvideo) {
                                view1().View_SetText("", 0);
                                myplugin().myvideo_Release(myvideo);
                                myvideo = null;
                            }
                            myplugin().Device_Release(ltdev2);
                            ltdev2 = null;

                            document.getElementById('mydevice').options[1] = null;
                        }
                    }
                }
            }
            else if (1 == idx) {
                if (1 == dbt) {
                    ltdev2 = myplugin().Global_CreateDevice(1, 1);
                    if (ltdev2) {
                        var select = document.getElementById('mydevice');
                        var name = myplugin().Global_GetFriendlyName(1, 1);
                        select.add(new Option(name));
                    }
                }
                else if (2 == dbt) {
                    if (ltdev1) {
                        if (myplugin().Device_GetIndex(ltdev1) == idx) {
                            if (myvideo1) {
                                view1().View_SetText("", 0);
                                myplugin().myvideo_Release(myvideo1);
                                myvideo1 = null;
                            }
                            myplugin().Device_Release(ltdev1);
                            ltdev1 = null;

                            document.getElementById('mydevice').options[0] = null;
                        }
                    }
                    if (ltdev2) {
                        if (myplugin().Device_GetIndex(ltdev2) == idx) {
                            if (myvideo2) {
                                view2().View_SetText("", 0);
                                myplugin().myvideo_Release(myvideo2);
                                myvideo2 = null;
                            }
                            myplugin().Device_Release(ltdev2);
                            ltdev2 = null;

                            document.getElementById('mydevice').options[1] = null;
                        }
                    }
                }
            }
        }
    });
    addEvent(myplugin(), 'IdCard', function (ret) {
        mif.success('触发读IDCARD卡');
        if (1 == ret) {
            var str = "";
            for (var i = 0; i < 16; i++) {
                str += myplugin().Global_GetIdCardData(i + 1);
                str += ",";
            }
            if (typeof (okfun) != 'undefined' && okfun != null) {
                okfun(str);
            } else {
                mif.success("读取到的信息:" + str);
            }
        }
    });


    view1().Global_SetWindowName("view");
    thumb1().Global_SetWindowName("thumb");
    //初始化设备
    var initdevsResult = myplugin().Global_InitDevs();
    if (initdevsResult != 1) { mif.error('高拍仪初始化出错'); }

    //初始化二代证，（必须在所有二代证函数前调用）
    var idcarddev = myplugin().Global_InitIdCard();
    if (idcarddev == 1) {
        //  mif.success("身份证阅读器初始化成功，可以刷卡注册");
    } else {
        mif.success("身份证阅读器初始化失败，请确保硬件设备电源和连接正确。");
    }
    //识别二代证 （异步，返回不代表识别成功，需要在二代证初始化后调用）
    myplugin().Global_DiscernIdCard();
    alert('load end');

}

//定义插件句柄
function myplugin() {
    var obj = document.getElementById('view1');
    if (!obj) {
        mif.error('插件加载错误');
        return false;
    } else {
        return obj;
    }

}
//定义视频窗
function view1() {
    var obj = document.getElementById('view1');
    if (!obj) {
        mif.error('视频句柄加载错误');
        return false;
    } else {
        return obj;
    }
}

//定义缩略图窗
function thumb1() {
    var obj = document.getElementById('thumb1');
    if (!obj) {
        mif.error('视频句柄加载错误');
        return false;
    } else {
        return obj;
    }
}

//添加事件的方法
function addEvent(obj, name, func) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + name, func);
    } else {
        obj.addEventListener(name, func, false);
    }
}
//将视频加载到窗口
function Openmyvideo() {
    Closemyvideo();
    var select = document.getElementById('mydevice');
    var devIdx = select.selectedIndex;
    if (devIdx == 0) {
        myvideo = myplugin().Device_Createmyvideo(ltdev1, 0, 0);
        if (myvideo) {
            view1().View_Selectmyvideo(myvideo);
            view1().View_SetText("打开扫描议中，请等待...", 0);
        }
    }
    else if (devIdx == 1) {
        myvideo = myplugin().Device_Createmyvideo(ltdev2, 0, 0);
        if (myvideo) {
            view1().View_Selectmyvideo(myvideo);
            view1().View_SetText("打开视频中，请等待...", 0);
        }
    }
}
//关闭视频
function Closemyvideo() {
    if (myvideo) {
        view1().View_SetText("", 0);
        myplugin().myvideo_Release(myvideo);
        myvideo = null;
    }
}

function Unload() {
    if (myvideo) {
        view1().View_SetText("", 0);
        myplugin().myvideo_Release(myvideo);
        myvideo = null;
    }
    if (ltdev1) {
        myplugin().Device_Release(ltdev1);
        ltdev1 = null;
    }
    if (ltdev2) {
        myplugin().Device_Release(ltdev2);
        ltdev2 = null;
    }
    myplugin().Global_DeinitDevs();
}

//左旋
function Left() {
    myplugin().myvideo_RotateLeft(myvideo);

}
//右旋
function Right() {
    myplugin().myvideo_RotateRight(myvideo);
}
//属性
function ShowProperty() {
    if (ltdev1) {
        myplugin().Device_ShowProperty(ltdev1, view1().View_GetObject());
    }
    if (ltdev2) {
        myplugin().Device_ShowProperty(ltdev2, view1().View_GetObject());
    }
}
//开始录像
function StartRecord() {
    if (myvideo) {
        if (!myplugin().myvideo_StartRecord(myvideo, "D:\\elaomPlugin.avi", 0)) {
            alert("录像错误！");
        }
        else {
            alert("录像开始！");
        }
    }
}
//停止录像
function StopRecord() {
    if (myvideo) {
        myplugin().myvideo_StopRecord(myvideo);
        alert("录像结束！文件保存于D:\\elaomPlugin.avi");
    }
}
//上传本地文件
function UploadToHttpServer() {
    var url = 'http://192.168.1.103:80' + sy.contextPath + '/FileSteamUpload?fileFolder=/ylcdzl/532621195703050032';
    var http = myplugin().Global_CreateHttp(url);//服务器上传地址
    //var http = myplugin().Global_CreateHttp("http://192.168.1.205:8080/FileStreamDemo/servlet/FileSteamUpload?");//java服务器demo地址
    if (http) {
        var b = myplugin().Http_UploadImageFile(http, "D:\\1.jpg", "2.jpg");
        if (b) {
            alert("上传成功");
        }
        else {
            alert("上传失败");
        }

        myplugin().Http_Release(http);
    }
    else {
        alert("url 错误");
    }
}
//扫描直接上传
function ScanToHttpServer() {
    if (myvideo) {
        var img = myplugin().myvideo_CreateImage(myvideo, 0, view1().View_GetObject());
        if (img) {
            var url = '/pxclass/FileSteamUpload?fileFolder=/ylcdzl/532621195703050032';
            var http = myplugin().Global_CreateHttp(url);//java服务器上传地址
            if (http) {
                var b = myplugin().Http_UploadImage(http, img, 2, 0, "ww.jpg");
                if (b) {
                    alert("上传成功");
                }
                else {
                    alert("上传失败");
                }

                myplugin().Http_Release(http);
            }

            myplugin().Image_Release(img);
        }
    }
}
//拍照
function Scan() {
    var date = new Date();
    var yy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    var hh = date.getHours().toString();
    var nn = date.getMinutes().toString();
    var ss = date.getSeconds().toString();
    var mi = date.getMilliseconds().toString();
    var Name = "D:\\" + yy + mm + dd + hh + nn + ss + mi + ".jpg";

    var img = myplugin().myvideo_CreateImage(myvideo, 0, view1().View_GetObject());
    var bSave = myplugin().Image_Save(img, Name, 0);
    if (bSave) {
        view1().View_PlayCaptureEffect();
        thumb1().Thumbnail_Add(Name);
    }

    myplugin().Image_Release(img);
}
//上传缩略图图片多张
function UploadThumbToServer($dialog, $grid, $index, $pjq) {
    var paths = getuploadImagepath();//上传图片路径
    var savepaths = getuploadsavepath();//保存上传成功后路径
    var delpaths = getuploaddelpath();//上传成功后删除文件路径
    alert(paths);
    alert(savepaths);
    alert(delpaths);
    //上传文件路径
    var url = 'http://http://10.183.125.14:88' + sy.contextPath + '/FileSteamUpload?fileFolder=/ylcdzl/532621195703050032';
    var http = thumb1().Thumbnail_HttpUploadCheckImage(url, 0);
    if (http) {
        //上传成功
        var htInfo = thumb1().Thumbnail_GetHttpServerInfo();
        //删除本地文件
        //for(var i=0;i<dels.length;i++){
        //	var fileName=dels[i];
        //	var a=thumb1().Thumbnail_Remove(fileName);
        //}

        //alert(htInfo);
        var url = urls.join(',');
        var editors = $grid.datagrid('getEditors', $index);
        var ed1 = editors[1];
        var ed2 = editors[2];
        ed1.target.textbox('setValue', '已上传');
        ed2.target.textbox('setValue', url);
        $dialog.dialog('destroy');
        $pjq.messager.alert('提示', '上传成功！', 'info');
    }
    else {
        alert("上传失败！");
    }
}
//获取选中图片路径
function getuploadImagepath() {
    var tcount = thumb1().Thumbnail_GetCount(); //获取图片数量
    var imagpaths = [];//选中图片路径
    for (var i = 0; i < tcount; i++) {
        var ischeck = thumb1().Thumbnail_GetCheck(i);
        if (ischeck == 1) {
            var ipath = thumb1().Thumbnail_GetFileName(i);//图片路径
            imagpaths.push(ipath);
        }
    }
    return imagpaths;
}
//获取保存图片路径
function getuploadsavepath() {
    var tcount = thumb1().Thumbnail_GetCount(); //获取图片数量
    var imagpaths = [];//选中图片路径
    for (var i = 0; i < tcount; i++) {
        var ischeck = thumb1().Thumbnail_GetCheck(i);
        if (ischeck == 1) {
            var ipath = thumb1().Thumbnail_GetFileName(i);//图片路径
            var urlname = '/ssheUploadFile/ylcdzl/532621195703050032/' + ipath.substring(3, ipath.length);
            imagpaths.push(urlname);
        }
    }
    return imagpaths;
}
//获取上传成功后删除图片路径
function getuploaddelpath() {
    var tcount = thumb1().Thumbnail_GetCount(); //获取图片数量
    var imagpaths = [];//选中图片路径
    for (var i = 0; i < tcount; i++) {
        var ischeck = thumb1().Thumbnail_GetCheck(i);
        if (ischeck == 1) {
            var ipath = thumb1().Thumbnail_GetFileName(i);//图片路径
            imagpaths.push(ipath);
        }
    }
    return imagpaths;
}
//日期
function EnableDate(obj) {
    if (obj.checked) {
        var offsetx = 1000;
        var offsety = 60;

        var font;
        font = myplugin().Global_CreateTypeface(50, 50, 0, 0, 2, 0, 0, 0, "宋体");


        var width = myplugin().myvideo_GetWidth(myvideo);
        var heigth = myplugin().myvideo_GetHeight(myvideo);

        myplugin().myvideo_EnableDate(myvideo, font, width - offsetx, heigth - offsety, 0xffffff, 0);

        myplugin().Font_Release(font);
    }
    else {
        if (myvideo) {
            myplugin().myvideo_DisableDate(myvideo);
        }

    }
}
//水印
function AddText(obj) {
    if (obj.checked) {
        var font;
        font = myplugin().Global_CreateTypeface(100, 100, 200, 0, 2, 0, 0, 0, "宋体");


        var width = myplugin().myvideo_GetWidth(myvideo);
        var heigth = myplugin().myvideo_GetHeight(myvideo);

        myplugin().myvideo_EnableAddText(myvideo, font, width / 4, heigth / 2, "养老科专用", 0x0000FF, 200);

        myplugin().Font_Release(font);
    }
    else {
        if (myvideo) {
            myplugin().myvideo_DisableAddText(myvideo);
        }
        if (myvideo2) {
            myplugin().myvideo_DisableAddText(myvideo);
        }
    }
}
//纠偏
function Deskew(obj) {
    if (obj.checked) {
        myplugin().myvideo_EnableDeskewEx(myvideo, 1);
    }
    else {
        myplugin().myvideo_DisableDeskew(myvideo);
    }
}
//框选
function SetState(obj) {

    var stat1 = view1().View_GetState();
    if (1 == stat1) {
        view1().View_SetState(2);
    }
    else if (2 == stat1) {
        view1().View_SetState(1);
    }


}