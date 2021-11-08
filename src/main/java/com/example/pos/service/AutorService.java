package com.example.pos.service;

import com.example.pos.model.Autor;
import com.example.pos.repository.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Service
public class AutorService {
    @Autowired
    AutorRepository autorRepository;

    public List<Autor> findAll(){
        return (List<Autor>) autorRepository.findAll();
    }

    public Autor save(Autor autor) {
        return autorRepository.save(autor);
    }

    public Autor findByID(Integer ID) {
        return autorRepository.findByID(ID);
    }

    public void deleteAutorByID(Integer ID) {
        autorRepository.deleteAutorByID(ID);
    }

    public Autor putAutor(Autor newAutor, Integer ID)
    {
        Autor autor=autorRepository.findByID(ID);
        if (autor == null)
        {
            return null;
        }
        autor.setPrenume(newAutor.getPrenume());
        autor.setNume(newAutor.getNume());
        return autorRepository.save(autor);
    }
}
