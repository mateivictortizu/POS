package com.example.abservice.repository;

import com.example.abservice.model.Autor;
import org.springframework.data.repository.CrudRepository;
import java.util.List;


public interface AutorRepository extends CrudRepository<Autor,Integer> {
    Autor findByID(Integer ID);
    void deleteAutorByID(Integer ID);

    List<Autor> findAutorByNume(String nume);
    List<Autor> findAutorByNumeContains(String nume);

    Autor findAutorByNumeAndPrenumeAndID(String nume, String prenume, Integer id);

}
