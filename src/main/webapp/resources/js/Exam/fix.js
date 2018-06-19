$(function () {
    $(document).ready(function () {
        SetAjaxForm();
        ifShowAwardMark();
        $("#ddlAward").combobox({
            onChange: function () {
                ifShowAwardMark();
            }

        });
    });
});



function ifShowAwardMark() {
    if ($('#ddlAward').combobox('getValue') > "0") {
        $('#trAwardMark').show();
    } else {
        $('#trAwardMark').hide();
    }
}