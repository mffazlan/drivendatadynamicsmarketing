var currentTop = 0;
var scrollTop = 0;

$(function () {
    if (!isPageLoginOrRegister()) {
        handleScroll(1);
    }
    else {
        handleScroll();
    }
});

function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

function isPageLoginOrRegister() {
    return (window.location.pathname === '/login' || window.location.pathname === '/register')
}

function handleScroll(withMenuSticky) {
    if (withMenuSticky === undefined) {
        withMenuSticky = false;
    }
    window.onscroll = function () {
        scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;
        toTopToggle();
        if (withMenuSticky) {
            menuSticky();
        }
    };
}


function toggleMobileMenu() {
    var menuBlock = $('.nav-wrap');
    if (menuBlock.hasClass('active')) {
        menuBlock.removeClass('active');
        //$('.sub-menu').removeClass('opened');
    } else {
        menuBlock.addClass('active');
        $(document).on('scroll',function () {
            menuBlock.removeClass('active');
            $(document).off('scroll');
        });
    }
    return false;
}
function toggleMobileSubmenu(link){
    var menuBlock = link.closest('li:not(.sub-header)').find('.sub-menu');
    if (menuBlock.hasClass('opened')) {
        menuBlock.removeClass('opened');
        //$('.mobile-menu-btn').removeClass('hide');
    } else {
        menuBlock.addClass('opened');
        //$('.mobile-menu-btn').addClass('hide');
    }
}
function toggleLoginForm(btn){
    var winWidth = document.documentElement.clientWidth;
    if(winWidth>=1200){
        if(!$(btn).hasClass('active')){
            $(btn).addClass('active');

            $(document).on('mouseup',function (e) {
                if ($(btn).has(e.target).length === 0){
                    $(document).off('mouseup');
                    $(btn).removeClass('active');
                }
            });
            $(document).on('scroll',function () {
                $(btn).removeClass('active');
                $(document).off('scroll');
            });
        }
    }
    else{
        $('.login-form').remodal().open();
    }
}

function closeMobileMenu() {
    $('header').removeClass('mobile-view');
}
function goToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    return false;
}
function toTopToggle() {

    if (currentTop > scrollTop) {
        showToTop();
        if (scrollTop === 0) {
            hideToTop()
        }
    }
    else {
        hideToTop();
    }
    currentTop = scrollTop;
}

function showToTop() {
    document.getElementById('to-top').style.opacity = '1';
    document.getElementById('to-top').style.right = '20px';
    document.getElementById('to-top').style.display = 'flex';
}

function hideToTop() {
    document.getElementById('to-top').style.opacity = '0';
    document.getElementById('to-top').style.right = '9999px';
}

function menuSticky() {
    var stickyHeaderHeight = 65;
    var menuWrap = $('#menu-wrap');
    var menu = $('#top-menu');
    menuWrap.stop();
    if (scrollTop > 0) {
        $('body').css({'padding-top': stickyHeaderHeight});
        menu.addClass('sticky');
    }
    else {
        $('body').css({'padding-top': 0});
        menu.removeClass('sticky');
    }
    return false;
}

function initCookieAccept(){
    var ca = getCookie('cookie-accept');
    var caBlock = $('#cookie-accept');
    if (ca !== 'close') {
        caBlock.removeClass('closed');
    }
}
function closeCookieAccept(){
    $('#cookie-accept').animate({right: '-500px' },350,function(){
        $(this).addClass('closed');
        setCookie('cookie-accept','close',1080000);
        return false;
    });
}

