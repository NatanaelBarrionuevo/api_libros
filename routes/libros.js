const Express = require("express");
const Joi = require("joi");
const Libros = require("../dominio/data");
const RouterLibros = Express.Router();


const LibrosEsquema = Joi.object({
  titulo: Joi.string().required().label("Título"),
  autor: Joi.string().required().label("Autor"),
});

RouterLibros.get("/", (req, res, next) => {
  try {
    res.status(200).json(Libros);
  } catch (err) {
    next(err);
  }
});

RouterLibros.get("/:id", (req, res, next) => {
  try {
    let id = parseInt(req.params.id);
    let libro = {};
    if (id > 0) {
      libro = Libros.find((x) => x.id === id);
    }else {
        let error = new Error("El id debe ser un numero mayor o igual que 1...");
        error.status = 400;
        throw error;
      }
    if (!libro) {
      let error = new Error(`No exixte ningun libro asociado al id nro ${id}`);
      error.status = 404;
      throw error;     
    } 
    res.status(200).json(libro);
  } catch (err) {
    next(err);
  }
  
    
});

RouterLibros.post("/", (req, res, next) => {
  try {
    const { error, value } = LibrosEsquema.validate(req.body);
    if (error) {
      const ValidacionError = new Error("Error de validación");
      ValidacionError.status = 400;
      ValidacionError.details = error.details.map((detail) => detail.message);
      throw ValidacionError;
    }
    const { titulo, autor } = req.body;
    let libro = {
      id: Libros.length + 1,
      titulo: titulo,
      autor: autor,
    };

    Libros.push(libro);
    res.status(201).json(libro);
  } catch (err) {
    next(err);
  }
});

RouterLibros.put("/:id", (req, res, next) => {
  try {
    let id = parseInt(req.params.id);
    if (id <= 0) {
      let error = new Error(
        "El id ingresado como parametro debe ser un numero mayor o igual a 1..."
      );
      error.status = 400;
      throw error;
    }
    let libro = Libros.find((x) => x.id === id);
    if (!libro) {
      let error = new Error(`No existe ningun libro asociado al id nro ${id}`);
      error.status = 404;
      throw error;
    }

    const { titulo, autor } = req.body;
    let tituloValido = /^[a-zA-Z\s]+$/.test(titulo.value);
    let autorValido = /^[a-zA-Z\s]+$/.test(autor.value);

    if (tituloValido && autorValido) {
      let libroActualizado = {
        id: id,
        titulo: titulo || libro.titulo,
        autor: autor || libro.autor,
      };

      res
        .status(200)
        .json(
          libroActualizado
        );
    } else if (!tituloValido) {
      let error = new Error(
        "El titulo solo acepta letras y espacion, no puede estar vacio..."
      );
      error.status = 400;
      throw error;
    } else {
      let error = new Error(
        "El autor solo acepta letras y espacion, no puede estar vacio..."
      );
      error.status = 400;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

RouterLibros.delete("/:id", (req, res, next) => {
  try {
    let id = parseInt(req.params.id);
    let indice = Libros.findIndex((i) => i.id === id);
    if (indice === -1) {
      let error = new Error(`No exixste ningun libro asociado al id nro ${id}`);
      error.status = 404;
      throw error;
    }
    let libroEliminado = Libros.splice(indice, 1);
    res.json(libroEliminado[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = RouterLibros;
