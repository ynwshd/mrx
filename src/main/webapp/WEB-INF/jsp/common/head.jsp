<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    pageContext.setAttribute("basePath", basePath);
%>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link href="<%=basePath%>resources/assets/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="<%=basePath%>resources/assets/css/ui.jqgrid.css" rel="stylesheet" type="text/css"/>

<link href="<%=basePath%>resources/assets/css/ace.min.css" rel="stylesheet" type="text/css"/>
<link href="<%=basePath%>resources/assets/css/ace-skins.min.css" rel="stylesheet" type="text/css"/>
<link href="<%=basePath%>resources/assets/css/ace-rtl.min.css" rel="stylesheet" type="text/css"/>
<link href="<%=basePath%>resources/css/main.css" rel="stylesheet" type="text/css"/>
<link href="<%=basePath%>resources/css/css.css" rel="stylesheet" type="text/css"/>
<%--<%@include file="tag.jsp" %>--%>
<script >
    var basePath='<%=basePath%>';
    console.log("this is basepath:"+basePath);
</script>
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
	<script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->

<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src="<%=basePath%>resources/assets/js/ace.min.js" type="text/javascript"></script>

<script src="<%=basePath%>resources/assets/js/jqGrid/jquery.jqGrid.min.js" type="text/javascript"></script>
<script src="<%=basePath%>resources/assets/js/jqGrid/grid.locale-cn.js" type="text/javascript"></script>
<script src="<%=basePath%>resources/js/hd.jqgird.js" type="text/javascript"></script>

<script src="<%=basePath%>resources/js/artDialog/toastr.min.js" type="text/javascript"></script>
<script src="<%=basePath%>resources/js/hd.mif.js" type="text/javascript"></script>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="<%=basePath%>">
                <img alt="Brand" src="<%=basePath%>resources/images/logo.png">
            </a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li><a href="<%=basePath%>admin/">Admin</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">Separated link</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">One more separated link</a></li>
                    </ul>
                </li>
            </ul>
            <form class="navbar-form navbar-left">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Search">
                </div>
                <button type="submit" class="btn btn-default">Submit</button>
            </form>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#">Link</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">Separated link</a></li>
                    </ul>
                </li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
                