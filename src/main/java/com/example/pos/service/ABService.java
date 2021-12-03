package com.example.pos.service;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.model.CarteProjection;
import com.example.pos.repository.AutorRepository;
import com.example.pos.repository.CarteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ABService {
    private final AutorRepository autorRepository;
    private final CarteRepository carteRepository;

    public ABService(AutorRepository autorRepository, CarteRepository carteRepository) {
        this.autorRepository = autorRepository;
        this.carteRepository = carteRepository;
    }

    public List<Autor> findbyName(String name)
    {
        return autorRepository.findAutorByNumeContains(name);
    }

    public List<Autor> findbyNameMatch(String name)
    {
        return autorRepository.findAutorByNume(name);
    }

    public Autor add (Autor newAutor)
    {
        return autorRepository.save(newAutor);
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
        carte.setAnpublicare(newCarte.getAnpublicare());
        carte.setGenliterar(newCarte.getGenliterar());
        return carteRepository.save(carte);
    }

    public Carte add (Carte newCarte)
    {
        return carteRepository.save(newCarte);
    }

    public List<Carte> findbyAn(Integer an){return carteRepository.findByanpublicare(an);}

    public List<Carte> findByGen(String gen){return carteRepository.findBygenliterar(gen);}

    public List<Carte> findByAnAndGen(Integer an, String gen){return carteRepository.findCarteByAnpublicareAndGenliterar(an,gen);}

    @Transactional
    public void delete (String ISBN)
    {
        Carte carte = carteRepository.findByISBN(ISBN);
        if(carte != null) {
            carteRepository.deleteCarteByISBN(ISBN);
        }
    }

    public CarteProjection getbyisbn (String isbn){
        return carteRepository.getbyisbn(isbn);
    }
}
