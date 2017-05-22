angular.module("cart", [])
.factory('cart', function ($http) {
	
	var cart = {
		data: {
			product_total : 0
		}
	};

	return {
		addProduct: function (product) {
			$http({
				method : "POST",
				url : "/addItemToBasket",
				data : {
					"pid" : product.id,
					"qty" : product.qty
				}
			}).then(function (response) {
				console.log(response.data);
				cart.data = response.data;
				console.log(cart.data);
			}, function (error) {
				console.log(error);
			});
		},

		removeProduct: function (id) {
			
		},

		getCart: function () {
			return cart.data;
		}
	};
})
.directive("cartSummary", function (cart) {
	return {
		restrict: "E",
		templateUrl: "components/cart/cartSummary.html",
		controller: function ($scope) {
			$scope.$watch(function(){return cart.getCart()}, function(){
		      	$scope.cartData = cart.getCart();
		    });
		}
	};
});