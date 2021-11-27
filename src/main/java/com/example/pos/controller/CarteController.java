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

    @DeleteMapping("/bookcollection/books/{ISBN}")
    ResponseEntity<?> deletebooks(@PathVariable String ISBN)
    {
        carteService.delete(ISBN);
        return new ResponseEntity<>("Book deleted",HttpStatus.OK);

    }

    @GetMapping("/bookcollection/books")
    ResponseEntity <?> getBooksFiltred(@RequestParam(required = false) String genre, @RequestParam(required = false)
            Integer year, @RequestParam(required = false)
            Integer page, @RequestParam(required = false)
            Integer items_per_page)
    {
        if(items_per_page==null)
            items_per_page=20;
        List<Carte> books;
        if (genre!=null && year!=null)
        {
            books=carteService.findByAnAndGen(year,genre);
            if(books.size()==0)
            {
             return new ResponseEntity<>(books,HttpStatus.NO_CONTENT);
            }
            else {
                if (page!=null) {
                    return new ResponseEntity<>(books.subList(page*items_per_page,(page+1)*items_per_page), HttpStatus.OK);
                }
                else
                {
                    return new ResponseEntity<>(books, HttpStatus.OK);
                }
            }
        }
        else
        {
            if (genre!=null)
            {
                books=carteService.findByGen(genre);
                return getResponseEntity(page, items_per_page, books);
            }
            if(year!=null)
            {
                books = carteService.findbyAn(year);
                return getResponseEntity(page, items_per_page, books);
            }
        }
        books = carteService.all();
        return getResponseEntity(page, items_per_page, books);
    }

    private ResponseEntity<?> getResponseEntity(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer items_per_page, List<Carte> books) {
        if(books.size()==0)
        {
            return new ResponseEntity<>(books, HttpStatus.NO_CONTENT);
        }
        else
        {
            if (page!=null) {
                if(page*items_per_page>books.size())
                {
                    return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
                }
                if((page+1)*items_per_page>books.size())
                {
                    return new ResponseEntity<>(books.subList(page*items_per_page,books.size()), HttpStatus.OK);
                }
                return new ResponseEntity<>(books.subList(page*items_per_page,(page+1)*items_per_page), HttpStatus.OK);
            }
            else
            {
                return new ResponseEntity<>(books, HttpStatus.OK);
            }
        }
    }
}
