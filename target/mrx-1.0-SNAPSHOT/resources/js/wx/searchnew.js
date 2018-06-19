var findurl;
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);


$(document).ready(function () {

    $("#search_input").focus(function () {
        var $weuiSearchBar = $('#search_bar');
        $weuiSearchBar.addClass('weui_search_focusing');
    });

    $("#search_input").blur(function () {
        var $weuiSearchBar = $('#search_bar');
        $weuiSearchBar.removeClass('weui_search_focusing');
        if ($(this).val()) {
            $('#search_text').hide();
        } else {
            $('#search_text').show();
        }
    });

    $("#search_input").bind('input propertychange', function () {
        queryList();
    });

    $("#search_cancel").click(function () {
        $("#search_show").hide();
        $('#search_input').val('');
    });

    $("#search_clear").click(function () {
        $("#search_show").hide();
        $('#search_input').val('');
    });

});

function queryList(pageNO) {
    var $searchShow = $("#search_show");
    if (isEmpty(pageNO)) {
        pageNO = 1;
    }
    var url = findurl + "?name=" + encodeURI($("#search_input").val()) + "&pageNO=" + pageNO;
    var postData = { killCache: Math.random() };
    var result;
    $.ajax({
        url: url,
        cache: false,
        data: postData,
        success: function (backHtml) {
            if (!backHtml) {
                $searchShow.html('');
                return;
            }
            if (pageNO == 1) {
                $searchShow.html(backHtml);
                $searchShow.show();
            } else {
                if ($("#moreBtn")) { $("#moreBtn").remove(); }
                $searchShow.append(backHtml);
            }
        },
        error: function (e) {
            return false;
        }
    });

}



