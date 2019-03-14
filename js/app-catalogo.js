//$(function() {
var App_Catalogo = (function(){

    var data = {
        lastID: 0,
		products: [],
        load: function(callback) {
			
			var r = Math.floor(Math.random() * 10000000000);
        	jQuery.get('catalogo.json?r='+r).then(function (catalogo) {
				
        		jQuery.each(catalogo, function (index, product) {
					var thisID = ++data.lastID;
					data.products.push({
						id			: thisID,
						title		: product.title,
						price		: product.price,
						url			: product.url,
						urlThumb	: product.urlThumb,
						subcategory	: product.subcategory,
						category	: product.category
					});        			
        		});
				
				if (callback) {callback();}
        	});
        }
    };


    var octopus = {
        getProducts: function(cat) {
            var visibleProducts = data.products.filter(function(product) {
                return product.category == (cat);
            });
            return visibleProducts;
        },
		afterRenderCallback: null,
        init: function(_afterRenderCallback) {
			this.afterRenderCallback = _afterRenderCallback;
			//Cuando estén los datos cargados, se ejecutará la vista.
			data.load(view.init);
        }
    }


    var view = {
        init: function() {
            // grab elements and html for using in the render function
            view.$productList = $('#products_list');
            view.productTemplate = $('script[data-template="product"]').html();
            view.render();
        },

        render: function() {
            // Cache vars for use in forEach() callback (performance)
            var $productList = view.$productList,
                productTemplate = view.productTemplate;				
            // Clear and render
            $productList.html('');			
			
			// Mostramos los productos categorizados como 'Alpargatas'
			var producs = octopus.getProducts('Alpargatas');
            jQuery.each(producs, function(index, product) {
                // Replace template markers with data
                var thisTemplate = productTemplate.replace(/{{id}}/g, product.id);
				thisTemplate = thisTemplate.replace(/{{title}}/g, product.title);
				thisTemplate = thisTemplate.replace(/{{urlImg}}/g, product.url);
				thisTemplate = thisTemplate.replace(/{{urlThumb}}/g, product.urlThumb);
				thisTemplate = thisTemplate.replace(/{{subcategory}}/g, product.subcategory);
				thisTemplate = thisTemplate.replace(/{{price}}/g, product.price);
                $productList.append(thisTemplate);
            });
			if (octopus.afterRenderCallback) octopus.afterRenderCallback();
        }
    };

	//octopus.init();
	/* Public Methods */
	return {
		start: function(_afterRenderCallback){
			octopus.init(_afterRenderCallback);
		}
	}
	
}());