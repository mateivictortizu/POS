package com.example.pos.repository;

import com.example.pos.model.Carte;
import org.springframework.data.repository.CrudRepository;

public interface CarteRepository extends CrudRepository<Carte,Integer> {

    Carte findByISBN(String ISBN);
    void deleteCarteByISBN(String ISBN);
}
