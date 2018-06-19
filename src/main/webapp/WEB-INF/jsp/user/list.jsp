<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <%@ include file="common/head.jsp" %>
        <title>用户管理</title>
    </head>
    <div id="toolbar" class="form-inline panel">
        <div class="form-group">
            <input type="text" id="findkey" class="form-control refresh input-sm" placeholder=" 输入名称查询">
        </div>
        <div class="btn-group">
            <button id="btnRefreshTask" class="btn btn-sm  btn-default glyphicon glyphicon-refresh refresh">刷新</button>
            <button id="btnAddTask" class="btn btn-sm btn-success glyphicon glyphicon-plus ">添加考生</button>
        </div>
    </div>
    <table id="gridExam"></table>
    <div id="pagerExam"></div>
    <script src="<%=basePath%>resources/scripts/user/user-list.js"></script>
</html>
