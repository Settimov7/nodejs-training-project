const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
	products: [
		{
			product: {
				type: Object,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			}
		}
	],
	user: {
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		}
	}
});

module.exports = model('Order', orderSchema);