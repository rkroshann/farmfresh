const { v4: uuidv4 } = require('uuid');

const store = {
    users: [],
    products: [],
    orders: [],
    chats: [],
    reviews: []
};

module.exports = store;
