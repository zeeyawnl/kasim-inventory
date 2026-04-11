const data = {
  name: "Test SOAP 2",
  sku: "TEST-SOAP-2",
  category: "soap",
  unit: "pcs",
  retailPrice: 50,
  wholesalePrice: 40,
  costPrice: 30,
  currentStock: 100,
  minStock: 10,
  salesChannel: "retail",
  description: "Test description"
};

fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.text().then(text => console.log(res.status, text)))
.catch(console.error);
