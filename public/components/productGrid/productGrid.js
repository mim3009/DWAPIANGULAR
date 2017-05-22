angular.module('productGrid', [])
	.directive("productGrid", function () {
		return {
			restrict : "E",
			templateUrl : "components/productGrid/productGridTemplate.html",
			scope : {
				products : "=products"
			},
			controller : function ($scope, cart) {
				$scope.addProductToCart = function (product) {
					cart.addProduct(product);
				}
			}
		}
	});