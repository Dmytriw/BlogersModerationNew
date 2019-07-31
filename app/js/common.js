$(function () {
    var
        w = $(window).width();

    $('.popup__container').on('scroll touchmove mousewheel', function(e){
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    $('.copy__nick').click(function (e) {
        e.preventDefault();
    });

    $('.moderation__nav__tabs a').click(function (e) {
        e.preventDefault();

        var
            $this = $(this),
            thisHref = $this.attr('href'),
            thisTab = $(''+thisHref+'');

        if(thisHref === '#tab1') {
            $('.input__search').attr('placeholder', 'Поиск по нику');
        } else {
            $('.input__search').attr('placeholder', 'Поиск (дата или ник)');
        }

        $('.bigTab').hide();
        thisTab.show();
        $this.addClass('active');
        $this.closest('li').siblings().find('a').removeClass('active');
    });
    $('.move__information__text a').click(function (e) {
        e.preventDefault();
        var
            $this = $(this),
            thisHref = $this.attr('href'),
            thisTab = $('.moderation__nav__tabs a[href*="'+thisHref+'"]');

        thisTab.click();
    });


    $('.search__form').submit(function (e) {
        e.preventDefault();
        $('.bigTab').hide();
        $('.search__requests__tab').show();
        $('.moderation__nav__tabs .active').addClass('goBack');
        $('.moderation__nav__tabs a').removeClass('active');
        $('.input__search').attr('placeholder', 'Поиск (дата или ник)');
    });
    $('.search__back').click(function (e) {
        e.preventDefault();

        $('.goBack').click();
        $('.goBack').removeClass('goBack');
    });


    navigation();
    requestLoad();
    hiddenElements()
    scrollCheck();
    scrolling();
    inputsFunctions();
    infographics();
    discardRequest();
    closingPopups();
    countFotmat()
});



//Меню в хедері
function navigation() {
    $('.hamburger__button').click(function (e) {
        e.preventDefault();

        var windowTop = $(window).scrollTop();

        setTimeout(function () {
            $('body').attr('data-top', windowTop);
            $('.header__nav__container').addClass('openedNav');
            $('html, body').css({'overflow' : 'hidden', 'position' : 'fixed'});

            var windowTopData = $('body').attr('data-top');

            $('body').scrollTop(windowTopData);
        }, 50);
    });

    $('.vav__close, .nav__overlay').click(function (e) {
        e.preventDefault();

        var windowTop = $('body').attr('data-top');

        $('.header__nav__container').removeClass('openedNav');
        $('html, body').css({'overflow' : 'visible', 'position' : 'relative'});

        $(window).scrollTop(windowTop);

    });
}


//Підгрузка заявок
function requestLoad() {
    $.each($(".request__container"), function(){
        var
            thisRequest = $(this),
            thisEtap = thisRequest.find('.etapIdInput').val(),
            thisEtapSteps = thisRequest.find('.'+thisEtap+'_steps'),
            thisStep = thisEtapSteps.find('.step').eq(0),
            thisStepIndex = thisStep.index(),
            thisName = thisStep.find('.step__name').text(),
            completionOptions = thisStep.find('.completion__step').html(),
            refuseOptions = thisStep.find('.refuse__step').html(),
            requestName = thisRequest.find('.request__step'),
            completionRequest = thisRequest.find('.completion__select .input__options'),
            refuseRequest = thisRequest.find('.refuse__select .input__options');


        thisEtapSteps.addClass('showSteps');
        thisEtapSteps.siblings().removeClass('showSteps');
        thisStep.addClass('activeStep');
        requestName.text(thisName);
        completionRequest.html(completionOptions);
        refuseRequest.html(refuseOptions);

        if(thisStepIndex < 1) {
            thisRequest.find('.prev__button').hide();
        } else {
            thisRequest.find('.prev__button').css({'display' : 'flex'});
        }

        scrollCheck();
        discardRequest();
        scrinshotCheck()
    });
}
function scrinshotCheck() {
    $('.scrinshots__container').each(function () {
        var 
            $this = $(this),
            thisImg = $this.find('img').length;
        
        if(thisImg < 1) {
            $this.html('<div class="emptyImg flex"><div class="textEmpty">Нет скриншотов</div><a href="#" class="buttonEmpty">Попросить прислать скриншоты</a></div>')
        }
    })
}


//Перевірка скролу
function scrollCheck() {
    $('.step').each(function () {
        var
            $this = $(this),
            thisHeight = $this.find('.step__inner').height(),
            thisContainerHeight = $this.height(),
            thisScroll = $this.find('.step__scroll');

        if(thisHeight >= thisContainerHeight) {
            thisScroll.show();
        } else {
            thisScroll.hide();
        }
    });
}


//Скролінг
function scrolling() {
    $('.step__content').scroll(function () {
        var
            $this = $(this),
            thisHeight = $this.find('.step__inner').height(),
            thisContainerHeight = $this.height(),
            thisScroll = $this.closest('.step').find('.step__scroll'),
            thisScrollThumb = thisScroll.find('.step__scroll__thumb'),
            scrollTop = $this.scrollTop(),
            scrollPos = 100 * scrollTop / (thisHeight - thisContainerHeight);

        thisScrollThumb.css({'top' : scrollPos+'%'});
    });
}


//Кнопка "Далі"
function buttonNext($this) {
    event.preventDefault();

    var
        thisRequest = $this.closest('.request__container'),
        activeStep = thisRequest.find('.activeStep'),
        nextStep = activeStep.next(),
        nextStepIndex = nextStep.index(),
        nextName = nextStep.find('.step__name').text(),
        completionOptions = nextStep.find('.completion__step').html(),
        refuseOptions = nextStep.find('.refuse__step').html(),
        requestName = thisRequest.find('.request__step'),
        completionRequest = thisRequest.find('.completion__select .input__options'),
        refuseRequest = thisRequest.find('.refuse__select .input__options');


    activeStep.removeClass('activeStep');
    activeStep.hide();
    nextStep.show();
    nextStep.addClass('activeStep');
    requestName.text(nextName);
    completionRequest.html(completionOptions);
    refuseRequest.html(refuseOptions);

    if(nextStepIndex < 1) {
        thisRequest.find('.prev__button').hide();
    } else {
        thisRequest.find('.prev__button').css({'display' : 'flex'});
    }

    if(nextStep.hasClass('lastStep')) {
        $this.hide();
        $this.next().show();
    }

    scrollCheck();
    discardRequest();
    $('.move__information').hide();
    $('.requestInNext').removeClass('requestInNext');
    $('.requestInInfo').removeClass('requestInInfo');
}


//Показ елементів
function hiddenElements() {
    $('.etaps__container').each(function () {
        var
            $this = $(this),
            itemLength = $this.find('.request__container').length,
            thisItems = $this.find('.request__container');

        if(itemLength > 2) {
            $this.addClass('showMoreBlock');
            thisItems.slice(0, 2).addClass('showedItems');
        } else {
            $this.addClass('startAll');
        }
    });
}
function showElements($this) {
    event.preventDefault();

    var
        thisBlock = $this.closest('.etaps__container'),
        thisRows = thisBlock.find('.request__container'),
        thisRowsLast = thisBlock.find('.request__container').last(),
        lastShowed = thisBlock.find('.request__container').last().index(),
        nextStep = lastShowed + 2;

    if(!thisRowsLast.hasClass('showedItems')) {
        thisRows.slice(lastShowed, nextStep).addClass('showedItems');
        $this.text('Показать ещё');
        setTimeout(function(){
            if(thisRowsLast.hasClass('showedItems')) {
                $this.text('Скрыть');
            }
        }, 50);

    } else {
        thisRows.removeClass('showedItems');
        thisRows.slice(0, 2).addClass('showedItems');
        $this.text('Показать ещё');
    }
}


//Кнопка "Назад"
function buttonPrev($this) {
    event.preventDefault();

    var
        thisRequest = $this.closest('.request__container'),
        activeStep = thisRequest.find('.activeStep'),
        prevStep = activeStep.prev(),
        prevStepIndex = prevStep.index(),
        prevName = prevStep.find('.step__name').text(),
        completionOptions = prevStep.find('.completion__step').html(),
        refuseOptions = prevStep.find('.refuse__step').html(),
        requestName = thisRequest.find('.request__step'),
        completionRequest = thisRequest.find('.completion__select .input__options'),
        refuseRequest = thisRequest.find('.refuse__select .input__options');

    activeStep.removeClass('activeStep');
    activeStep.hide();
    prevStep.show();
    prevStep.addClass('activeStep');
    requestName.text(prevName);
    completionRequest.html(completionOptions);
    refuseRequest.html(refuseOptions);
    thisRequest.find('.next__button').show();
    thisRequest.find('.agree').hide();

    if(prevStepIndex < 1) {
        thisRequest.find('.prev__button').hide();
    } else {
        thisRequest.find('.prev__button').css({'display' : 'flex'});
    }

    scrollCheck();
    discardRequest();
    $('.move__information').hide();
    $('.requestInNext').removeClass('requestInNext');
    $('.requestInInfo').removeClass('requestInInfo');
}


//Відкриття селектора
function selectorOpen($this) {
    var
        thisContainer = $this.closest('.input__select');

    if(!thisContainer.hasClass('openedSelect')){
        setTimeout(function(){
            thisContainer.addClass('openedSelect');
        }, 50);
    } else {
        thisContainer.removeClass('openedSelect');
    }

    selectorFunctions();

    $('body').click(function (evt) {
        if($('.input__select').hasClass('openedSelect')) {
            $('.input__select').removeClass('openedSelect');
        }
        if(!$(evt.target).is('.accaunt__select .input__option') && !$(evt.target).is('.accaunt__select .input__option span')) {
            $('.input__select').removeClass('openedSelect');
        } else {
            $(evt.target).closest('.accaunt__select').addClass('openedSelect');
        }
    });
}


//Додаткові функції селектора
function selectorFunctions() {
    $('.combo__select .input__option').click(function () {
        var
            $this = $(this),
            thisContainer = $this.closest('.combination__item'),
            thisSelect = $this.closest('.input__select'),
            thisText = $this.text(),
            textPaste = thisContainer.find('.input__select__text span'),
            thisMainInput = thisContainer.find('.comboInput'),
            thisParcent = thisContainer.find('.parcentInput').val(),
            inputVal = (thisText + ', ' + thisParcent + '%');

        $this.addClass('active');
        $this.siblings().removeClass('active');
        textPaste.text(thisText);
        thisSelect.addClass('selected');
        thisContainer.removeClass('openedSelect');
        thisMainInput.val(inputVal);
    });


    $('.block__select .input__option').click(function () {
        var
            $this = $(this),
            thisSelect = $this.closest('.input__select'),
            thisText = $this.text(),
            textPaste = thisSelect.find('.input__select__text span');

        textPaste.text(thisText);
        thisSelect.addClass('selected');
        thisSelect.find("input[name='reasonPopupInput']").attr('value', thisText);
    });


    $('.comercails__select .input__option').click(function () {
        var
            $this = $(this),
            thisSelect = $this.closest('.input__select'),
            thisText = $this.text(),
            textPaste = thisSelect.find('.input__select__text span');

        textPaste.text(thisText);
        thisSelect.addClass('selected');
        thisSelect.find(".commertialInput").attr('value', thisText);

        if(thisText === 'Сторис' && thisSelect.hasClass('input__select__format')) {
            $('.comercails__inputs__time').removeClass('disabled');
        } else if(thisText !== 'Сторис' && thisSelect.hasClass('input__select__format')) {
            $('.comercails__inputs__time').addClass('disabled');
        }
    });
}
function selectorAcaunt($this) {
    var
        thisContainer = $this.closest('.accaunt__body'),
        thisSelect = $this.closest('.input__select'),
        thisText = $this.text(),
        textPaste = thisContainer.find('.tags__ontainer');

    if(!$this.hasClass('active')) {
        textPaste.prepend('<div onclick="deleteTag($(this))" class="acountTag"><span>'+thisText+'</span><svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 1L6 6M6 1L1 6" stroke="#192229" stroke-linecap="round" stroke-linejoin="round"></svg></div>')
        $this.find('input').attr('checked', 'checked');
        $this.addClass('active');
    } else {
        thisContainer.find(".acountTag span:contains('"+thisText+"')").closest('.acountTag').remove();
        $this.removeClass('active');
        $this.find('input').removeAttr('checked');
    }
    thisSelect.addClass('selected');

    scrollCheck();
    scrolling();
}
function deleteTag($this){
    var
        thisText = $this.text(),
        thisContainer = $this.closest('.accaunt__body'),
        thisOption = thisContainer.find(".accaunt__select .input__option span:contains('"+thisText+"')").closest('.input__option');

    if(thisOption.hasClass('active')) {
        thisOption.click();
    }
}



//Робота полів
function inputsFunctions() {
    $('.parcentInput').on('input', function () {

        var value = $(this).val();

        if ((value !== '') && (value.indexOf('.') === -1)) {
            $(this).val(Math.max(Math.min(value, 100), 0));
        }
    });


    $('.combination__item .parcentInput').change(function () {
        var
            $this = $(this),
            thisContainer = $this.closest('.combination__item'),
            thisVal = $this.val(),
            textSelect = thisContainer.find('.input__select__text span').text(),
            thisMainInput = thisContainer.find('.comboInput'),
            inputVal = (textSelect + ', ' + thisVal + '%');

        thisMainInput.val(inputVal);
    });


    $('.minInput, .maxInput, .parcentInput, .prAccaunt, .commertialInput').change(function () {
        var
            $this = $(this),
            thisVal = $this.val();

        $this.attr('value', thisVal);
    });
    $('.acaunt_textarea').change(function () {
        var
            $this = $(this),
            thisVal = $this.val();

        $this.text(thisVal);
    });

    $('.accaunt__select input').each(function () {
        if($(this).prop('checked')) {
            $(this).closest('.input__option').click();
        }
    });
}


//Інфографіка
function infographics() {
    $('.infogpaph__one').each(function () {
        var
            $this = $(this),
            thisGraph = $this.find('.theGpaph').text(),
            thisGen = $this.find('.fromGpaph').text(),
            thisParcent = thisGraph / thisGen * 100,
            thisInd = $this.find('.infogpaph__ind');

        thisInd.css({'width' : thisParcent+'%'});
    });
}


//Копіювання посилання
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}


//Погодження заявки
function agreeRequest($this) {
    event.preventDefault();

    var
        thisRequest = $this.closest('.request__container');

    thisRequest.addClass('inAgree');
    $('.popup__fakelikeinfo').show();
}
function fakelikeinfoChecked() {
    event.preventDefault();

    $('.popup__container').hide();
    $('.popup__agree').show();
}
function agreeRequestPopup() {
    event.preventDefault();
}
function closingPopups() {
    $('.popup__close, .popups__overlay, .popup__button__no, .block__no').click(function (e) {
        e.preventDefault();

        $('.popup__container').hide();
        $('.inAgree').removeClass('inAgree');
    });
}


//
function openRequestTable($this) {
    event.preventDefault();

    var
        thisContainer = $this.closest('.table__item'),
        thisBody = thisContainer.find('.table__item__body');

    if(!$this.hasClass('openedTable')) {
        thisBody.css({'display' : 'flex'});
        thisContainer.addClass('openedBody');
        $this.addClass('openedTable');
        $this.find('.openedSpan').text('Скрыть заявку ');

    } else {
        thisBody.hide();
        thisContainer.removeClass('openedBody');
        $this.removeClass('openedTable');
        $this.find('.openedSpan').text('Открыть заявку ');
    }
}


//Відклонення заявки
//Відклонення заявки
function discardRequest() {
    $('.request__footer .input__option').click(function () {
        var
            $this = $(this),
            thisText = $this.text(),
            thisRequest = $this.closest('.request__container');

        if(!$(this).hasClass('input__option-disabled')) {
            if(thisText === 'Заблокировать') {
                thisRequest.addClass('inBlock');
                $('.popup__block').show();
            }
        }

    });
}
function blockRequest() {
    event.preventDefault();
    var
        blockRequest = $('.inBlock');
}


//Удаление рекламы
function removeFotmat($this) {
    event.preventDefault();

    var
        thisComercial = $this.closest('.comercails__item');

    thisComercial.remove();
    countFotmat();
    scrollCheck()
}
function countFotmat() {
    $('.comercails__item').each(function () {
        var
            thisIndex = $(this).index() + 1;

        $(this).find('.comertialNumInput').attr('value', 'Формат рекламы '+thisIndex);
        $(this).find('.comercails__num').text('№'+thisIndex);
    });
}