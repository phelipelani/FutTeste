import app from './src/app.js'; // Certifique-se de que o caminho e a extensão estão corretos

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});