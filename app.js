const Express = require('express');
const RouterLibros = require('./routes/libros');
const ErrorHandler = require('./middlework/errorHandler');
const App = Express();

const port = 3000;

App.use(Express.json());
App.use('/libros', RouterLibros);
App.use(ErrorHandler);


App.listen(port, ()=>{
    console.log(`El servidor esta corriendo en http://127.0.0.1:${port}`);
});