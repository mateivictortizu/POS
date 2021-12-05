package com.example.pos.repository;

import com.example.pos.model.Carte;
import com.example.pos.model.CarteAutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CarteAutorRepository extends CrudRepository<CarteAutor,Integer> {

    @Query(value = "SELECT MAX(c.index_autor) FROM carte_autor c where c.carte_isbn=?1 ", nativeQuery = true)
    Integer getMaxIndex(Carte carte);

}
