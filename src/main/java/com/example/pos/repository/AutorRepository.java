package com.example.pos.repository;

import com.example.pos.model.Autor;
import org.springframework.data.repository.CrudRepository;

public interface AutorRepository extends CrudRepository<Autor,Integer> {
    Autor findByID(Integer ID);
    void deleteAutorByID(Integer ID);
}
