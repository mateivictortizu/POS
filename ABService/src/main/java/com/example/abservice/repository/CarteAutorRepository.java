package com.example.abservice.repository;

import com.example.abservice.model.Autor;
import com.example.abservice.model.Carte;
import com.example.abservice.model.CarteAutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CarteAutorRepository extends CrudRepository<CarteAutor,Integer> {

    @Query(value = "SELECT MAX(c.index_autor) FROM carte_autor c where c.carte_isbn=?1 ", nativeQuery = true)
    Integer getMaxIndex(Carte carte);

    List<CarteAutor> getCarteAutorByCarte(Carte c);
}


