var Image_Funcs = (function() {
        var image_light_box = {
                init: function() {
                    // ACTIVITY INDICATOR			
                    var activityIndicatorOn = function() {
                            $('<div id="imagelightbox-loading"><div></div></div>').appendTo('body');
                        },
                        activityIndicatorOff = function() {
                            $('#imagelightbox-loading').remove();
                        }, // CLOSE BUTTON			
                        closeButtonOn = function(instance) {
                            $('<button type="button" id="imagelightbox-close" title="Close"></button>').appendTo('body').on('click touchend', function() {
                                $(this).remove();
                                instance.quitImageLightbox();
                                return false;
                            });
                        },
                        closeButtonOff = function() {
                            $('#imagelightbox-close').remove();
                        }, // OVERLAY			
                        overlayOn = function() {
                            $('<div id="imagelightbox-overlay"></div>').appendTo('body');
                        },
                        overlayOff = function() {
                            $('#imagelightbox-overlay').remove();
                        }, // CAPTION			
                        captionOn = function() {
                            var description = $('a[href="' + $('#imagelightbox').attr('src') + '"] img').attr('alt');
                            if (description.length > 0) $('<div id="imagelightbox-caption">' + description + '</div>').appendTo('body');
                        },
                        captionOff = function() {
                            $('#imagelightbox-caption').remove();
                        }, // ARROWS			
                        arrowsOn = function(instance, selector) {
                            var $arrows = $('<button type="button" class="imagelightbox-arrow imagelightbox-arrow-left"></button><button type="button" class="imagelightbox-arrow imagelightbox-arrow-right"></button>');
                            $arrows.appendTo('body');
                            $arrows.on('click touchend', function(e) {
                                e.preventDefault();
                                var $this = $(this),
                                    $target = $(selector + '[href="' + $('#imagelightbox').attr('src') + '"]'),
                                    index = $target.index(selector);
                                if ($this.hasClass('imagelightbox-arrow-left')) {
                                    index = index - 1;
                                    if (!$(selector).eq(index).length) index = $(selector).length;
                                } else {
                                    index = index + 1;
                                    if (!$(selector).eq(index).length) index = 0;
                                }
                                instance.switchImageLightbox(index);
                                return false;
                            });
                        },
                        arrowsOff = function() {
                            $('.imagelightbox-arrow').remove();
                        }; //Imágenes del catálogo de alpargatas			
                    var selectorF = 'a[data-imagelightbox="f"]';
                    var instanceF = $(selectorF).imageLightbox({
                        onStart: function() {
                            overlayOn();
                            closeButtonOn(instanceF);
                            arrowsOn(instanceF, selectorF);
                        },
                        onEnd: function() {
                            overlayOff();
                            captionOff();
                            closeButtonOff();
                            arrowsOff();
                            activityIndicatorOff();
                        },
                        onLoadStart: function() {
                            captionOff();
                            activityIndicatorOn();
                        },
                        onLoadEnd: function() {
                            captionOn();
                            activityIndicatorOff();
                            $('.imagelightbox-arrow').css('display', 'block');
                        }
                    });
                }
            }
            /* Public Methods */
        return {
            start: function() {
                image_light_box.init();
            }
        }
    }
    ());