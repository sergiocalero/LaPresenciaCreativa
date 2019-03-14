var Loader = {};

$(document).ready(function() {
	
		Loader = {
			/**
			 *	Carga el contenido en a sobre el tag con el id pasado por parámetro.
			 * Intenta cargar el html de la url indicada.
			 * Si falla, cargamos la que hay en el directorio anterior.
			 * @param: a: url con el html a mostrar
			 * @param: id: identificador del tag en el que se cargará el html.
			 * @param callback: Manejador de la función que se ejecutará una vez haya terminado de cargar el contenido.
			*/			
			load: function (a, id, callback) {
				var html = null;
				$(id).html("&nbsp;");
				$(id).addClass("spinner");
				$(id).show();
				var r = Math.floor(Math.random() * 10000000000);
				$.get(a + "?r="+r,function(b){
					$(id).html(b);
				}).fail(function() {
					$.get("../" + a,function(b){
						$(id).html(b)
					})
				}).always(
					function() {
						$(id).removeClass("spinner");
						if (callback) callback();
					}
				);
			}
		};
		
		function loadCatalogo(){
			//Cuando se ejecute la carga del catálogo y se haya parseado, se ejecutará el lightBox.
			//Pasamos como callback el módulo que ejecuta el LightBox.
			App_Catalogo.start(Image_Funcs.start);
		}
		
		Loader.load("main_catalogo.html", "#panel_catalogo", loadCatalogo);
		//Loader.load("../content_pedido.html", "#content_dinamic");
		Loader.load("../footer.html", "#panel_footer");
});