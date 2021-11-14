package com.example.pos.controller;

import com.example.pos.model.Carte;
import com.example.pos.service.CarteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CarteController {

    @Autowired
    CarteService carteService;

    @GetMapping("/bookcollection/books/{ISBN}")
    ResponseEntity<?> getbook(@PathVariable String ISBN)
    {
        Carte carte = carteService.one(ISBN);
        if(carte!=null){
            return new ResponseEntity<>(carte, HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/bookcollection/books")
    ResponseEntity<?> addbook(@RequestBody Carte carte){
        return new ResponseEntity<>(carteService.add(carte),HttpStatus.CREATED);
    }

    @GetMapping("/bookcollection/books")
    ResponseEntity<?> getbooks()
    {
        List<Carte> books = carteService.all();
        if(books.size()==0)
        {
            return new ResponseEntity<>(books,HttpStatus.NO_CONTENT);
        }
        else
        {
            return new ResponseEntity<>(books,HttpStatus.OK);
        }
    }


    @DeleteMapping("/bookcollection/books/{ISBN}")
    ResponseEntity<?> deletebooks(@PathVariable String ISBN)
    {
        carteService.delete(ISBN);
        return new ResponseEntity<>("Book deleted",HttpStatus.OK);

    }
}
