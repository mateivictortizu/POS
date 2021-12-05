package com.example.pos.service;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.model.CarteAutor;
import com.example.pos.repository.AutorRepository;
import com.example.pos.repository.CarteAutorRepository;
import com.example.pos.repository.CarteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ABService {
    private final AutorRepository autorRepository;
    private final CarteRepository carteRepository;
    private final CarteAutorRepository carteAutorRepository;

    public ABService(AutorRepository autorRepository, CarteRepository carteRepository, CarteAutorRepository carteAutorRepository) {
        this.autorRepository = autorRepository;
        this.carteRepository = carteRepository;
        this.carteAutorRepository = carteAutorRepository;
    }

    public Carte getBookByISBN(String ISBN) {return carteRepository.findByISBN(ISBN);}

    public List<Carte> getAllBooks() { return (List<Carte>) carteRepository.findAll(); }

    public List<Carte> getBookByYear(Integer an){return carteRepository.findByanpublicare(an);}

    public List<Carte> getBookByGenre(String gen){return carteRepository.findBygenliterar(gen);}

    public List<Carte> getBookByYearAndGenre(Integer an, String gen){return carteRepository.findCarteByAnpublicareAndGenliterar(an,gen);}

    public List<Autor> getAuthorByName(String name) { return autorRepository.findAutorByNumeContains(name); }

    public List<Autor> getAuthorByNameMatch(String name) { return autorRepository.findAutorByNume(name); }

    public Autor addAuthor(Autor newAutor) { return autorRepository.save(newAutor); }

    public Carte addBook(Carte newCarte)
    {
        return carteRepository.save(newCarte);
    }

    public CarteAutor addRelationBookAuthor(CarteAutor carteAutor) { return carteAutorRepository.save(carteAutor);}

    public Integer getIndexAutor (Carte carte) { return carteAutorRepository.getMaxIndex(carte);};

    public Autor checkAutor (Autor autor) { return autorRepository.findAutorByNumeAndPrenumeAndID(autor.getNume(),autor.getPrenume(),autor.getID());}

    @Transactional
    public void deleteBook(String ISBN)
    {
        Carte carte = carteRepository.findByISBN(ISBN);
        if(carte != null) {
            carteRepository.deleteCarteByISBN(ISBN);
        }
    }

    @Transactional
    public void deleteAuthor(Integer ID)
    {
        Autor a = autorRepository.findByID(ID);
        if(a != null) {
            autorRepository.deleteAutorByID(ID);
        }
    }
}
