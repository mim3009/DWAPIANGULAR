angular.module('paypal', ['requestor'])
	.factory('paypal', function (requestor) {
		return {
			renderPayPalBtn : function(basketData) {
				$("#paypal-button-container").remove();
				$(document.body).append("<div id='paypal-button-container'></div>");
				paypal.Button.render({
			        env: 'sandbox',
			        client: {
			            sandbox:    'ASEShkolv8BsV0ONvzkvd1krpnf_83RFgxsdeCcF-uZYGvipVqPEd6sYZBqXzoD5Y2qbekaCY14i-jAL',
			            production: 'XXX'
			        },
			        commit: true,

			        payment: function() {
			            var env = this.props.env;
			            var client = this.props.client;

			            return paypal.rest.payment.create(env, client, {
			                transactions: [
			                    {
			                        amount: {
			                            total: basketData.order_total,
			                            currency: basketData.currency
			                        },
			                        item_list: {
			                            shipping_address: {
			                                recipient_name: basketData.shipments[0].shipping_address.full_name,
			                                line1: basketData.shipments[0].shipping_address.address1,
			                                line2: basketData.shipments[0].shipping_address.address2,
			                                city: basketData.shipments[0].shipping_address.city,
			                                country_code: basketData.shipments[0].shipping_address.country_code,
			                                postal_code: basketData.shipments[0].shipping_address.postal_code,
			                                phone:  basketData.shipments[0].shipping_address.phone,
			                                state:  basketData.shipments[0].shipping_address.state_code
			                            }
			                        }
			                    }
			                ]
			            });
			        },

			        onAuthorize: function(data, actions) {
			    		return actions.payment.execute().then(function() {
			        		requestor.makeRequest("POST", "/placeOrder", function(data) {
			        			$("#paypal-button-container").remove();
								alert("Thank you for purchase! Please come back, we always waiting for you!");
							}, { "amount" : basketData.order_total, "basket_id" : requestor.getBasketID() });
			            });
			        },
				}, '#paypal-button-container');
			}
		};
	});