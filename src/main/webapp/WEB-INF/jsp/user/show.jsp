<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <%@ include file="common/head.jsp" %>

        <title>wing-Admin detail${admin.name}</title>
    </head>
    <body>
        <h2>${admin.name}</h2>
        <hr/>
        <div class="pannel">
            <p class="text-success">
                编号: ${admin.id}

            </p>
            <p class="text-success">
                登录名: ${admin.loginname}
            </p>
        </div>
    </body>
</html>
