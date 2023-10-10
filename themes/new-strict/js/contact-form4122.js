function sendForm(form) {
    var submitValue = $(form).find('button[type=submit]').html();

    $.ajax({
        method: 'POST',
        url: $(form).attr('action'),
        data: $(form).serialize(),
        beforeSend: function() {
            $(form).find('button[type=submit]').html('Sending...').prop('disabled',true);
        },
        success: function(response) {
            $(form).parents('div:first').html(response);
        },
        error: function(err) {
            resetReCaptcha();
            if (err.responseJSON && err.responseJSON.error_message) {
                $(form).parents('div:first').append('<div class="common-msg common-msg--errors"><p class="m-b-0">[' + err.status + '] ' + err.responseJSON.error_message + '</p></div>');
            } else {
                $(form).parents('div:first').append('<div class="common-msg common-msg--errors"><p class="m-b-0">[' + err.status + '] ' + err.statusText + '</p></div>');
            }
        },
        complete: function() {
            $(form).find('button[type=submit]').html(submitValue).prop('disabled',false);
        }
    });

    return false;
}
function resetReCaptcha(){
    var grec = $('[name="g-recaptcha-response"]');
    if (grec.length > 0) {
        grecaptcha.reset();
    }
}