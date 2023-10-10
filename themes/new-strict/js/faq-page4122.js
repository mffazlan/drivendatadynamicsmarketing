function spoilerAction() {
    var spoiler = ".spoiler";
    // Content shown
    $(spoiler).on("jq-spoiler-visible", function () {
        var block = $('.answer_open[data-spoiler-link="' + $(this).data('spoiler-link') + '"]');
        if (!block.hasClass('active')) {
            block.addClass('active');
        }
    });
    // Content hidden
    $(spoiler).on("jq-spoiler-hidden", function () {
        var block = $('.answer_open[data-spoiler-link="' + $(this).data('spoiler-link') + '"]');
        if (block.hasClass('active')) {
            block.removeClass('active');
        }
    });
}

$(function () {
    $(".spoiler").spoiler({
        triggerEvents: true
    });
    spoilerAction();
});
