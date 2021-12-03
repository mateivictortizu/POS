package com.example.pos.controller;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.model.CarteProjection;
import com.example.pos.service.ABService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api")
public class ABController {

    @Autowired
    ABService abService;

    @GetMapping("/authors")
    ResponseEntity<?> getautor(@RequestParam String name, @RequestParam Boolean match)
    {
        if(match) {
            List<Autor> a = abService.findbyName(name);
            for (Autor autor: a)
            {
                Link selflink = linkTo(methodOn(ABController.class).getautor(name,match)).withSelfRel();
                autor.add(selflink);
            }
            return new ResponseEntity<>(a, HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(abService.findbyNameMatch(name),HttpStatus.OK);
        }
    }

    @PostMapping("/authors")
    ResponseEntity<?> addAutor(@RequestBody Autor autor)
    {
        return new ResponseEntity<>(abService.add(autor),HttpStatus.CREATED);
    }

    @GetMapping("/bookcollection/books/{ISBN}")
    ResponseEntity<?> getbook(@PathVariable String ISBN, @RequestParam (required = false) String verbose) {
        if (verbose == null) {
            Carte carte = abService.one(ISBN);
            if (carte != null) {
                return new ResponseEntity<>(carte, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            CarteProjection carte=abService.getbyisbn(ISBN);
            if (carte != null) {
                return new ResponseEntity<>(carte, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }
    }

    @PostMapping("/bookcollection/books")
    ResponseEntity<?> addbook(@RequestBody Carte carte){
        return new ResponseEntity<>(abService.add(carte),HttpStatus.CREATED);
    }

    @DeleteMapping("/bookcollection/books/{ISBN}")
    ResponseEntity<?> deletebooks(@PathVariable String ISBN)
    {
        abService.delete(ISBN);
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
            books=abService.findByAnAndGen(year,genre);
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
                books=abService.findByGen(genre);
                return getResponseEntity(page, items_per_page, books);
            }
            if(year!=null)
            {
                books = abService.findbyAn(year);
                return getResponseEntity(page, items_per_page, books);
            }
        }
        books = abService.all();
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

    @RequestMapping (value="/bookcollection", method = RequestMethod.OPTIONS)
    ResponseEntity<?> getAll()
    {
        return ResponseEntity.ok().allow(HttpMethod.OPTIONS).build();
    }

    @RequestMapping (value = "/bookcollection/books", method = RequestMethod.OPTIONS)
    ResponseEntity<?> getRelativeToBook()
    {
        return ResponseEntity.ok().allow(HttpMethod.OPTIONS, HttpMethod.GET, HttpMethod.POST).build();
    }

    @RequestMapping (value = "/bookcollection/authors", method = RequestMethod.OPTIONS)
    ResponseEntity <?> getRelativeToAuthors(){
        return ResponseEntity.ok().allow(HttpMethod.OPTIONS, HttpMethod.POST, HttpMethod.GET).build();
    }

    @PostMapping (value="/bookcollection/books/{ISBN}/inventorytransactions")
    ResponseEntity <?> blockStock()
    {
        return null;
    }
}
