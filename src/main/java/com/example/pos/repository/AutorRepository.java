package com.example.pos.repository;

import com.example.pos.model.Autor;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface AutorRepository extends CrudRepository<Autor,Integer> {
    Autor findByID(Integer ID);
    void deleteAutorByID(Integer ID);

    List<Autor> findAutorByNume(String nume);
    List<Autor> findAutorByNumeContains(String nume);

}
