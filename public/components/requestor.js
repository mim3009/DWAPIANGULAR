angular.module('requestor', []).
	factory('requestor', function($http){
		var ifmatch = "";
		var token = "";
		var basket_id = null;

		return {
			getBasketID : function() {
				return basket_id;
			},

			makeRequest : function(method, url, callback, data = {}) {
				if (token) {
					data.token = token;
				}
				
				if (ifmatch) {
					data.ifmatch = ifmatch;
				}

				$http({
					method : method,
					url : url,
					params : data
				}).then(function (response) {
					if (response.data.headers && response.data.headers.etag) {
						ifmatch = response.data.headers.etag;
					}
					if (!token && response.data.headers && response.data.headers.authorization) {
						token = response.data.headers.authorization;
					}
					var bodyRes = null;
					if (response.data.body) {
						bodyRes = JSON.parse(response.data.body);
						if (!basket_id && bodyRes.basket_id) {
							basket_id = bodyRes.basket_id;
						}
					}
					else {
						bodyRes = response.data;
					}
					callback(bodyRes);
				}, function (error) {
					console.log(error);
				});
			}
		};
	});