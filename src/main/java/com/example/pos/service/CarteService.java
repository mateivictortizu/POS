package com.example.pos.service;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.repository.CarteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;

@Transactional
@Service
public class CarteService {
    @Autowired
    CarteRepository carteRepository;

    public List<Carte> findAll(){
        return (List<Carte>) carteRepository.findAll();
    }

    public Carte save(Carte carte) {
        return carteRepository.save(carte);
    }

    public Carte findByISBN(String ISBN) {
        return carteRepository.findByISBN(ISBN);
    }

    public void deleteCarteByISBN(String ISBN) {
        carteRepository.deleteCarteByISBN(ISBN);
    }

    public Set<Autor> getAutori(String ISBN)
    {
        Carte carte=findByISBN(ISBN);
        if (carte==null)
        {
            return null;
        }
        else
        {
            return carte.getAutori();
        }

    }

    public Carte putCarte(Carte newCarte, String ISBN)
    {
        Carte carte=carteRepository.findByISBN(ISBN);
        if (carte == null)
        {
            return null;
        }
        carte.setISBN(newCarte.getISBN());
        carte.setTitlu(newCarte.getTitlu());
        carte.setEditura(newCarte.getEditura());
        carte.setAn_publicare(newCarte.getAn_publicare());
        carte.setGen_literar(newCarte.getGen_literar());
        return carteRepository.save(carte);
    }
}
