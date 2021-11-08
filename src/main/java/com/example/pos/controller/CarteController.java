package com.example.pos.controller;

import com.example.pos.exceptions.CarteNotFoundException;
import com.example.pos.model.Carte;
import com.example.pos.service.CarteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;


@RestController
@Transactional
@RequestMapping(path="/api/bookcollecton/books")
public class CarteController {
    @Autowired
    private CarteService carteService;

    CarteController( CarteService carteService){
        this.carteService=carteService;
    }

    @GetMapping()
    ResponseEntity<?> all(){
        return (carteService.findAll() !=null)? new ResponseEntity<>(carteService.findAll(), HttpStatus.OK):new ResponseEntity<>(new CarteNotFoundException(), HttpStatus.NO_CONTENT);
    }

    @PostMapping()
    ResponseEntity<?> newCarte(@RequestBody Carte newCarte){
        return new ResponseEntity<>(carteService.save(newCarte), HttpStatus.CREATED);
    }

    @GetMapping("/{ISBN}")
    ResponseEntity<?> one(@PathVariable String ISBN){
        return (carteService.findByISBN(ISBN) !=null)? new ResponseEntity<>(carteService.findByISBN(ISBN), HttpStatus.OK):new ResponseEntity<>(new CarteNotFoundException(ISBN),HttpStatus.NO_CONTENT) ;
    }

    @PutMapping("/{ISBN}")
    ResponseEntity<?> replaceCarte(@RequestBody Carte newCarte, @PathVariable String ISBN) {

        return (carteService.putCarte(newCarte,ISBN) !=null)? new ResponseEntity<>(carteService.putCarte(newCarte,ISBN), HttpStatus.OK):new ResponseEntity<>(new CarteNotFoundException(ISBN), HttpStatus.NO_CONTENT);

    }

    @DeleteMapping("/{ISBN}")
    void deleteCarte(@PathVariable String ISBN) {
        carteService.deleteCarteByISBN(ISBN);
    }


}
