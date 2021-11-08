package com.example.pos.controller;

import com.example.pos.exceptions.AutorNotFoundException;
import com.example.pos.model.Autor;
import com.example.pos.service.AutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@RestController
@Transactional
@RequestMapping(path="/api/bookcollecton/authors")
public class AutorController {

    @Autowired
    private AutorService autorService;

    AutorController( AutorService autorService){
        this.autorService=autorService;
    }

    @GetMapping()
    ResponseEntity<?> all(){
        return (autorService.findAll() !=null)? new ResponseEntity<>(autorService.findAll(), HttpStatus.OK):new ResponseEntity<>(new AutorNotFoundException(), HttpStatus.NO_CONTENT);
    }

    @PostMapping()
    ResponseEntity<?> newAutor(@RequestBody Autor newAutor){
        return new ResponseEntity<>(autorService.save(newAutor), HttpStatus.CREATED);
    }

    @GetMapping("/{ID}")
    ResponseEntity<?> one(@PathVariable Integer ID){
        return (autorService.findByID(ID) !=null)? new ResponseEntity<>(autorService.findByID(ID), HttpStatus.OK):new ResponseEntity<>(new AutorNotFoundException(ID),HttpStatus.NO_CONTENT) ;
    }

    @PutMapping("/{ID}")
    ResponseEntity<?> replaceAutor(@RequestBody Autor newAutor, @PathVariable Integer ID) {

        return (autorService.putAutor(newAutor,ID) !=null)? new ResponseEntity<>(autorService.putAutor(newAutor,ID), HttpStatus.OK):new ResponseEntity<>(new AutorNotFoundException(ID), HttpStatus.NO_CONTENT);

    }

    @DeleteMapping("/{ID}")
    void deleteAutor(@PathVariable Integer ID) {
        autorService.deleteAutorByID(ID);
    }
}