function setCookie(cname, cvalue, exmin) {
    var d = new Date();
    d.setTime(d.getTime() + (exmin * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


var interval;
var lastZipValue;
var zipRequest;
var init = false;
function initType(accType) {
    var companyForm = '.companyForm';
    if (accType == 2) {
        $(companyForm).slideDown();
        $(companyForm).find('input,select').prop('disabled', false);
    } else {
        $(companyForm).slideUp();
        $(companyForm).find('input,select').prop('disabled', true);
    }
}

function checkType() {
    initType($('select[name=type]').val());
    $('select[name=type]').change(function () {
        initType($(this).val());
    });
    $('select[name="type"]').select2({
        minimumResultsForSearch: Infinity
    });
}

function getPrefix() {
    var code = $('select[name=country]').val(),
        prefix = $('#phonePrefix');

    prefix.find('img').attr('src', '/d/flags/' + code.toLowerCase() + '.png');
    prefix.find('span').text(prefixes[code]);
}

// function checkZIP(input) {
//     var val = $(input).val();
//     var url = $(input).data('url');
//     var zipCheck = $('.zip-check');
//
//     if (val == lastZipValue) {
//         if (interval) {
//             clearTimeout(interval);
//         }
//         return false;
//     }
//
//     lastZipValue = val;
//
//     if (val.length < 2) {
//         if (interval) {
//             clearTimeout(interval);
//         }
//         zipCheck.text('invalid zip').show();
//         return false;
//     }
//
//     if (interval) {
//         clearTimeout(interval);
//     }
//
//     if (zipRequest) {
//         zipRequest.abort('');
//     }
//
//     zipRequest = $.ajax({
//         method: 'POST',
//         url: url,
//         headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
//         data: {
//             zip: val,
//             country: $('select[name="country"]').val()
//         },
//         beforeSend: function () {
//             zipCheck.text('checking...');
//         },
//         success: function (response) {
//             if (!response || response.length == 0) {
//                 zipCheck.text('invalid zip');
//             } else {
//                 if (!response.city && !response.state) {
//                     zipCheck.text('Correct. Specify State and City.');
//                 } else {
//                     zipCheck.text(((response.city) ? response.city + ', ' : '') + response.state + ', ' + response.zip);
//                 }
//
//                 if (response.state) {
//                     $('input[name=state]').val(response.state);
//                 }
//
//                 if (response.city) {
//                     $('input[name=city]').val(response.city);
//                 }
//             }
//         },
//         error: function () {
//             zipCheck.text('invalid zip');
//         }
//     });
// }

// function scaleCaptcha(){
//     var reCaptchaWidth = 302;
//     var containerWidth = $('.captcha').width();
//     if(reCaptchaWidth > containerWidth) {
//         var reCaptchaScale = containerWidth / reCaptchaWidth;
//         $('.g-recaptcha').css({
//             'transform':'scale('+reCaptchaScale+')',
//             'transform-origin':'left top'
//         });
//     }
// }

//$(function () {
// $('select[name=country]').change(function () {
//     lastZipValue = null;
//     $('input[name=zip]').keyup();
//     getPrefix();
// });
// $('select[name="country"]').select2({
//     dropdownCssClass: "country"
// });
//
// $('select[name="industry"]').select2({
//     dropdownCssClass: "industry",
//     placeholder: 'Select industry'
// });
// $('input[name=zip]').keyup(function () {
//     checkZIP(this);
// });
//
// $('input[name=zip]').change(function () {
//     checkZIP(this);
// });
// getPrefix();
//});

function loadInPopup(popupId, obj, hideLoading) {
    var url = $(obj).data('url');
    return loadInPopupUrl(popupId, url, hideLoading)
}

function loadInPopupUrl(popupId, url, hideLoading) {
    var html;
        $.ajax({
            url: url,
            method: 'GET',
            beforeSend: function () {
                if (!hideLoading) {
                    $(popupId).html('Loading...');
                }
            },
            success: function (data) {
                if (data && data.status && data.status == 'Ok') {
                    html = data.body;
                } else if (data && data.status && data.status == 'Error') {
                    html = '<p class="text-red"><i class="fa fa-frown-o fa-3x pull-left"></i>Error loading:<br>' + data.error_message + '</p>';
                } else {
                    html = '<p class="text-red"><i class="fa fa-frown-o fa-3x pull-left"></i>Error loading:<br>Bad response</p>';
                }
            },
            complete: function () {

            },
            error: function (error) {
                var message = 'Error: (' + error.status + ') ' + error.statusText;

                if (error.responseJSON && error.responseJSON.error_message) {
                    message = error.responseJSON.error_message;
                }
                html = '<div class="alert alert-danger no-margin">' + message + '</div>';
            }
        }).then(function(){
            $(popupId).html(html);
            checkType();
            $('select[name="country"]').select2();

            var trialEmail;

            $('[name="email-for-trial"]').each(function(id,elem){
                if(elem.value !== ''){
                    trialEmail = elem.value;
                }
            })
            $('[name="email"]').val(trialEmail);
        });

    return false;
}


function loadRegForm(popupId, obj, hideLoading){
    loadInPopup(popupId, obj, hideLoading);
    $(popupId).remodal().open();
}

function sendEventByFrom(from) {
    if (typeof from != 'undefined') {
        if (from === 'sign_up') {
            dataLayer.push({'event': 'sign_up', 'method': 'email'});
        }
        if (from === 'login') {
            dataLayer.push({'event': 'login', 'method': 'email'});
        }
    }
}

function sendFormCommon(form, isSendEvent, from) {
    //var submitValue = $(form).find('[type=submit]').html();
    let data = $(form).serializeArray();
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('after_login')) {
        data.push({name: "after_login", value: urlParams.get('after_login')});
    }

    if( typeof isSendEvent == 'undefined'){
        isSendEvent=false;
    }

    $.ajax({
        method: 'POST',
        url: $(form).attr('action'),
        data: data,
        dataType:'json',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        beforeSend: function() {

            $('.input-group').removeClass('has-error');
            $('.errors-wrap').remove();
            $('.common-msg--errors').remove();
            $('.common-msg--info').remove();

            $(form).find('[type=submit]').prop('disabled',true);
        },
        success: function(response) {
            if (response.hasOwnProperty('status')) {
                if (response.status === 'Ok') {
                    if (response.hasOwnProperty('url')) {
                        location = response.url;
                        if(isSendEvent){
                            sendEventByFrom(from);
                        }
                    }
                    else if(response.hasOwnProperty('contact_us_msg')){
                        $(form).find('input[type="text"]').val('');
                        $(form).find('input[type="email"]').val('');
                        $(form).find('textarea').val('');
                        $('.topic-select').val(null).trigger('change');
                        $(form).parents('div:first').append('<div class="common-msg common-msg--info"><p class="m-b-0">Your message has been sent</p></div>');
                    }
                    else if(response.hasOwnProperty('common_msg')){
                        $(form).parents('div:first').append('<div class="common-msg common-msg--info"><p class="m-b-0">'+response.common_msg+'</p></div>');
                    }
                }
                else if (response.status === 'error') {
                    showErrors(response,form);
                }
                else {
                    console.log(response);
                }
            }
            else {
                console.log(response);
            }
            resetReCaptcha();
        },
        error: function(err) {
            console.log('error exception');
            console.log(err);
            showErrors(err,form);
            resetReCaptcha();
        },
        complete: function() {
            $(form).find('[type=submit]').prop('disabled',false);
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

function showErrors(err, form) {
    var errorMsg;
    if (err.hasOwnProperty('errors')) {
        renderFormError(err.errors, form)
    }
    else {
        if (err.responseJSON) {
            if (err.responseJSON.error_message) {
                errorMsg = '[' + err.status + '] ' + err.responseJSON.error_message;
            }
            if (err.responseJSON.email) {
                errorMsg = '[' + err.status + '] ' + err.responseJSON.email;
            }
        } else {
            errorMsg = 'Undefined error. Please try again later or contact support@leadenforce.com';
        }
        $(form).parents('div:first')
            .append('<div class="common-msg common-msg--errors"><p class="m-b-0">' + errorMsg + '</p></div>');
    }
}

function renderFormError(errors, form) {
    var block,
        parent,
        errorBlock,
        error;
    for (var field in errors) {
        if (field !== 'all') {
            block = $(form).find('[name="' + field + '"]');
            if (block.length >= 1) {
                parent = block[0].closest('.input-group');
                parent.classList.add("has-error");
                errorBlock = '<div class="errors-wrap">' +
                    '<div class="errors-body ">' + errors[field][0] + '</div>' +
                    '</div>';

                if (block.attr('type') === 'checkbox'){
                    // потому что checkbox стилизуется с помощью label, и если ставить после чекбокса то не там выводится
                    $(errorBlock).insertAfter(block.closest('.check'))
                }
                else if(field == 'phone_number'){
                    // потому что это поле состоит из двух частей, и нужно выводить после родительского, иначе ломается верстка
                    $(errorBlock).insertAfter(block.closest('.with-phone'))
                }
                else if(field == 'industry'){
                    //потому что это селект, и он стилизуется с помощью дивов, которые сами появляются ниже селекта
                    $(errorBlock).insertAfter(block.siblings('.select2'))
                }
                else {
                    $(errorBlock).insertAfter(block[0]);
                }
            }
        }
        else {
            $(form).parents('div:first').append('<div class="common-msg common-msg--errors"><p class="m-b-0">' + errors['all'][0] + '</p></div>');
        }
    }
}

$(function () {
    renderCarousel();

    $(".for-hover").mouseover(function () {
        audienceHover($(this));
    });
});

function audienceHover(obj) {
    $(".for-hover").removeClass('active');
    $(".audience__bottom").removeClass('active');
    obj.addClass('active');
    $('.' + obj.data('audience-info')).addClass('active');
}

function renderCarousel() {
    var owl = $('.plans-items');
    owl.on('initialize.owl.carousel', function () {
        $(this).removeClass('hide');
    });
    owl.owlCarousel({
        loop: false,
        margin: 35,
        nav: true,
        dots: false,
        stagePadding: 10,
        navText : ['<i class="icon-left-arrow"></i>','<i class="icon-right-arrow"></i>'],
        responsive: {
            0: {
                items: 1,
                center: true
            },
            576: {
                items: 2
            },
            1000: {
                items: 3
            },
            1300: {
                items: 4
            }
        }
    })
}

/**
 * перемещение к вкладке в разделе Features
 * @param link
 */
function moveToFeature(link) {
    var top = $('#'+link.data('target')).offset().top-200;
    $('body,html').animate({scrollTop: top}, 600);
}

$('.open-trial-form').on('click', function (event) {
    event.preventDefault();

    $('[name="email"]').val($('[name="email-for-trial"]').val());
    $('.sign-up-for-trial').remodal().open();
});

$('.open-video').on('click', function (event) {
    event.preventDefault();
    $('.modal-video').remodal().open();
});

function openModalVideo(iframe){
    if(iframe !== null){
        var container = $('#wrap-for-video');
        container.find('.video').append(iframe);
        container.show();
        closeModalVideo();
    }
}

function closeModalVideo(){
    var container = $("#wrap-for-video");
    $(document).on('mouseup',function (e) {
        if (container.has(e.target).length === 0){
            container.hide();
            $(document).off('mouseup');
            container.find('p').remove();
            container.find('iframe').remove();
        }
    });
    $('#wrap-for-video .close').on('click',function(){
        container.hide();
        $(this).off('click');
        container.find('p').remove();
        container.find('iframe').remove();
    });
}

function changePlanPrice(tab) {
    $('.plan-periods__tab').removeClass('active');
    tab.addClass('active');

    showPrice(tab.data('period'));
}

function showPrice(name){
    $('.price__periodic').removeAttr('style');
    var curPrice = $('.' + name);
    curPrice.css({display:'inline'});
    curPrice.animate({opacity:1},200);
}

$(function () {
    var periods = $('.plan-periods-select select').select2({
        minimumResultsForSearch: Infinity,
        templateResult: formatRow,
    });
    periods.on('select2:select', function (e) {
        var data = e.params.data;
        showPrice(data.id);
    });
    $('.plans-list__item').hover(function(){
        $('.plans-list__item').removeClass('plans-list__item--active');
        $(this).addClass('plans-list__item--active');
    })
});

function formatRow(row) {
    if (!row.id) {
        return row.text;
    }
    if (row.hasOwnProperty('element')) {
        if (row.element.dataset.hasOwnProperty('discount') && row.element.dataset.hasOwnProperty('span')) {
            var $row =  $('<span class="span-discount-wrap">'+row.text + ' <span class="span-discount bg-'+
                row.element.dataset.span+'">save ' +
                row.element.dataset.discount + '%</span></span>')
        }
        else {
            return row.text
        }
    }
    return $row
}


