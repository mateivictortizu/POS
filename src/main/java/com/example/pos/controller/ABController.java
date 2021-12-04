package com.example.pos.controller;

import com.example.pos.model.Autor;
import com.example.pos.model.Carte;
import com.example.pos.model.CarteProjection;
import com.example.pos.service.ABService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/bookcollection")
public class ABController {

    @Autowired
    ABService abService;

    @GetMapping("/books/{ISBN}")
    ResponseEntity<?> getbookByISBN(@PathVariable String ISBN, @RequestParam(required = false) Boolean verbose) {
        List<Link> links=new ArrayList<Link>();
        if (verbose) {
            Carte x = abService.getByIsbn(ISBN);
            links.add(linkTo(methodOn(ABController.class).getbookByISBN(ISBN, true)).withSelfRel());
            links.add(linkTo(methodOn(ABController.class).getbookByISBN(ISBN, false)).withRel("less_info"));

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("genre", null);
            parameters.put("year", null);
            parameters.put("page", null);
            parameters.put("items_per_page", null);
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("all_books").expand(parameters));
            return new ResponseEntity<>(EntityModel.of(x,links), HttpStatus.OK);
        } else {
            // TODO:Should return partial info about books
            CarteProjection x = abService.getbyisbn(ISBN);
            links.add(linkTo(methodOn(ABController.class).getbookByISBN(ISBN, false)).withSelfRel());
            links.add(linkTo(methodOn(ABController.class).getbookByISBN(ISBN, true)).withRel("more_info"));
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("genre", null);
            parameters.put("year", null);
            parameters.put("page", null);
            parameters.put("items_per_page", null);
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("all_books").expand(parameters));
            return new ResponseEntity<>(EntityModel.of(x, links), HttpStatus.OK);
        }
    }

    @PostMapping("/books")
    ResponseEntity<?> addbook(@RequestBody Carte carte){
        return new ResponseEntity<>(abService.add(carte),HttpStatus.CREATED);
    }

    @DeleteMapping("/bookcollection/books/{ISBN}")
    ResponseEntity<?> deletebooks(@PathVariable String ISBN)
    {
        abService.delete(ISBN);
        return new ResponseEntity<>("Book deleted",HttpStatus.OK);

    }

    @GetMapping("/books")
    ResponseEntity<?> getBooksFiltred(@RequestParam(required = false) String genre,
                                      @RequestParam(required = false) Integer year,
                                      @RequestParam(required = false) Integer page,
                                      @RequestParam(required = false) Integer items_per_page) {
        int itp = Objects.requireNonNullElse(items_per_page, 5);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("genre", genre);
        parameters.put("year", year);
        parameters.put("page", page);
        parameters.put("items_per_page", items_per_page);
        List<Carte> books;
        List<Link> links = new ArrayList<Link>();

        if (page != null) {
            if (genre != null && year != null) {
                books = abService.findByAnAndGen(year, genre);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                if(page-1>=0)
                {
                    parameters.put("page", Math.min(page - 1, books.size() / itp));
                    links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("prev_page").expand(parameters));
                }
                if(page+1<=books.size()/itp)
                {
                    parameters.put("page",page+1);
                    links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("next_page").expand(parameters));
                }
                parameters.put("page",books.size()/items_per_page);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

                if(books.size()==0 || books.size()<page*itp)
                    return new ResponseEntity<>(CollectionModel.of(new ArrayList<Link>(), links), HttpStatus.OK);
                else
                {
                    if(books.size()<(page+1)*itp)
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                    else
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
                }
            }
            if (genre != null) {
                books = abService.findByGen(genre);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                if(page-1>=0)
                {
                    parameters.put("page", Math.min(page - 1, books.size() / itp));
                    links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("prev_page").expand(parameters));
                }
                if(page+1<=books.size()/itp)
                {
                    parameters.put("page",page+1);
                    links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("next_page").expand(parameters));
                }
                parameters.put("page",books.size()/items_per_page);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

                if(books.size()==0 || books.size()<page*itp)
                    return new ResponseEntity<>(CollectionModel.of(new ArrayList<Link>(), links), HttpStatus.OK);
                else
                {
                    if(books.size()<(page+1)*itp)
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                    else
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
                }
            }
            if (year != null) {
                books = abService.findbyAn(year);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                if(page-1>=0)
                {
                    parameters.put("page", Math.min(page - 1, books.size() / itp));
                    links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("prev_page").expand(parameters));
                }
                if(page+1<=books.size()/itp)
                {
                    parameters.put("page",page+1);
                    links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("next_page").expand(parameters));
                }
                parameters.put("page",books.size()/items_per_page);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

                if(books.size()==0 || books.size()<page*itp)
                    return new ResponseEntity<>(CollectionModel.of(new ArrayList<Link>(), links), HttpStatus.OK);
                else
                {
                    if(books.size()<(page+1)*itp)
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                    else
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
                }
            }

            books = abService.all();
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
            if(page-1>=0)
            {
                parameters.put("page", Math.min(page - 1, books.size() / itp));
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("prev_page").expand(parameters));
            }
            if(page+1<=books.size()/itp)
            {
                parameters.put("page",page+1);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("next_page").expand(parameters));
            }
            parameters.put("page",books.size()/items_per_page);
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

            if(books.size()==0 || books.size()<page*itp)
                return new ResponseEntity<>(CollectionModel.of(new ArrayList<Link>(), links), HttpStatus.OK);
            else
            {
                if(books.size()<(page+1)*itp)
                    return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                else
                    return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
            }

        } else {
            if (genre != null && year != null) {
                books = abService.findByAnAndGen(year, genre);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);
            }
            if (genre != null) {
                books = abService.findByGen(genre);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);
            }
            if (year != null) {
                books = abService.findbyAn(year);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);
            }

            books = abService.all();
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
            return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);

        }

    }

    @GetMapping("/authors")
    ResponseEntity<?> getautor(@RequestParam String name, @RequestParam Boolean match)
    {
        if(match) {
            List<Autor> a = abService.findbyName(name);
            for (Autor autor: a)
            {
                Link selflink = linkTo(methodOn(ABController.class).getautor(name, true)).withSelfRel();
                autor.add(selflink);
            }
            return new ResponseEntity<>(a, HttpStatus.OK);
        }
        else
        {
            List<Autor> a =abService.findbyNameMatch(name);
            for (Autor autor: a)
            {
                Link selflink = linkTo(methodOn(ABController.class).getautor(name, false)).withSelfRel();
                autor.add(selflink);
            }
            return new ResponseEntity<>(a, HttpStatus.OK);
        }
    }

    @PostMapping("/authors")
    ResponseEntity<?> addAutor(@RequestBody Autor autor)
    {
        return new ResponseEntity<>(abService.add(autor),HttpStatus.CREATED);
    }

    @RequestMapping (value="/", method = RequestMethod.OPTIONS)
    ResponseEntity<?> getAll()
    {
        return ResponseEntity.ok().allow(HttpMethod.OPTIONS).build();
    }

    @RequestMapping (value = "/books", method = RequestMethod.OPTIONS)
    ResponseEntity<?> getRelativeToBook()
    {
        return ResponseEntity.ok().allow(HttpMethod.OPTIONS, HttpMethod.GET, HttpMethod.POST).build();
    }

    @RequestMapping (value = "/authors", method = RequestMethod.OPTIONS)
    ResponseEntity <?> getRelativeToAuthors(){
        return ResponseEntity.ok().allow(HttpMethod.OPTIONS, HttpMethod.POST, HttpMethod.GET).build();
    }
}
