package com.example.pos.service;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.repository.CarteAutorRepository;
import com.example.pos.repository.CarteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarteService {

    private final CarteRepository carteRepository;


    public CarteService(CarteRepository carteRepository) {
        this.carteRepository = carteRepository;
    }

    public Carte one (String ISBN){
        return carteRepository.findByISBN(ISBN);
    }

    public List<Carte> all () {
        return (List<Carte>) carteRepository.findAll();
    }

    public Carte replace (Carte newCarte, String ISBN)
    {
        Carte carte = carteRepository.findByISBN(ISBN);
        if(carte == null)
        {
            newCarte.setISBN(ISBN);
            return carteRepository.save(newCarte);
        }
        carte.setTitlu(newCarte.getTitlu());
        carte.setEditura(newCarte.getEditura());
        carte.setAn_publicare(newCarte.getAn_publicare());
        carte.setGen_literar(newCarte.getGen_literar());
        return carteRepository.save(carte);
    }

    public Carte add (Carte newCarte)
    {
        return carteRepository.save(newCarte);
    }

    @Transactional
    public void delete (String ISBN)
    {
        Carte carte = carteRepository.findByISBN(ISBN);
        if(carte != null) {
            carteRepository.deleteCarteByISBN(ISBN);
        }
    }
}
