(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.events = {
      "click .mobile-header-search-toggle": "toggleSearch",
      "blur .header-search-input": "toggleSearch"
    };

    HeaderView.prototype.initialize = function() {
      if (Pacific.settings["use-logo"]) {
        this.fixWonkyLogo();
        return $(window).resize((function(_this) {
          return function() {
            return _this.fixWonkyLogo();
          };
        })(this));
      }
    };

    HeaderView.prototype.fixWonkyLogo = function() {
      var actualRatio, logo, naturalRatio, newHeight;
      if ($("html").hasClass("lt-ie9")) {
        return;
      }
      logo = this.$(".logo-retina").is(":visible") ? this.$(".logo-retina") : this.$(".logo-regular");
      naturalRatio = logo[0].naturalWidth / logo[0].naturalHeight;
      actualRatio = logo[0].width / parseInt(Pacific.settings["logo-height"], 10);
      newHeight = naturalRatio.toFixed(2) !== actualRatio.toFixed(2) ? "auto" : Pacific.settings["logo-height"];
      return this.$(".logo-retina, .logo-regular").css({
        height: newHeight
      });
    };

    HeaderView.prototype.toggleSearch = function() {
      var form;
      if (!(document.documentElement.clientWidth > 1020)) {
        form = this.$(".header-search-form");
        if (form.hasClass("active")) {
          return form.removeClass("active");
        } else {
          return form.addClass("active").find("input").focus();
        }
      }
    };

    return HeaderView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.CurrencyView = (function(_super) {
    __extends(CurrencyView, _super);

    function CurrencyView() {
      return CurrencyView.__super__.constructor.apply(this, arguments);
    }

    CurrencyView.prototype.events = {
      "change [name=currencies]": "convertAll",
      "switch-currency": "switchCurrency",
      "reset-currency": "resetCurrency"
    };

    CurrencyView.prototype.initialize = function() {
      var cents, doubleMoney, money, _i, _j, _len, _len1, _ref, _ref1;
      Currency.format = Pacific.settings["currency-switcher-format"];
      Currency.money_with_currency_format[Shop.currency] = Shop.moneyFormatCurrency;
      Currency.money_format[Shop.currency] = Shop.moneyFormat;
      this.defaultCurrency = Pacific.settings["currency-switcher-default"] || Shop.currency;
      this.cookieCurrency = Currency.cookie.read();
      if (this.cookieCurrency) {
        this.$("[name=currencies]").val(this.cookieCurrency);
      }
      _ref = $("span.money span.money");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        doubleMoney = _ref[_i];
        $(doubleMoney).parents("span.money").removeClass("money");
      }
      _ref1 = $("span.money");
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        money = _ref1[_j];
        $(money).attr("data-currency-" + Shop.currency, $(money).html());
        if (Currency.format === "money_with_currency_format") {
          cents = parseInt($(money).html().replace(/[^0-9]/g, ""), 10);
          $(money).attr("data-currency-" + Shop.currency, Shopify.formatMoney(cents, Shop.moneyFormat));
          $(money).html(Shopify.formatMoney(cents, Shop.moneyFormat));
        }
      }
      this.switchCurrency();
      return this.$(".selected-currency").text(Currency.currentCurrency);
    };

    CurrencyView.prototype.resetCurrency = function() {
      return Currency.convertAll(this.defaultCurrency, this.$("[name=currencies]").val());
    };

    CurrencyView.prototype.switchCurrency = function() {
      if (this.cookieCurrency === null) {
        if (Shop.currency === !this.defaultCurrency) {
          return Currency.convertAll(Shop.currency, this.defaultCurrency);
        } else {
          return Currency.currentCurrency = this.defaultCurrency;
        }
      } else if (this.$("[name=currencies]").size() && this.$("[name=currencies] option[value='" + this.cookieCurrency + "']").size() === 0) {
        Currency.currentCurrency = Shop.currency;
        return Currency.cookie.write(Shop.currency);
      } else if (this.cookieCurrency === Shop.currency) {
        return Currency.currentCurrency = Shop.currency;
      } else {
        return Currency.convertAll(Shop.currency, this.cookieCurrency);
      }
    };

    CurrencyView.prototype.convertAll = function(e, variant, selector) {
      var newCurrency;
      newCurrency = $(e.target).val();
      Currency.convertAll(Currency.currentCurrency, newCurrency);
      this.$(".selected-currency").text(Currency.currentCurrency);
      return this.cookieCurrency = newCurrency;
    };

    return CurrencyView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.NavigationView = (function(_super) {
    __extends(NavigationView, _super);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.events = {
      "click .mobile-tier-toggle": "toggleMobileTier",
      "click .has-children > a": "changeTier",
      "click .mega-nav-breadcrumbs span": "previousTier",
      "mouseenter .mega-nav": "setMegaNav",
      "mouseout .mega-nav": "resetMegaNav"
    };

    NavigationView.prototype.initialize = function() {
      this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
      this.checkDropdownWidth();
      this.setWindowWidth();
      if (this.$("li.mega-nav").length) {
        this.prepareMegaNav();
      }
      $(window).on("resize", (function(_this) {
        return function() {
          _this.setWindowWidth();
          if (_this.$("li.mega-nav").length) {
            _this.prepareMegaNav();
          }
          if (_this.$el.hasClass("mobile-visible") && _this.windowWidth > 1020) {
            _this.$el.removeClass("mobile-visible");
            return _this.resetHeights();
          }
        };
      })(this));
      return $(".mobile-navigation-toggle").on("click", (function(_this) {
        return function() {
          return _this.toggleMobileNavigation();
        };
      })(this));
    };

    NavigationView.prototype.setWindowWidth = function() {
      return this.windowWidth = document.documentElement.clientWidth;
    };

    NavigationView.prototype.checkDropdownWidth = function() {
      var item, itemOffset, _i, _len, _ref, _results;
      _ref = this.$(".navigation-first-tier > .has-dropdown");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item = $(item);
        if (!item.hasClass("mega-nav")) {
          itemOffset = item.offset();
          if (item.find(".navigation-second-tier").length && itemOffset.left + 200 > this.windowWidth) {
            item.addClass("alternate-drop");
          }
          if (item.find(".navigation-third-tier").length && itemOffset.left + 400 > this.windowWidth) {
            item.addClass("alternate-drop");
          }
          if (item.find(".navigation-fourth-tier").length && itemOffset.left + 600 > this.windowWidth) {
            _results.push(item.addClass("alternate-drop"));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    NavigationView.prototype.toggleMobileNavigation = function() {
      var firstTier, height;
      if (!this.$el.hasClass("processed")) {
        $(window).on("resize", (function(_this) {
          return function() {
            return _.debounce(function() {
              if (_this.windowWidth > 1020) {
                return _this.resetHeights();
              }
            }, 500);
          };
        })(this));
        this.$el.addClass("processed");
      }
      firstTier = this.$(".navigation-first-tier");
      if (this.$el.hasClass("mobile-visible")) {
        this.$el.removeClass("mobile-visible");
        return this.resetHeights();
      } else {
        height = this.getHiddenHeight(firstTier);
        firstTier.addClass("open");
        return setTimeout((function(_this) {
          return function() {
            _this.$el.addClass("mobile-visible");
            $(".mobile-navigation-toggle").addClass("active");
            return firstTier.height(height);
          };
        })(this), 50);
      }
    };

    NavigationView.prototype.toggleMobileTier = function(e) {
      var height, list, parent;
      e.preventDefault();
      parent = $(e.target).closest(".has-dropdown, .mega-nav, .mega-nav-item, .has-children");
      list = parent.find("> ul");
      if (parent.hasClass("open")) {
        height = list.height();
        list.parents("ul").css("height", "-=" + height);
        list.find(".open").removeClass("open").find("> ul").height("");
        if (Modernizr.csstransitions) {
          return list.height(0).one(this.transitionend, (function(_this) {
            return function() {
              return parent.removeClass("open");
            };
          })(this));
        } else {
          return parent.removeClass("open");
        }
      } else {
        height = this.getHiddenHeight(list);
        parent.addClass("open");
        list.height(height);
        return list.parents("ul").css("height", "+=" + height);
      }
    };

    NavigationView.prototype.getHiddenHeight = function(elem) {
      var height, temp;
      temp = $(elem).clone().addClass("cloned-list").appendTo(this.$el);
      height = temp.height();
      temp.remove();
      return height;
    };

    NavigationView.prototype.resetHeights = function() {
      var list, _i, _len, _ref;
      _ref = this.$("ul");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        list = _ref[_i];
        $(list).height("").parent().removeClass("open");
      }
      return $(".mobile-navigation-toggle").removeClass("active");
    };

    NavigationView.prototype.prepareMegaNav = function() {
      var bottomPosition, navigationWidth, toggleHeight, toggleTop;
      this.megaNavDropdown = this.$(".mega-nav-dropdown");
      if (this.windowWidth > 1020) {
        navigationWidth = this.$el.width();
        toggleTop = this.$(".mega-nav").position().top;
        toggleHeight = this.$(".mega-nav").outerHeight();
        bottomPosition = toggleTop + toggleHeight - 1;
        return this.megaNavDropdown.css({
          top: bottomPosition,
          width: navigationWidth,
          marginLeft: -(navigationWidth / 2)
        });
      } else {
        return this.megaNavDropdown.css({
          top: "",
          width: "",
          marginLeft: ""
        });
      }
    };

    NavigationView.prototype.setMegaNav = function(e) {
      var firstTierHeight;
      if (this.windowWidth < 1021) {
        return;
      }
      firstTierHeight = this.megaNavDropdown.height();
      return this.megaNavDropdown.data("first-tier-height", firstTierHeight).height(firstTierHeight);
    };

    NavigationView.prototype.resetMegaNav = function(e) {
      if (this.windowWidth < 1021) {
        return;
      }
      if (e && $(e.relatedTarget).closest(".mega-nav").length) {
        return;
      }
      this.megaNavDropdown.height(this.megaNavDropdown.data("first-tier-height"));
      return this.$(".active").removeClass("active");
    };

    NavigationView.prototype.changeTier = function(e) {
      var currentHeight, nextTier, nextTierHeight;
      if (this.windowWidth < 1021) {
        return;
      }
      e.preventDefault();
      $(e.currentTarget).addClass("working");
      nextTier = $(e.currentTarget).next("ul");
      nextTierHeight = nextTier.outerHeight();
      currentHeight = this.megaNavDropdown.height();
      if (currentHeight < nextTierHeight) {
        this.megaNavDropdown.height(nextTierHeight);
      } else {
        nextTier.css({
          "bottom": 0
        });
      }
      return $(e.currentTarget).removeClass("working").addClass("active");
    };

    NavigationView.prototype.previousTier = function(e) {
      var previousTierHeight;
      if ($(e.currentTarget).hasClass("current-tier")) {
        return;
      }
      if ($(e.currentTarget).hasClass("first-tier")) {
        this.$(".active").removeClass("active");
        this.megaNavDropdown.height(this.megaNavDropdown.data("first-tier-height"));
      } else {
        $(e.currentTarget).closest("ul").siblings(".active").removeClass("active");
        previousTierHeight = $(e.currentTarget).closest(".mega-nav-second-tier").outerHeight();
        this.megaNavDropdown.height(previousTierHeight);
      }
      if (!this.$(".active").length) {
        return this.resetMegaNav();
      }
    };

    return NavigationView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.SidebarView = (function(_super) {
    __extends(SidebarView, _super);

    function SidebarView() {
      return SidebarView.__super__.constructor.apply(this, arguments);
    }

    SidebarView.prototype.events = {
      "click .has-children > a": "toggleDropdown"
    };

    SidebarView.prototype.initialize = function() {};

    SidebarView.prototype.toggleDropdown = function(e) {
      if (document.documentElement.clientWidth < 721) {
        e.preventDefault();
        $(e.target).parent().toggleClass("open");
        return false;
      }
    };

    return SidebarView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.FooterView = (function(_super) {
    __extends(FooterView, _super);

    function FooterView() {
      return FooterView.__super__.constructor.apply(this, arguments);
    }

    FooterView.prototype.events = {};

    FooterView.prototype.initialize = function() {
      this.instagramToken = Pacific.settings["footer-instagram-access-token"];
      if (this.$(".footer-instagram").length && this.instagramToken.length) {
        this.fetchInstagramPhotos();
      }
      if (this.$(".footer-tweet").length) {
        return this.fetchTweets();
      }
    };

    FooterView.prototype.fetchInstagramPhotos = function() {
      var url;
      if (Pacific.settings["footer-instagram-use-tag"]) {
        url = "https://api.instagram.com/v1/tags/riflepaper/media/recent?access_token=" + this.instagramToken + "&count=3&callback=?";
      } else {
        url = "https://api.instagram.com/v1/users/self/media/recent?access_token=" + this.instagramToken + "&count=3&callback=?";
      }
      return $.ajax(url, {
        type: "GET",
        dataType: "jsonp",
        timeout: 10000,
        error: (function(_this) {
          return function(jqXHR, textStatus) {
            _this.$(".footer-instagram").hide();
            console.log("Instagram Error: " + textStatus);
            if (textStatus === "timeout") {
              return console.log("A timeout error means that either the API is down or the merchant provided an incorrect User ID causing a 404.");
            }
          };
        })(this),
        success: (function(_this) {
          return function(query) {
            var photo, _i, _len, _ref, _results;
            if (query.meta.code === 200) {
              _ref = query.data.slice(0, 3);
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                photo = _ref[_i];
                _results.push(_this.$(".footer-instagram-photos").append("<a class='footer-instagram-photo' href='" + photo.link + "' target='_blank'><img alt='' src='" + photo.images.standard_resolution.url + "'></a>"));
              }
              return _results;
            } else {
              _this.$(".footer-instagram").hide();
              return console.log("Instagram Error: " + query.meta.error_message);
            }
          };
        })(this)
      });
    };

    FooterView.prototype.fetchTweets = function() {
      var config;
      config = {
        "id": "534434100371656704",
        "maxTweets": 1,
        "enableLinks": true,
        "showUser": true,
        "showTime": true,
        "showRetweet": Pacific.settings["footer-twitter-retweets"],
        "customCallback": this.renderTweets,
        "showInteraction": false
      };
      return twitterFetcher.fetch(config);
    };

    FooterView.prototype.renderTweets = function(tweets) {
      if (tweets.length) {
        return this.$(".footer-tweet").append(tweets[0]);
      } else {
        return console.log("No tweets to display. Most probably cause is an incorrectly entered Widget ID.");
      }
    };

    return FooterView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.AccountView = (function(_super) {
    __extends(AccountView, _super);

    function AccountView() {
      return AccountView.__super__.constructor.apply(this, arguments);
    }

    AccountView.prototype.events = {
      "click .delete-address": "deleteAddress",
      "click .edit-address": "editAddress",
      "click .cancel-edit": "cancelEditing",
      "click .toggle-new-address": "toggleNewAddress",
      "click .toggle-forgetfulness span": "recoverPassword"
    };

    AccountView.prototype.initialize = function() {
      if ($(document.body).hasClass("template-customers-addresses")) {
        this.prepareAddresses();
      }
      if ($(document.body).hasClass("template-customers-login")) {
        this.checkForReset();
      }
      if (window.location.hash === "#recover") {
        return this.recoverPassword();
      }
    };

    AccountView.prototype.recoverPassword = function() {
      this.$(".recover-password").toggle();
      return this.$(".customer-login").toggle();
    };

    AccountView.prototype.checkForReset = function() {
      if ($(".reset-check").data("successful-reset") === true) {
        return $(".successful-reset").show();
      }
    };

    AccountView.prototype.prepareAddresses = function() {
      var address, addressID, addresses, _i, _len, _results;
      new Shopify.CountryProvinceSelector("address-country", "address-province", {
        hideElement: "address-province-container"
      });
      addresses = this.$(".customer-address");
      if (addresses.length) {
        _results = [];
        for (_i = 0, _len = addresses.length; _i < _len; _i++) {
          address = addresses[_i];
          addressID = $(address).data("address-id");
          _results.push(new Shopify.CountryProvinceSelector("address-country-" + addressID, "address-province-" + addressID, {
            hideElement: "address-province-container-" + addressID
          }));
        }
        return _results;
      }
    };

    AccountView.prototype.deleteAddress = function(e) {
      var addressID;
      addressID = $(e.target).parents("[data-address-id]").data("address-id");
      return Shopify.CustomerAddress.destroy(addressID);
    };

    AccountView.prototype.editAddress = function(e) {
      var addressID, modalContent;
      addressID = $(e.target).parents("[data-address-id]").data("address-id");
      modalContent = new ModalContent({
        title: false,
        message: false
      });
      return new ModalView({
        model: modalContent,
        el: this.$(".modal-wrapper[data-address-id='" + addressID + "']")
      });
    };

    AccountView.prototype.cancelEditing = function(e) {
      var addressID;
      addressID = $(e.target).parents("[data-address-id]").data("address-id");
      $(".customer-address[data-address-id='" + addressID + "']").removeClass("editing");
      return $(".customer-address-edit-form[data-address-id='" + addressID + "']").removeClass("show");
    };

    AccountView.prototype.toggleNewAddress = function() {
      this.$(".add-new-address").toggle();
      return this.$(".customer-new-address").toggleClass("show");
    };

    return AccountView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.CartView = (function(_super) {
    __extends(CartView, _super);

    function CartView() {
      return CartView.__super__.constructor.apply(this, arguments);
    }

    CartView.prototype.events = {
      "change .cart-item-quantity-display": "updateQuantity",
      "click .cart-item-decrease": "updateQuantity",
      "click .cart-item-increase": "updateQuantity",
      "click .remove span": "removeProduct",
      "click .cart-undo": "undoRemoval",
      "change .cart-instructions textarea": "saveSpecialInstructions",
      "click .cart-item-upload": "showFile",
      "click .get-rates": "onGetRates"
    };

    CartView.prototype.initialize = function() {
      this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
      this.savedProducts = [];
      if (Pacific.settings["cart-shipping-calculator"] && Shop.requiresShipping) {
        this.shippingCalculator();
        if (Shop.customerLoggedIn && Shop.customerAddress.country.length && Shop.customerAddress.zip.length) {
          this.calculateShipping(true);
        }
        return Shopify.onError = (function(_this) {
          return function(XMLHttpRequest) {
            return _this.handleErrors(XMLHttpRequest);
          };
        })(this);
      }
    };

    CartView.prototype.saveSpecialInstructions = function() {
      var newNote;
      newNote = $(".cart-instructions textarea").val();
      return Shopify.updateCartNote(newNote, function(cart) {});
    };

    CartView.prototype.updateQuantity = function(e) {
      var inventory, modalContent, newQuantity, oldQuantity, productPrice, productQuantity, productRow, variant;
      productRow = $(e.target).parents("tr");
      productQuantity = productRow.find(".cart-item-quantity-display");
      oldQuantity = parseInt(productQuantity.val());
      if (Pacific.settings["disable-ajax"] || Pacific.settings["enable-currency-switcher"]) {
        if ($(e.target).hasClass("cart-item-increase")) {
          newQuantity = oldQuantity + 1;
          productQuantity.val(newQuantity);
        } else if ($(e.target).hasClass("cart-item-decrease")) {
          newQuantity = oldQuantity - 1;
          productQuantity.val(newQuantity);
        }
        return;
      }
      productPrice = productRow.find(".cart-item-total .money");
      variant = productRow.data("variant");
      inventory = parseInt(productRow.find(".cart-item-quantity").data("max"), 10);
      if ($(e.target).hasClass(".cart-item-quantity-display")) {
        newQuantity = productQuantity;
      } else if ($(e.target).hasClass("cart-item-increase")) {
        newQuantity = oldQuantity + 1;
      } else {
        newQuantity = oldQuantity - 1;
      }
      if (newQuantity === 0) {
        this.removeProduct(null, variant);
        return;
      }
      if (newQuantity > inventory) {
        modalContent = new ModalContent({
          title: "Not Available",
          message: "<p>Sorry, we only have " + inventory + " in stock.</p>",
          button: "Okay"
        });
        new ModalView({
          model: modalContent,
          el: this.$(".modal-wrapper")
        });
      }
      return Shopify.changeItem(variant, newQuantity, (function(_this) {
        return function(cart) {
          var item, newProductPrice, _i, _len, _ref;
          _ref = cart.items;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (item.id === variant) {
              newProductPrice = Shopify.formatMoney(item.line_price, Shop.moneyFormat);
              productPrice.html(newProductPrice);
              productRow.find(".cart-item-quantity-display").val(item.quantity);
            }
          }
          return _this.updateCart(cart);
        };
      })(this));
    };

    CartView.prototype.removeProduct = function(e, variant) {
      var itemRow, itemRowContents, productTitle, productURL, showUndo;
      if (variant) {
        itemRow = $(".variant-" + variant);
      } else {
        variant = $(e.target).parents("tr").data("variant");
        itemRow = $(e.target).parents("tr");
      }
      itemRowContents = itemRow.find("td");
      productTitle = itemRow.data("title");
      productURL = itemRow.data("url");
      this.savedProducts[variant] = {
        "id": variant,
        "content": itemRowContents,
        "quantity": itemRow.find("td.quantity input").val()
      };
      showUndo = (function(_this) {
        return function() {
          var itemRemovedText;
          itemRemovedText = "{{ item_title }} has be removed from your cart.".replace("{{ item_title }}", "<a href='" + productURL + "'>" + productTitle + "</a>");
          itemRow.html("<td colspan='5'>" + itemRemovedText + " <span class='cart-undo' data-variant='" + variant + "'>Undo?</span>");
          return itemRow.removeClass("removing");
        };
      })(this);
      return Shopify.removeItem(variant, (function(_this) {
        return function(cart) {
          if (Modernizr.csstransitions) {
            itemRow.addClass("removing").one(_this.transitionend, function() {
              return showUndo();
            });
          } else {
            showUndo();
          }
          return _this.updateCart(cart);
        };
      })(this));
    };

    CartView.prototype.undoRemoval = function(e) {
      var savedProduct, variant;
      variant = $(e.target).data("variant");
      savedProduct = this.savedProducts[variant];
      $("tr.variant-" + variant).html(savedProduct.content);
      return Shopify.addItem(variant, savedProduct.quantity, (function(_this) {
        return function() {
          return Shopify.getCart(function(cart) {
            return _this.updateCart(cart);
          });
        };
      })(this));
    };

    CartView.prototype.updateCart = function(cart) {
      var cartCount, cartCountText, newTotal;
      newTotal = Shopify.formatMoney(cart.total_price, Shop.moneyFormat);
      this.$(".cart-checkout .cart-price .money").html(newTotal);
      cartCount = cart.item_count;
      cartCountText = cart.item_count === 1 ? "item" : "items";
      $(".bag-count").text(cartCount);
      return $(".bag-text").text(cartCountText);
    };

    CartView.prototype.showFile = function(e) {
      var file, image, modalContent;
      file = $(e.target).data("file");
      if (file.match(/(jpg|jpeg|png|gif)/)) {
        image = "<img alt='' src='" + file + "'>";
        modalContent = new ModalContent({
          title: $(e.target).prev().text(),
          message: image
        });
        return new ModalView({
          model: modalContent,
          el: this.$(".modal-wrapper")
        });
      }
    };

    CartView.prototype.shippingCalculator = function() {
      var selectableOptions;
      Shopify.Cart.ShippingCalculator.show({
        submitButton: "Calculate shipping",
        submitButtonDisabled: "Calculating...",
        customerIsLoggedIn: Shop.customerLoggedIn,
        moneyFormat: Shop.moneyFormat
      });
      selectableOptions = this.$(".cart-shipping-calculator select");
      setTimeout((function(_this) {
        return function() {
          var select, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selectableOptions.length; _i < _len; _i++) {
            select = selectableOptions[_i];
            _results.push(_this.updateShippingLabel(select));
          }
          return _results;
        };
      })(this), 500);
      return this.$(".cart-shipping-calculator select").change((function(_this) {
        return function(e) {
          var select, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selectableOptions.length; _i < _len; _i++) {
            select = selectableOptions[_i];
            _results.push(_this.updateShippingLabel(select));
          }
          return _results;
        };
      })(this));
    };

    CartView.prototype.onGetRates = function() {
      return this.calculateShipping();
    };

    CartView.prototype.calculateShipping = function(auto) {
      var shippingAddress;
      this.$(".get-rates").val("Calculating...");
      if (auto) {
        shippingAddress = Shop.customerAddress;
      } else {
        shippingAddress = {};
        shippingAddress.zip = this.$(".address-zip").val() || "";
        shippingAddress.country = this.$(".address-country").val() || "";
        shippingAddress.province = this.$(".address-province").val() || "";
      }
      return Shopify.getCartShippingRatesForDestination(shippingAddress, function(rates) {
        var address, feedback, firstRate, price, rate, rateValues, ratesFeedback, response, shippingCalculatorResponse, _i, _len;
        address = "" + shippingAddress.zip + ", " + shippingAddress.province + ", " + shippingAddress.country;
        if (!shippingAddress.province.length) {
          address = "" + shippingAddress.zip + ", " + shippingAddress.country;
        }
        if (!shippingAddress.zip.length) {
          address = "" + shippingAddress.province + ", " + shippingAddress.country;
        }
        if (!(shippingAddress.province.length && shippingAddress.zip.length)) {
          address = shippingAddress.country;
        }
        shippingCalculatorResponse = this.$(".cart-shipping-calculator-response");
        shippingCalculatorResponse.empty().append("<p class='shipping-calculator-response message'/><ul class='shipping-rates'/>");
        ratesFeedback = $(".shipping-calculator-response");
        if (rates.length > 1) {
          firstRate = Shopify.Cart.ShippingCalculator.formatRate(rates[0].price);
          feedback = "There are {{ number_of_rates }} shipping rates available for {{ address }}, starting at {{ rate }}.".replace("{{ address }}", address).replace("{{ number_of_rates }}", rates.length).replace("{{ rate }}", "<span class='money'>" + firstRate + "</span>");
          ratesFeedback.html(feedback);
        } else if (rates.length === 1) {
          response = "There is one shipping rate available for {{ address }}.".replace("{{ address }}", address);
          ratesFeedback.html(response);
        } else {
          ratesFeedback.html("We do not ship to this destination.");
        }
        for (_i = 0, _len = rates.length; _i < _len; _i++) {
          rate = rates[_i];
          price = Shopify.Cart.ShippingCalculator.formatRate(rate.price);
          rateValues = "{{ rate_title }} at {{ rate }}".replace("{{ rate_title }}", rate.name).replace("{{ rate }}", "<span class='money'>" + price + "</span>");
          this.$(".shipping-rates").append("<li>" + rateValues + "</li>");
        }
        return this.$(".get-rates").val("Calculate shipping");
      });
    };

    CartView.prototype.handleErrors = function(errors) {
      var errorMessage;
      errorMessage = $.parseJSON(errors.responseText);
      errorMessage = "Error: zip / postal code {{ error_message }}".replace("{{ error_message }}", errorMessage.zip);
      this.$(".cart-shipping-calculator-response").html("<p class='error'>" + errorMessage + "</p>");
      return this.$(".get-rates").val("Calculate shipping");
    };

    CartView.prototype.updateShippingLabel = function(select) {
      var selectedOption;
      if (select) {
        select = $(select);
        selectedOption = select.find("option:selected").val();
        if (!selectedOption) {
          selectedOption = select.prev(".selected-text").data("default");
        }
        select.prev(".selected-text").text(selectedOption);
        return setTimeout((function(_this) {
          return function() {
            if (select.attr("name") === "address[country]") {
              return _this.updateShippingLabel(_this.$("#address_province"));
            }
          };
        })(this), 500);
      }
    };

    return CartView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ModalContent = (function(_super) {
    __extends(ModalContent, _super);

    function ModalContent() {
      return ModalContent.__super__.constructor.apply(this, arguments);
    }

    ModalContent.prototype.defaults = {
      title: "",
      message: "",
      button: false
    };

    return ModalContent;

  })(Backbone.Model);

  window.ModalView = (function(_super) {
    __extends(ModalView, _super);

    function ModalView() {
      return ModalView.__super__.constructor.apply(this, arguments);
    }

    ModalView.prototype.events = {
      "click .modal-close": "closeModal"
    };

    ModalView.prototype.initialize = function() {
      this.content = this.model.toJSON();
      this.body = $(document.body);
      this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
      this.enterContent();
      return this.openModal();
    };

    ModalView.prototype.enterContent = function() {
      if (this.content.title) {
        this.$(".modal-title").text(this.content.title);
      }
      if (this.content.message) {
        this.$(".modal-message").html(this.content.message);
      }
      if (this.content.button) {
        return this.$(".modal-message").append("<p><span class='modal-close button'>" + this.content.button + "</span></p>");
      }
    };

    ModalView.prototype.centerModal = function() {
      var modalContentHeight, modalContentWidth;
      modalContentHeight = this.$(".modal-content").outerHeight();
      modalContentWidth = this.$(".modal-content").outerWidth();
      if (modalContentHeight > $(window).height()) {
        this.$(".modal-content").css({
          marginTop: 0,
          marginLeft: -(modalContentWidth / 2)
        });
        return this.body.addClass("modal-overflow");
      } else {
        this.$(".modal-content").css({
          marginTop: -(modalContentHeight / 2),
          marginLeft: -(modalContentWidth / 2)
        });
        return this.body.removeClass("modal-overflow");
      }
    };

    ModalView.prototype.openModal = function() {
      var checkImagesLoaded;
      this.$el.addClass("active");
      setTimeout((function(_this) {
        return function() {
          return _this.$el.addClass("opening");
        };
      })(this), 20);
      checkImagesLoaded = (function(_this) {
        return function() {
          return _this.$el.imagesLoaded(function() {
            _this.centerModal();
            $(window).on("resize", _.debounce(_this.centerModal, 50));
            return _this.$el.addClass("open");
          });
        };
      })(this);
      if (Modernizr.csstransitions) {
        this.$el.one(this.transitionend, (function(_this) {
          return function() {
            return checkImagesLoaded();
          };
        })(this));
      } else {
        checkImagesLoaded();
      }
      return this.body.on("keyup.modal", (function(_this) {
        return function(e) {
          if (e && e.type === "keyup" && e.keyCode === 27) {
            return _this.closeModal();
          }
        };
      })(this));
    };

    ModalView.prototype.closeModal = function() {
      var finishClosing;
      this.body.off("keyup.modal");
      this.$el.removeClass("open");
      this.$(".modal-content").one(this.transitionend, (function(_this) {
        return function(e) {
          return _this.$el.removeClass("opening");
        };
      })(this));
      finishClosing = (function(_this) {
        return function() {
          _this.$(".modal-content").unbind();
          _this.$el.unbind();
          _this.unbind();
          _this.body.removeClass("modal-overflow");
          return _this.$el.removeClass("active");
        };
      })(this);
      if (Modernizr.csstransitions) {
        this.$(".modal-content").one(this.transitionend, (function(_this) {
          return function(e) {
            return _this.$el.removeClass("opening");
          };
        })(this));
        return this.$el.on(this.transitionend, (function(_this) {
          return function(e) {
            if ($(e.target).hasClass("modal-wrapper")) {
              return finishClosing();
            }
          };
        })(this));
      } else {
        this.$el.removeClass("opening");
        return finishClosing();
      }
    };

    return ModalView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.events = {
      "change .collection-filter select": "updateFilter",
      "change .collection-sorting select": "sortProducts",
      "click .collection-remove-filter": "resetFilter",
      "click .collection-description-more": "createModal",
      "click .collection-sharing-toggle": "toggleSharing",
      "mouseout .share-buttons": "toggleSharing"
    };

    CollectionView.prototype.initialize = function() {
      this.tagsWrapper = this.$(".collection-tags-wrapper");
      this.tags = this.tagsWrapper.find(".collection-tags");
      this.tagFilter = this.$(".collection-tags-apply");
      if ($("html").hasClass("lt-ie9") && this.$(".collection-header").length) {
        this.verticallyAlignHeaderText();
      }
      if (Pacific.settings["collection-filtering"]) {
        this.filterProducts();
      }
      if (Pacific.settings["collection-product-text-style"] === "overlay") {
        this.verticallyAlignProductDetails();
      }
      if (Pacific.settings["collection-layout-style"] === "masonry") {
        return this.masonryLayout();
      }
    };

    CollectionView.prototype.verticallyAlignHeaderText = function() {
      var headerHeight;
      headerHeight = this.$(".collection-details").height();
      return this.$(".collection-details").css({
        marginTop: -(headerHeight / 2)
      });
    };

    CollectionView.prototype.verticallyAlignProductDetails = function() {
      var detailsHeight, product, _i, _len, _ref, _results;
      _ref = this.$(".product-list-item");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        product = _ref[_i];
        detailsHeight = $(product).find(".product-list-item-details").height();
        _results.push($(product).find(".product-list-item-details").css({
          marginTop: -(detailsHeight / 2)
        }));
      }
      return _results;
    };

    CollectionView.prototype.toggleSharing = function(e) {
      if (e.type === "mouseout") {
        if ($(e.relatedTarget).closest(".share-buttons").length) {
          return;
        }
      }
      return this.$(".collection-sharing").toggleClass("active");
    };

    CollectionView.prototype.sortProducts = function(e) {
      var Sorting, currentSearch, index, part, search, searchParts, _i, _len;
      Sorting = {};
      Sorting.sort_by = this.$(".collection-sorting select").val();
      if ($(e.target).closest(".collection-sorting").hasClass("vendor-collection")) {
        currentSearch = location.search;
        searchParts = currentSearch.split("&");
        for (index = _i = 0, _len = searchParts.length; _i < _len; index = ++_i) {
          part = searchParts[index];
          if (part.indexOf("sort_by") !== -1) {
            searchParts.splice(index, 1);
          }
        }
        search = searchParts.join("&");
        return location.search = "" + search + "&" + (jQuery.param(Sorting));
      } else {
        return location.search = jQuery.param(Sorting);
      }
    };

    CollectionView.prototype.masonryLayout = function() {
      var products;
      products = this.$(".collection-products");
      if (this.$(".product-list-item").length) {
        return products.imagesLoaded((function(_this) {
          return function() {
            var masonry;
            products.masonry({
              transitionDuration: 0
            });
            masonry = products.data("masonry");
            masonry.on("layoutComplete", products.addClass("processed"));
            return masonry.off("layoutComplete");
          };
        })(this));
      } else {
        return products.addClass("processed empty-collection");
      }
    };

    CollectionView.prototype.filterProducts = function() {
      var filter, selectedText, _i, _len, _ref, _results;
      this.fallbackURL = this.$(".collection-filtering").data("fallback-url");
      _ref = this.$(".collection-filter select");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        if ($(filter).val() !== "any") {
          selectedText = $(filter).find("option:selected").text();
          _results.push($(filter).prev().find("strong").text(selectedText));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    CollectionView.prototype.updateFilter = function(e) {
      var filter, filterURL, newTags, tag, tags, _i, _len, _ref;
      newTags = [];
      $(e.target).toggleClass("active");
      _ref = this.$(".collection-filter select");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        if ($(filter).val() !== "any") {
          tag = $(filter).val();
          newTags.push(tag);
        }
      }
      if (newTags.length) {
        tags = newTags.join("+");
        filterURL = "" + this.fallbackURL + "/" + tags + location.search;
        return window.location.href = filterURL;
      } else {
        return this.resetFilter();
      }
    };

    CollectionView.prototype.resetFilter = function() {
      var fallback;
      fallback = "" + this.fallbackURL + location.search;
      return window.location.href = fallback;
    };

    CollectionView.prototype.createModal = function() {
      var modalContent;
      modalContent = new ModalContent({
        "title": collectionJSON.title,
        "message": collectionJSON.body_html
      });
      return new ModalView({
        model: modalContent,
        el: this.$(".modal-wrapper")
      });
    };

    return CollectionView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.SlideshowView = (function(_super) {
    __extends(SlideshowView, _super);

    function SlideshowView() {
      return SlideshowView.__super__.constructor.apply(this, arguments);
    }

    SlideshowView.prototype.events = {
      "click .previous-slide": "previousSlide",
      "click .next-slide": "nextSlide",
      "click .slideshow-pagination > span": "specificSlide",
      "mouseenter": "pauseLoop",
      "mouseleave": "startLoop"
    };

    SlideshowView.prototype.initialize = function() {
      this.navigation = this.$(".slideshow-navigation");
      this.pagination = this.$(".slideshow-pagination");
      this.setWindowWidth();
      this.setupSlides();
      return this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
    };

    SlideshowView.prototype.setWindowWidth = function() {
      return this.windowWidth = document.documentElement.clientWidth;
    };

    SlideshowView.prototype.setupSlides = function() {
      var paginationWidth;
      this.slides = this.$(".slideshow-slide");
      this.slideCount = this.slides.length;
      this.pagination.find("span:first").addClass("active");
      if (!Modernizr.csstransforms) {
        paginationWidth = this.pagination.width();
        this.pagination.css({
          marginLeft: -(paginationWidth / 2)
        });
      }
      return this.$el.imagesLoaded((function(_this) {
        return function() {
          var i, image, imageHeight, slide, slideContent, slideHeight, slideID, textHeight, _i, _len, _ref;
          _ref = _this.slides;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            slide = _ref[i];
            slide = $(slide);
            slideID = slide.attr("id");
            image = slide.find(".slide-image");
            imageHeight = image.height();
            slide.data("height", imageHeight);
            slideHeight = _this.windowWidth <= 540 ? slide.height() : imageHeight;
            if (!Modernizr.csstransforms) {
              slideContent = slide.find(".slide-content");
              textHeight = slideContent.height();
              slideContent.css({
                marginTop: -(textHeight / 2)
              });
            }
            if (i === 0) {
              slide.addClass("active");
              _this.$el.height(slideHeight);
              _this.navigation.css({
                paddingTop: "" + ((imageHeight - 48) / 2) + "px"
              });
              _this.resetPaginationPosition(imageHeight);
            }
            if (i + 1 === _this.slideCount) {
              _this.$el.addClass("slides-ready");
            }
          }
          $(window).on("resize", function() {
            _this.setWindowWidth();
            return _this.resetSlideHeights();
          });
          if (Pacific.settings["slideshow-autoplay"]) {
            _this.delay = 4000;
            if (Pacific.settings["slideshow-autoplay-delay"].length) {
              _this.delay = parseInt(Pacific.settings["slideshow-autoplay-delay"], 10) * 1000;
            }
            return _this.startLoop();
          }
        };
      })(this));
    };

    SlideshowView.prototype.resetSlideHeights = function() {
      var image, imageHeight, slide, slideHeight, _i, _len, _ref, _results;
      _ref = this.slides;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        slide = $(slide);
        image = slide.find(".slide-image");
        imageHeight = image.height();
        slide.css("height", "");
        slide.data("height", imageHeight);
        slideHeight = this.windowWidth <= 540 ? slide.height() : imageHeight;
        if (slide.hasClass("active")) {
          this.$el.height(slideHeight);
          this.navigation.css({
            paddingTop: "" + ((imageHeight - 48) / 2) + "px"
          });
          _results.push(this.resetPaginationPosition(imageHeight));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SlideshowView.prototype.resetPaginationPosition = function(height) {
      if (this.windowWidth <= 540) {
        return this.pagination.css({
          bottom: "auto",
          top: height - 50
        });
      } else {
        return this.pagination.css({
          bottom: 0,
          top: "auto"
        });
      }
    };

    SlideshowView.prototype.previousSlide = function(e) {
      if (this.sliding) {
        return;
      }
      this.showNewSlide("prev");
      return e.preventDefault();
    };

    SlideshowView.prototype.nextSlide = function(e) {
      if (this.sliding) {
        return;
      }
      this.showNewSlide("next");
      if (e) {
        return e.preventDefault();
      }
    };

    SlideshowView.prototype.specificSlide = function(e) {
      var nextSlideID;
      if (!$(e.currentTarget).hasClass("active")) {
        nextSlideID = $(e.currentTarget).data("slide-id");
        return this.showNewSlide("next", nextSlideID);
      }
    };

    SlideshowView.prototype.updateSlidePagination = function(index) {
      this.pagination.find(".active").removeClass("active");
      return this.pagination.find("> span").eq(index).addClass("active");
    };

    SlideshowView.prototype.showNewSlide = function(type, specificSlide) {
      var activeSlide, called, direction, fallback, imageHeight, nextSlide, slideHeight, slideID;
      this.sliding = true;
      called = false;
      if (this.slides.length === 1) {
        this.sliding = false;
        return;
      }
      direction = type === "next" ? "left" : "right";
      fallback = type === "next" ? "first" : "last";
      activeSlide = this.$(".slideshow-slide.active");
      nextSlide = specificSlide ? this.$("#" + specificSlide) : activeSlide[type]();
      nextSlide = nextSlide.length ? nextSlide : this.slides[fallback]();
      nextSlide.addClass(type);
      nextSlide[0].offsetWidth;
      activeSlide.addClass(direction);
      nextSlide.addClass(direction);
      if (Modernizr.csstransitions) {
        nextSlide.one(this.transitionend, (function(_this) {
          return function() {
            called = true;
            nextSlide.removeClass([type, direction].join(" ")).addClass("active");
            activeSlide.removeClass(["active", direction].join(" "));
            return _this.sliding = false;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            if (!called) {
              return nextSlide.trigger(_this.transitionend);
            }
          };
        })(this), 300 + 10);
      } else {
        nextSlide.removeClass([type, direction].join(" ")).addClass("active");
        activeSlide.removeClass(["active", direction].join(" "));
        this.sliding = false;
      }
      imageHeight = nextSlide.data("height");
      this.updateSlidePagination(nextSlide.index());
      this.resetPaginationPosition(imageHeight);
      this.navigation.css({
        paddingTop: "" + ((imageHeight - 48) / 2) + "px"
      });
      slideHeight = this.windowWidth <= 720 ? nextSlide.height() : imageHeight;
      slideID = nextSlide.attr('id');
      return this.$el.height(slideHeight).removeClass("showing-slide-" + (activeSlide.index() + 1)).addClass("showing-slide-" + (nextSlide.index() + 1));
    };

    SlideshowView.prototype.startLoop = function() {
      if (Pacific.settings["slideshow-autoplay"]) {
        if (!this.loop) {
          this.loop = true;
          return this.autoplay = setInterval((function(_this) {
            return function() {
              return _this.nextSlide();
            };
          })(this), this.delay);
        }
      }
    };

    SlideshowView.prototype.pauseLoop = function() {
      this.loop = false;
      return clearInterval(this.autoplay);
    };

    return SlideshowView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.HomeView = (function(_super) {
    __extends(HomeView, _super);

    function HomeView() {
      return HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.events = {
      "click .home-video-play-button": "openVideo",
      "keyup": "closeVideo"
    };

    HomeView.prototype.initialize = function() {
      var collection, feature, product, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if (Pacific.settings["home-modules-order"].indexOf("A") > -1) {
        new SlideshowView({
          el: this.$(".home-slideshow")
        });
      }
      if (this.$(".home-video").length) {
        this.videoWrapper = this.$(".home-video-embed-wrapper");
        this.video = this.$(".home-video-embed");
        this.detachedVideo = null;
      }
      if (this.$(".home-featured-products").length && Pacific.settings["collection-product-text-style"] === "overlay") {
        _ref = this.$(".product-list-item");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          product = _ref[_i];
          this.verticallyAlignContent($(product).find(".product-list-item-details"));
        }
      }
      if ($("html").hasClass("lt-ie9")) {
        this.centerVideoText();
        _ref1 = this.$(".home-featured-collection");
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          collection = _ref1[_j];
          this.verticallyAlignContent($(collection).find(".home-featured-collection-content"));
        }
        _ref2 = this.$(".home-feature");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          feature = _ref2[_k];
          if ($(feature).find(".home-feature-content").length) {
            this.verticallyAlignContent($(feature).find(".home-feature-content"));
          }
        }
      }
      return this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
    };

    HomeView.prototype.openVideo = function() {
      this.videoWrapper.addClass("opening");
      if (this.detachedVideo) {
        this.video.width("");
        this.detachedVideo.appendTo(this.video);
      } else {
        this.video.fitVids({
          customSelector: "iframe"
        });
      }
      this.verticallyCenterVideo();
      $(window).on("resize.video", (function(_this) {
        return function() {
          return _this.verticallyCenterVideo();
        };
      })(this));
      this.videoWrapper.on("click.video", (function(_this) {
        return function() {
          return _this.closeVideo();
        };
      })(this));
      return setTimeout((function(_this) {
        return function() {
          return _this.videoWrapper.addClass("open");
        };
      })(this), 20);
    };

    HomeView.prototype.centerVideoText = function() {
      var contentHeight, contentWidth, videoContent;
      videoContent = this.$(".home-video-content");
      contentWidth = videoContent.outerWidth();
      contentHeight = videoContent.outerHeight();
      return videoContent.css({
        marginTop: -(contentHeight / 2),
        marginLeft: -(contentWidth / 2)
      });
    };

    HomeView.prototype.verticallyCenterVideo = function() {
      var availableHeight, video, videoHeight, videoRatio, windowHeight;
      this.video.css({
        marginTop: 0,
        width: "100%"
      });
      video = this.video.find(".fluid-width-video-wrapper");
      videoHeight = video.outerHeight();
      videoRatio = video.width() / videoHeight;
      windowHeight = window.innerHeight || $(window).height();
      availableHeight = windowHeight - 60;
      if (videoHeight > availableHeight) {
        return this.video.removeClass("centered").css({
          marginTop: 0,
          width: availableHeight * videoRatio
        });
      } else {
        return this.video.addClass("centered").css({
          marginTop: -(videoHeight / 2),
          width: "100%"
        });
      }
    };

    HomeView.prototype.closeVideo = function(e) {
      var detach;
      if (!this.$(".home-video").length) {
        return;
      }
      if (e && this.videoWrapper.hasClass("open")) {
        if (e.which !== 27) {
          return;
        }
      }
      $(window).off("resize.video");
      this.videoWrapper.off("click.video");
      this.videoWrapper.removeClass("open");
      detach = (function(_this) {
        return function() {
          _this.detachedVideo = _this.video.find(".fluid-width-video-wrapper").detach();
          return _this.videoWrapper.removeClass("opening").off(_this.transitionend);
        };
      })(this);
      if (Modernizr.csstransitions) {
        this.videoWrapper.on(this.transitionend, (function(_this) {
          return function() {
            return detach();
          };
        })(this));
        return setTimeout((function(_this) {
          return function() {
            if (_this.videoWrapper.hasClass("opening")) {
              return detach();
            }
          };
        })(this), 300);
      } else {
        return detach();
      }
    };

    HomeView.prototype.verticallyAlignContent = function(content) {
      var contentHeight;
      content = $(content);
      contentHeight = content.outerHeight();
      return content.css({
        marginTop: -(contentHeight / 2)
      });
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ListCollectionsView = (function(_super) {
    __extends(ListCollectionsView, _super);

    function ListCollectionsView() {
      return ListCollectionsView.__super__.constructor.apply(this, arguments);
    }

    ListCollectionsView.prototype.events = {};

    ListCollectionsView.prototype.initialize = function() {
      if ($("html").hasClass("lt-ie9")) {
        return this.verticallyAlignDetails();
      }
    };

    ListCollectionsView.prototype.verticallyAlignDetails = function() {
      return this.$(".collections-list").imagesLoaded((function(_this) {
        return function() {
          var collection, collectionDetailsHeight, collectionsDetails, _i, _len, _ref, _results;
          _ref = _this.$(".collection-item");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            collection = _ref[_i];
            collectionsDetails = $(collection).find(".collection-item-details");
            collectionDetailsHeight = collectionsDetails.height();
            _results.push(collectionsDetails.css({
              marginTop: -(collectionDetailsHeight / 2)
            }));
          }
          return _results;
        };
      })(this));
    };

    return ListCollectionsView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ImageZoomView = (function(_super) {
    __extends(ImageZoomView, _super);

    function ImageZoomView() {
      return ImageZoomView.__super__.constructor.apply(this, arguments);
    }

    ImageZoomView.prototype.events = {
      "prepare-zoom": "prepareZoom",
      "click": "toggleZoom",
      "mouseout .product-zoom": "toggleZoom",
      "mousemove .product-zoom": "zoomImage"
    };

    ImageZoomView.prototype.initialize = function() {
      this.zoomArea = this.$(".product-zoom");
      this.$el.imagesLoaded((function(_this) {
        return function() {
          return _this.prepareZoom();
        };
      })(this));
      return $(window).resize((function(_this) {
        return function() {
          return _this.prepareZoom();
        };
      })(this));
    };

    ImageZoomView.prototype.prepareZoom = function() {
      var newImage, photoAreaHeight, photoAreaWidth;
      photoAreaWidth = this.$el.width();
      photoAreaHeight = this.$el.height();
      newImage = new Image();
      $(newImage).on("load", (function(_this) {
        return function() {
          var ratio, ratios;
          _this.zoomImageWidth = newImage.width;
          _this.zoomImageHeight = newImage.height;
          ratios = new Array();
          ratios[0] = _this.zoomImageWidth / photoAreaWidth;
          ratios[1] = _this.zoomImageHeight / photoAreaHeight;
          ratio = Math.max.apply(Math, ratios);
          if (ratio < 1.4) {
            _this.$el.removeClass("zoom-enabled");
          } else {
            _this.$el.addClass("zoom-enabled");
            return _this.zoomArea.css({
              backgroundImage: "url(" + newImage.src + ")"
            });
          }
        };
      })(this));
      return newImage.src = this.$("img").attr("src");
    };

    ImageZoomView.prototype.toggleZoom = function(e) {
      if (this.$el.hasClass("zoom-enabled")) {
        if (e.type === "mouseout") {
          this.zoomArea.removeClass("active");
          return;
        }
        if (this.zoomArea.hasClass("active")) {
          this.zoomArea.removeClass("active");
        } else {
          this.zoomArea.addClass("active");
        }
        return this.zoomImage(e);
      }
    };

    ImageZoomView.prototype.zoomImage = function(e) {
      var bigImageOffset, bigImageX, bigImageY, mousePositionX, mousePositionY, newBackgroundPosition, ratioX, ratioY, zoomHeight, zoomWidth;
      zoomWidth = this.zoomArea.width();
      zoomHeight = this.zoomArea.height();
      bigImageOffset = this.$el.offset();
      bigImageX = Math.round(bigImageOffset.left);
      bigImageY = Math.round(bigImageOffset.top);
      mousePositionX = e.pageX - bigImageX;
      mousePositionY = e.pageY - bigImageY;
      if (mousePositionX < zoomWidth && mousePositionY < zoomHeight && mousePositionX > 0 && mousePositionY > 0) {
        if (this.zoomArea.hasClass("active")) {
          ratioX = Math.round(mousePositionX / zoomWidth * this.zoomImageWidth - zoomWidth / 2) * -1;
          ratioY = Math.round(mousePositionY / zoomHeight * this.zoomImageHeight - zoomHeight / 2) * -1;
          if (ratioX > 0) {
            ratioX = 0;
          }
          if (ratioY > 0) {
            ratioY = 0;
          }
          if (ratioX < -(this.zoomImageWidth - zoomWidth)) {
            ratioX = -(this.zoomImageWidth - zoomWidth);
          }
          if (ratioY < -(this.zoomImageHeight - zoomHeight)) {
            ratioY = -(this.zoomImageHeight - zoomHeight);
          }
          newBackgroundPosition = "" + ratioX + "px " + ratioY + "px";
          return this.zoomArea.css({
            backgroundPosition: newBackgroundPosition
          });
        }
      }
    };

    return ImageZoomView;

  })(Backbone.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ProductView = (function(_super) {
    __extends(ProductView, _super);

    function ProductView() {
      this.selectCallback = __bind(this.selectCallback, this);
      return ProductView.__super__.constructor.apply(this, arguments);
    }

    ProductView.prototype.events = {
      "change .product-options select": "updateVariantLabel",
      "click .product-thumbnails img": "swapImage",
      "submit .product-form": "addToCart"
    };

    ProductView.prototype.initialize = function() {
      this.product = window.productJSON;
      this.variants = this.product.variants;
      this.images = this.product.images;
      this.minimumPriceArea = this.$(".product-price-minimum");
      if (this.$(".product-images").length) {
        this.cacheImages();
      }
      if (this.$(".product-form").length) {
        this.setupSelectors();
      }
      if (Pacific.settings["product-enable-zoom"] && this.$(".product-images").length) {
        new ImageZoomView({
          el: this.$(".product-main-image")
        });
      }
      if (Pacific.settings["collection-product-text-style"] === "overlay" && this.$(".related-products").length) {
        this.verticallyAlignProductDetails();
      }
      return Shopify.onError = (function(_this) {
        return function(XMLHttpRequest) {
          return _this.handleErrors(XMLHttpRequest);
        };
      })(this);
    };

    ProductView.prototype.verticallyAlignProductDetails = function() {
      var detailsHeight, product, _i, _len, _ref, _results;
      _ref = this.$(".related-products");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        product = _ref[_i];
        detailsHeight = $(product).find(".product-list-item-details-wrapper > div").height();
        _results.push($(".product-list-item-details-wrapper > div").css({
          marginTop: -(detailsHeight / 2)
        }));
      }
      return _results;
    };

    ProductView.prototype.switchCurrency = function(minimum, compare) {
      var attribute, _i, _len, _ref;
      _ref = this.minimumPriceArea[0].attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (attribute.name.indexOf("data-") > -1) {
          this.minimumPriceArea.attr(attribute.name, "");
        }
      }
      this.minimumPriceArea.attr("data-currency-" + Currency.currentCurrency, "").attr("data-currency-" + Shop.currency, Shopify.formatMoney(minimum, Shop.moneyFormat)).attr("data-currency", Shop.currency);
      this.$(".product-price-compare").attr("data-currency-" + Shop.currency, Shopify.formatMoney(compare, Shop.moneyFormat)).attr("data-currency", Shop.currency);
      return $(".currency-switcher").trigger("reset-currency");
    };

    ProductView.prototype.cacheImages = function() {
      return Shopify.Image.preload(this.images, "1024x1024");
    };

    ProductView.prototype.swapImage = function(e, newImage) {
      var mainImage;
      newImage = e ? $(e.target).data("high-res") : newImage;
      mainImage = this.$(".product-main-image img")[0];
      mainImage.src = newImage;
      if (Pacific.settings["product-enable-zoom"]) {
        return this.$(".product-main-image").trigger("prepare-zoom");
      }
    };

    ProductView.prototype.setupSelectors = function() {
      var i, selector, value, _i, _len, _ref, _results;
      new Shopify.OptionSelectors("product-variants", {
        product: window.productJSON,
        onVariantSelected: this.selectCallback,
        enableHistoryState: true
      });
      if (this.variants.length === 1 && this.variants[0].title === "Default Title") {
        return this.$(".product-options").addClass("no-options");
      } else {
        if (this.product.options.length === 1 && this.product.options[0] !== "Title") {
          this.$(".selector-wrapper").prepend("<label>" + this.product.options[0] + "</label>");
        }
        _ref = this.$(".selector-wrapper");
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          selector = _ref[i];
          value = $(selector).find("select").val();
          _results.push($(selector).find("select").wrap("<div class='select-wrapper' />").parent().prepend("<div class='select-text'>" + value + "</div>"));
        }
        return _results;
      }
    };

    ProductView.prototype.updateVariantLabel = function(e, select) {
      var selectedVariant;
      select = e ? e.target : select;
      select = $(select);
      selectedVariant = select.find("option:selected").val();
      return select.prev(".select-text").html(selectedVariant);
    };

    ProductView.prototype.selectCallback = function(variant, selector) {
      var addToCartButton, newImage;
      addToCartButton = this.$(".add-to-cart");
      if (variant) {
        this.$(".product-price").removeClass("unavailable");
        if (variant.available) {
          addToCartButton.val("Add to cart").removeClass("disabled").prop("disabled", false);
        } else {
          addToCartButton.val("Sold out").addClass("disabled").prop("disabled", true);
        }
        this.minimumPriceArea.html(Shopify.formatMoney(variant.price, Shop.moneyFormat));
        this.$(".product-price-compare").remove();
        if (variant.compare_at_price > variant.price) {
          this.minimumPriceArea.after("<span class='product-price-compare money' />");
          this.$(".product-price-compare").html(Shopify.formatMoney(variant.compare_at_price, Shop.moneyFormat));
        }
        if (Pacific.settings["enable-currency-switcher"]) {
          this.switchCurrency(variant.price, variant.compare_at_price);
        }
        if (variant && variant.featured_image) {
          newImage = variant.featured_image;
          if (this.$(".product-images").length) {
            return this.swapImage(null, newImage.src);
          }
        }
      } else {
        this.$(".product-price").addClass("unavailable");
        return addToCartButton.val("Unavailable").addClass("disabled").prop("disabled", true);
      }
    };

    ProductView.prototype.addToCart = function(e) {
      if (Pacific.settings["disable-ajax"]) {
        return;
      }
      e.preventDefault();
      this.$(".error-message").remove();
      return Shopify.addItemFromForm("product-form", (function(_this) {
        return function(data) {
          return window.location.href = "/cart";
        };
      })(this));
    };

    ProductView.prototype.handleErrors = function(error) {
      var max, message, target, variant, variantID;
      if (error.responseJSON.message === "Cart Error") {
        variantID = parseInt(this.$("#product-variants").val(), 10);
        target = (function() {
          var _i, _len, _ref, _results;
          _ref = this.product.variants;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            variant = _ref[_i];
            if (variant.id === variantID) {
              _results.push(variant);
            }
          }
          return _results;
        }).call(this);
        max = target[0].inventory_quantity;
        message = "Unable to add more than {{ stock }} to your cart.".replace("{{ stock }}", max);
      } else {
        message = "We were unable to add this product to your cart. Please try again later. Contact us if you continue to have issues.".replace("{{ stock }}", max);
      }
      return this.$(".product-form").append("<div class=\"error-message\">" + message + "</div>");
    };

    return ProductView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.RTEView = (function(_super) {
    __extends(RTEView, _super);

    function RTEView() {
      return RTEView.__super__.constructor.apply(this, arguments);
    }

    RTEView.prototype.events = {
      "click .tabs li": "switchTabs",
      "change .select-wrapper select": "updateOption"
    };

    RTEView.prototype.initialize = function() {
      var select, selects, _i, _len, _results;
      this.setupTabs();
      this.$el.fitVids({
        customSelector: "iframe"
      });
      selects = this.$("select");
      _results = [];
      for (_i = 0, _len = selects.length; _i < _len; _i++) {
        select = selects[_i];
        if (!$(select).parent(".select-wrapper").length) {
          $(select).wrap('<div class="select-wrapper" />').parent().prepend("<span class='selected-text'></span>");
        }
        _results.push(this.updateOption(null, select));
      }
      return _results;
    };

    RTEView.prototype.switchTabs = function(e) {
      var position, tab;
      tab = $(e.currentTarget);
      position = tab.index();
      this.tabs.removeClass("active");
      this.tabsContent.removeClass("active");
      tab.addClass("active");
      return this.tabsContent.eq(position).addClass("active");
    };

    RTEView.prototype.setupTabs = function() {
      this.tabs = this.$(".tabs > li");
      this.tabsContent = this.$(".tabs-content > li");
      this.tabs.first().addClass("active");
      return this.tabsContent.first().addClass("active");
    };

    RTEView.prototype.updateOption = function(e, selector) {
      var newOption, select;
      select = e ? $(e.target) : $(selector);
      newOption = select.find("option:selected").text();
      return select.siblings(".selected-text").text(newOption);
    };

    return RTEView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ThemeView = (function(_super) {
    __extends(ThemeView, _super);

    function ThemeView() {
      return ThemeView.__super__.constructor.apply(this, arguments);
    }

    ThemeView.prototype.el = document.body;

    ThemeView.prototype.initialize = function() {
      var body;
      body = $(document.body);
      this.isHome = body.hasClass("template-index");
      this.isCollection = body.hasClass("template-collection");
      this.isListCollections = body.hasClass("template-list-collections");
      this.isProduct = body.hasClass("template-product");
      this.isCart = body.hasClass("template-cart");
      this.isPage = body.hasClass("template-page");
      this.isAccount = body.attr("class").indexOf("-customers-") > 0;
      window.Pacific = {};
      return Pacific.settings = {"customer_layout":"customer_area","logo-height":"","background-image-width":"","background-image-height":"","background-color":"#ffffff","body-text-color":"#333333","accent-color":"#fb4f16","heading-color":"#1999a8","meta-color":"#aaaaaa","error-color":"#d60000","border-color":"#e5e5e5","primary-button-background":"#11a8b7","primary-button-color":"#ffffff","secondary-button-background":"#b7bcc2","secondary-button-color":"#ffffff","disabled-button-background":"#cccccc","disabled-button-color":"#888888","header-text-color":"#333333","header-promo-background-color":"","header-promo-text-color":"","header-promo-link-color":"","footer-text-color":"#333333","header-promo-text":"","mega-nav-item-text":"Shop","currency-switcher-supported-currencies":"CAD USD","currency-switcher-default":"CAD","home-modules-order":"A-F-G-C-H-E","slideshow-autoplay-delay":"4","slide-1-text-color":"#ffffff","slide-1-text-above":"August 14th - September 14th","slide-1-title":"Back to School","slide-1-text-below":"50% Off Sale","slide-1-url":"http://pacific-theme-bright.myshopify.com/collections/all","slide-2-text-color":"#ffffff","slide-2-text-above":"","slide-2-title":"Homework","slide-2-text-below":"Never Looked So Good","slide-2-url":"http://pacific-theme-bright.myshopify.com/collections/all","slide-3-text-color":"#ffffff","slide-3-text-above":"Quality Papergoods","slide-3-title":"For Work and Play","slide-3-text-below":"Since 1988","slide-3-url":"http://pacific-theme-bright.myshopify.com/collections/all","slide-4-text-color":"#ffffff","slide-4-text-above":"","slide-4-title":"","slide-4-text-below":"","slide-4-url":"","slide-5-text-color":"#ffffff","slide-5-text-above":"","slide-5-title":"","slide-5-text-below":"","slide-5-url":"","home-video-title":"","home-video-cta":"","home-video-url":"","home-feature-row-1-title":"","home-feature-1-text-above":"Shibuya presents patterned notebooks","home-feature-1-title":"Your Take Everywhere Notebook","home-feature-1-text-below":"available at select retail partners","home-feature-1-url":"http://pacific-theme-bright.myshopify.com/products/mon-cahier-journal","home-feature-2-text-above":"","home-feature-2-title":"","home-feature-2-text-below":"","home-feature-2-url":"","home-feature-3-text-above":"","home-feature-3-title":"","home-feature-3-text-below":"","home-feature-3-url":"","home-feature-row-2-title":"","home-feature-4-text-above":"","home-feature-4-title":"The Shibuya Classic A6 Notebook","home-feature-4-text-below":"Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Curabitur blandit tempus porttitor.","home-feature-4-url":"Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Curabitur blandit tempus porttitor.","home-feature-5-text-above":"","home-feature-5-title":"","home-feature-5-text-below":"","home-feature-5-url":"","home-feature-6-text-above":"","home-feature-6-title":"","home-feature-6-text-below":"","home-feature-6-url":"","home-feature-row-3-title":"","home-feature-7-text-above":"","home-feature-7-title":"Back To School","home-feature-7-text-below":"","home-feature-7-url":"http://pacific-theme-bright.myshopify.com/collections/all","home-feature-8-text-above":"","home-feature-8-title":"Papercraft","home-feature-8-text-below":"","home-feature-8-url":"http://pacific-theme-bright.myshopify.com/collections/all","home-feature-9-text-above":"","home-feature-9-title":"Drafting","home-feature-9-text-below":"","home-feature-9-url":"http://pacific-theme-bright.myshopify.com/collections/all","home-featured-collections-title":"Featured Collections","home-featured-products-title":"Featured Products","home-imported-content-title":"","home-blog-posts-title":"News","collections-title-override":"","collection-stock-level-overlay-threshold":"5","collection-stock-level-overlay-text":"Only {NUM} Left!","product-modules-order":"A-B-C-D","shipping-calculator-default-country":"United States","footer-modules-order":"A-C-D","footer-text-box-title":"","footer-twitter-id":"534434100371656704","footer-instagram-access-token":"264172055.1677ed0.f4b22aafc5844a2285b46a5d509e1f41","footer-instagram-tag":"riflepaper","newsletter-action-url":"x","campaign-monitor-name":"","twitter-handle":"@PixelUnion","home-video-embed":"","home-embedded-content-html":"","footer-text-box":"","custom-css":"","body-font":"'PT Mono', monospace","store-title-font":"'PT Mono', monospace","store-title-font-weight":"700","heading-font":"'PT Mono', monospace","heading-font-weight":"700","section-heading-font":"'PT Mono', monospace","section-heading-font-weight":"400","meta-font":"'PT Mono', monospace","meta-font-weight":"400","button-font":"Karla, sans-serif","button-font-weight":"700","currency-switcher-format":"money_with_currency_format","enable-sidebar":"none","slideshow-layout":"full-width","slideshow-transition":"transition-slide","slide-1-content-alignment":"center","slide-2-content-alignment":"center","slide-3-content-alignment":"center","slide-4-content-alignment":"center","slide-5-content-alignment":"center","home-video-width":"full-width","home-video-text-color":"light","home-feature-1-text-color":"light","home-feature-1-text-position":"center","home-feature-2-text-color":"light","home-feature-2-text-position":"left","home-feature-3-text-color":"light","home-feature-3-text-position":"left","home-feature-4-text-color":"dark","home-feature-4-text-position":"left","home-feature-5-text-color":"light","home-feature-5-text-position":"left","home-feature-6-text-color":"light","home-feature-6-text-position":"left","home-feature-7-text-color":"light","home-feature-7-text-position":"center","home-feature-8-text-color":"light","home-feature-8-text-position":"center","home-feature-9-text-color":"light","home-feature-9-text-position":"center","home-featured-collection-1-text-color":"light","home-featured-collection-2-text-color":"light","home-featured-collection-3-text-color":"light","home-featured-products-max":"4","home-featured-products-per-row":"4","home-embedded-content-alignment":"right","home-blog-posts-number":"3","collections-text-style":"under","collections-per-page":"6","collections-per-row":"3","collection-layout-style":"masonry","collection-product-text-style":"under","collection-products-per-row":"3","collection-products-per-page":"12","product-column-layout":"single-column","articles-per-page":"3","newsletter-platform":"mailchimp","use-logo":false,"use-retina-logo":false,"body-background-use-image":false,"store-title-font-small-caps":false,"heading-font-small-caps":false,"button-font-small-caps":true,"header-promo":false,"mega-nav-1":true,"mega-nav-1-use-image":true,"mega-nav-2":true,"mega-nav-2-use-image":true,"mega-nav-3":true,"mega-nav-3-use-image":true,"mega-nav-4":false,"mega-nav-4-use-image":false,"enable-currency-switcher":true,"slideshow-navigation":true,"slideshow-pagination":true,"slideshow-autoplay":false,"show-slide-1":true,"slide-1-text-shadow":false,"show-slide-2":true,"slide-2-text-shadow":false,"show-slide-3":true,"slide-3-text-shadow":false,"show-slide-4":false,"slide-4-text-shadow":false,"show-slide-5":false,"slide-5-text-shadow":false,"home-feature-row-1-text-shadow":true,"home-feature-1":true,"home-feature-2":false,"home-feature-3":false,"home-feature-row-2-text-shadow":false,"home-feature-4":true,"home-feature-5":false,"home-feature-6":false,"home-feature-row-3-text-shadow":false,"home-feature-7":true,"home-feature-8":true,"home-feature-9":true,"home-featured-collection-1-text-shadow":false,"home-featured-collection-2-text-shadow":false,"home-featured-collection-3-text-shadow":false,"home-embedded-content-image":true,"collections-show-descriptions":true,"collection-description":true,"collection-featured-image":false,"collection-sorting":true,"collection-filtering":false,"collection-stock-level-overlay":true,"product-enable-zoom":true,"enable-related-products":true,"enable-product-quantity":false,"blog-show-rss-icon":false,"blog-show-tags":false,"blog-show-author":false,"blog-show-comment-count":false,"blog-show-share-buttons":false,"cart-special-instructions":true,"cart-shipping-calculator":true,"footer-promo-1":false,"footer-promo-2":false,"footer-promo-3":false,"footer-titles":true,"footer-twitter-retweets":false,"footer-instagram-use-tag":true,"footer-show-payment-options":false,"share-widget-facebook":true,"share-widget-twitter":true,"share-widget-pinterest":true,"share-widget-fancy":true,"share-widget-google-plus":true,"share-widget-email":true,"disable-ajax":false,"mega-nav-1-list":"notebooks","mega-nav-1-url":"http://pacific-theme-bright.myshopify.com/collections/notebooks-1","mega-nav-2-list":"dayplanners","mega-nav-2-url":"http://pacific-theme-bright.myshopify.com/collections/day-planners-1","mega-nav-3-list":"desktop-supplies","mega-nav-3-url":"http://pacific-theme-bright.myshopify.com/collections/desktop-supplies-1","mega-nav-4-list":"","mega-nav-4-url":"","sidebar-link-list-1":"","sidebar-link-list-2":"","sidebar-link-list-3":"","home-featured-collection-1":"classic","home-featured-collection-2":"contemporary","home-featured-collection-3":"color-pop","home-featured-products":"contemporary","home-imported-content-page":"frontpage","home-blog-posts-blog":"","collections-link-list":"","collection-filter-link-list-1":"","collection-filter-link-list-2":"","collection-filter-link-list-3":"","footer-promo-1-url":"","footer-promo-2-url":"","footer-promo-3-url":"","footer-link-list-1":"navigate","footer-link-list-2":"support","social-facebook-url":"http://facebook.com/pixelunion","social-twitter-url":"http://twitter.com/pixelunion","social-google-url":"","social-pinterest-url":"http://www.pinterest.com/search/pins/?q=pug%20dogs\u0026term_meta%5B%5D=pug%7Ctyped\u0026term_meta%5B%5D=dogs%7Ctyped","social-instagram-url":"http://instagram.com/pixelunion","social-kickstarter-url":"","social-vimeo-url":"","social-youtube-url":"","social-email-address":"support@pixelunion.net","social-rss-url":"","contact-page-title":"","contact-page-success":""};
    };

    ThemeView.prototype.render = function() {
      var rte, _i, _len, _ref;
      new HeaderView({
        el: $(".main-header")
      });
      new NavigationView({
        el: $(".navigation")
      });
      new FooterView({
        el: $("footer")
      });
      _ref = $(".rte");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rte = _ref[_i];
        new RTEView({
          el: rte
        });
      }
      if (Pacific.settings["enable-currency-switcher"]) {
        new CurrencyView({
          el: this.$(".currency-switcher")
        });
      }
      if (Pacific.settings["enable-sidebar"]) {
        new SidebarView({
          el: this.$(".sidebar")
        });
      }
      if (this.isHome) {
        new HomeView({
          el: this.$el
        });
      }
      if (this.isCollection) {
        new CollectionView({
          el: this.$el
        });
      }
      if (this.isListCollections) {
        new ListCollectionsView({
          el: $(".collections-list")
        });
      }
      if (this.isProduct) {
        new ProductView({
          el: this.$el
        });
      }
      if (this.isCart) {
        new CartView({
          el: this.$el
        });
      }
      if (this.isAccount) {
        new AccountView({
          el: this.$el
        });
      }
      if ($("html").hasClass("lt-ie10")) {
        return this.inputPlaceholderFix();
      }
    };

    ThemeView.prototype.inputPlaceholderFix = function() {
      var input, placeholders, text, _i, _len;
      placeholders = $("[placeholder]");
      for (_i = 0, _len = placeholders.length; _i < _len; _i++) {
        input = placeholders[_i];
        input = $(input);
        if (!(input.val().length > 0)) {
          text = input.attr("placeholder");
          input.attr("value", text);
          input.data("original-text", text);
        }
      }
      placeholders.focus(function() {
        input = $(this);
        if (input.val() === input.data("original-text")) {
          return input.val("");
        }
      });
      return placeholders.blur(function() {
        input = $(this);
        if (input.val().length === 0) {
          return input.val(input.data("original-text"));
        }
      });
    };

    return ThemeView;

  })(Backbone.View);

  $(function() {
    window.theme = new ThemeView();
    return theme.render();
  });

}).call(this);
