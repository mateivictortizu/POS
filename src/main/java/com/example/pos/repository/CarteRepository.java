package com.example.pos.repository;

import com.example.pos.model.Carte;
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

}
