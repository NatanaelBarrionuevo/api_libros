require("dotenv").config();
const mongoose = require("mongoose"); // Asegúrate de importar mongoose
const {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} = require("../../src/controllers/libroController");

const LibroModel = require("../../src/models/libroModel");
jest.mock("../../src/models/libroModel");

describe("libroController", () => {
  let mockRes;
  let mockReq;
  let mockLibro;
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Cierra la conexión después de todas las pruebas
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("getAllLibros deberia debolver todos los libros de la coleccion", async () => {
    mockLibro = [
      {
        titulo: "Rayuela",
        autor: "Julio Cortazar",
      },
      {
        titulo: "El Retrato de Dorian Gray",
        autor: "Oscar Wilde",
      },
    ];
    LibroModel.find.mockResolvedValue(mockLibro);
    mockReq = {};
    await getAllLibros(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibro);
  });

  test("getLibroById deberia devolver el libro correspondiente al id", async () => {
    mockLibro = {
      id: "1",
      titulo: "Libro Encontrado",
      autor: "Juan Perez",
    };
    LibroModel.find.mockResolvedValue(mockLibro);

    const mockReq = { params: { id: "1" } };
    await getLibroById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibro);
  });

  test("createLibro deberia crear un nuevo libro", async () => {
    mockLibro = {
      titulo: "Nuevo Libro",
      autor: "Barrionuevo Natanael",
    };

    LibroModel.create.mockResolvedValue(mockLibro);
    mockReq = { body: mockLibro };
    await createLibro(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        autor: mockLibro.autor,
        titulo: mockLibro.titulo,
      })
    );
    expect(LibroModel.create).toHaveBeenCalledWith(
      expect.objectContaining(mockLibro)
    );
  });

  test("updateLibro deberia actualizar el libro asociado al id", async () => {
    mockLibro = {
      titulo: "Libro Actualizado",
      autor: "Autor Actualizado",
    };

    LibroModel.findOneAndUpdate.mockResolvedValue(mockLibro);
    const mockReq = { params: { id: 1 }, body: mockLibro };
    await updateLibro(mockReq, mockRes, jest.fn()); // Proporciona una función jest.fn() como next
    expect(LibroModel.findOneAndUpdate).toHaveBeenCalledWith(
      { codigo: mockReq.params.id },
      { titulo: mockLibro.titulo, autor: mockLibro.autor },
      { new: true }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        autor: mockLibro.autor,
        titulo: mockLibro.titulo,
      })
    );
  });

  test("deleteLibro debería eliminar un libro existente", async () => {
    mockLibro = {
      titulo: "Libro Eliminado",
      autor: "Autor Eliminado",
    };
    LibroModel.findOneAndUpdate.mockResolvedValue(mockLibro);
    const mockReq = { params: { id: 1 } };
    await deleteLibro(mockReq, mockRes, jest.fn()); // Proporciona una función jest.fn() como next
    expect(LibroModel.findOneAndUpdate).toHaveBeenCalledWith(
      { codigo: mockReq.params.id },
      { activo: false },
      { new: true }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        autor: mockLibro.autor,
        titulo: mockLibro.titulo,
      })
    );
  });
});
