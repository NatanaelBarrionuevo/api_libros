const Libro = require("../models/libroModel");

exports.getAllLibros = async (req, res, next) => {
  try {
    let libros = await Libro.find({activo: true});
    if (libros.length < 1) {
      let error = new Error("Error al obtener los libros");
      error.status = 500;
      throw error;
    }
    res.status(200).json(libros);
  } catch (err) {
    next(err);
  }
};

exports.getLibroById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    validarId(id);
    let libro = await Libro.find({ codigo: id });
    validarLibro(libro, id);
    res.status(200).json(libro);
  } catch (err) {
    next(err);
  }
};

exports.createLibro = async (req, res, next) => {
  try {
    const { titulo, autor } = req.body;
    validarDatos(titulo, autor);
    let contador = await Libro.find();
    let codigo = contador.length + 1;
    let activo = true;
    let libro = await Libro.create({
        titulo: titulo,
        autor: autor,
        codigo: codigo,
        activo: activo
      });
    
    res.status(201).json(libro);
  } catch (err) {
    next(err);
  }
};

exports.updateLibro = async (req, res, next) => {
  try {
    const { titulo, autor } = req.body;
    const id = parseInt(req.params.id);
    validarDatos(titulo, autor);
    validarId(id);
    let libro = await Libro.findOneAndUpdate(
      { codigo: id },
      { titulo, autor },
      { new: true }
    );
    validarLibro(libro, id);
    res.status(200).json(libro);
  } catch (err) {
    next(err);
  }
};

exports.deleteLibro = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);    
    validarId(id);
    let libro = await Libro.findOneAndUpdate(
      { codigo: id },
      { activo: false },
      { new: true }
    );
    validarLibro(libro, id);
    res.status(200).json(libro);
  } catch (err) {
    next(err);
  }
};

let validarId = (id) => {
  if (id < 1) {
    let error = new Error("El id en ningun caso debe menor a 1");
    error.status = 400;
    throw error;
  }
};

let validarDatos = (titulo, autor) => {
  if (!titulo || !/^[a-zA-Z\sñÑ]+$/.test(titulo)) {
    let error = new Error(
      "El campo requerido TITULO debe estar conformado por letras."
    );
    error.status = 400;
    throw error;
  }
  if (!autor || !/^[a-zA-Z\sñÑ]+$/.test(autor)) {
    let error = new Error(
      "El campo requerido AUTOR debe estar conformado por letras."
    );
    error.status = 400;
    throw error;
  }
};

let validarLibro = (libro, id) =>{
    if (!libro) {
        let error = new Error(`No existe ningun libro asociado al id nro ${id}`);
        error.status = 404;
        throw error;
      }
};
