


           $(document).ready(function () {
               

               $("#divMain").show();
               $('#btnPostReg').click(function () {
                   if ($('#formReg').form('validate')) {
                       var msg = '<br/>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:' + $('#username').val()
                       msg += '<br/>身份证号:' + $('#idcard').val();
                       msg += '<br/>电子邮箱:' + $('#email').val();
                       msg += '<br/>手机号码:' + $('#mobile').val();
                       $.messager.confirm('确认', "以下是您提交的注册信息,<br/>注册后这些信息将不能更改!<br/>&nbsp;" + msg + "<br/><br/>请确认所有信息都填写正确了吗?<br/>", function (r) {
                           if (r) {

                               $('#formReg').submit();
                           }
                       });
                   }

               });
               $('#formReg').form({
                   url: "/AjaxUser/UserRegWithWjh.do",
                   onSubmit: function () {
                       $('#btnPostReg').css('display', 'none');
                       $('#posting').css('display', '');
                       posting
                   },

                   success: function (data) {
                       result = jQuery.parseJSON(data);
                       $('#btnPostReg').css('display', '');
                       $('#posting').css('display', 'none');
                       if (result.Code == 1) {
                           $.messager.alert('提示', result.Msg + ",3秒后跳转登录", "info");
                           var returnUrl = $.getUrlParam('ReturnUrl');
                           if (returnUrl) {
                               waitGo(returnUrl, 3000);
                           } else {
                               waitGo("/Account/Login/", 3000);
                           }

                       } else {
                           $.messager.alert('提示', result.Msg, "info");
                       }
                   }
               });
           });
           
                   
           
          

