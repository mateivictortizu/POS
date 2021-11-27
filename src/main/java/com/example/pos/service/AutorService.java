package com.example.pos.service;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.repository.AutorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AutorService {
    private final AutorRepository autorRepository;

    public AutorService(AutorRepository autorRepository) {
        this.autorRepository = autorRepository;
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
}
