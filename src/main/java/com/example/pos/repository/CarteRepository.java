package com.example.pos.repository;

import com.example.pos.model.Carte;
import com.example.pos.model.CarteProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarteRepository extends CrudRepository<Carte,Integer> {

    Carte findByISBN(String ISBN);
    void deleteCarteByISBN(String ISBN);

    List<Carte> findByanpublicare(Integer an_publicare);
    List<Carte> findBygenliterar(String gen_literar);
    List<Carte> findCarteByAnpublicareAndGenliterar(Integer an_publicare, String gen_literar );

    @Query(value="select isbn, titlu, genliterar from Carte c where c.isbn =:isbn", nativeQuery=true)
    CarteProjection getbyisbn(@Param("isbn") String isbn);

}
