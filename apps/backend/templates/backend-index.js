const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

{{REQUIRES}}

{{ROUTES}}

app.get('/', (req, res) => {
  res.json({ message: 'Generated backend API' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
