angular.module("cart", ['requestor', 'paypal'])
	.factory('cart', function (requestor, paypal) {
	
		var cart = {
			data: {
				order_total : 0
			}
		};

		function getBasket(basketLoaded) {
			requestor.makeRequest("GET", "/getBasket", function(data) {
				requestor.makeRequest("POST", "/setBasket", function(data) {
					basketLoaded();
				}, { "basket_id" : requestor.getBasketID()});
			});
		}

		function addProductToCart(data) {
			data.basket_id = requestor.getBasketID();
			requestor.makeRequest("POST", "/addItemToBasket", function(data) {
				cart.data = data;
				if (cart.data.order_total > 0) {
					paypal.renderPayPalBtn(data);
				}
				else {
					$("#paypal-button-container").remove();
				}
			}, data);
		}

		return {
			addProduct: function (product) {
				var data = {
					"pid" : product.id,
					"qty" : product.qty
				};

				if (!requestor.getBasketID()) {
					getBasket(function() {
						addProductToCart(data);
					});
				}
				else {
					addProductToCart(data);
				}
			},

			removeProduct: function (product) {
				requestor.makeRequest("DELETE", "/deleteItemFromBasket", function(data) {
					cart.data = data;
					if (cart.data.order_total > 0) {
						paypal.renderPayPalBtn(data);
					}
					else {
						$("#paypal-button-container").remove();
					}
				}, { "pid" : product.item_id, "basket_id" : requestor.getBasketID() });
			},

			getCart: function () {
				return cart.data;
			}
		};
	})
	.controller('cartCtrl', function($scope, cart) {
		$scope.$watch(function(){return cart.getCart()}, function(){
	      	$scope.cartData = cart.getCart();
	    });

	    $scope.deleteProductFromBasket = function (product) {
			cart.removeProduct(product);
		}
	})
	.directive("cartSummary", function () {
		return {
			restrict: "E",
			templateUrl: "components/cart/cartSummary.html",
			controller: "cartCtrl"
		};
	});