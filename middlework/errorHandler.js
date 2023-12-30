const ErrorHandler = (err, req, res, next) => {
    //Imprime en consola el error para control
  console.error(err);
  //Respueste HTTP
  res
    .status(err.status || 500)
    .json({ error: err.message || "Error en el servidor" });
};

module.exports = ErrorHandler;
