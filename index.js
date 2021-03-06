const express = require('express');
const rescue = require('express-rescue');
const bodyParser = require('body-parser');

const { products, sales } = require('./controllers/index');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/products', rescue(products.createProduct));
app.get('/products/:id', rescue(products.getProductByID));
app.get('/products', rescue(products.getAllProducts));
app.put('/products/:id', rescue(products.updateProduct));
app.delete('/products/:id', rescue(products.deleteProduct));

app.post('/sales', rescue(sales.createSale));
app.get('/sales/:id', rescue(sales.getSaleByID));
app.get('/sales', rescue(sales.getAllSales));
app.put('/sales/:id', rescue(sales.updateSale));
app.delete('/sales/:id', rescue(sales.deleteSale));

app.use(errorMiddleware);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(PORT, () => console.log('Here we go!!'));
