import app from './app';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Order system running at http://localhost:${PORT}`);
});
