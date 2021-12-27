package com.example.abservice.controller;

import com.example.abservice.model.Autor;
import com.example.abservice.model.Carte;
import com.example.abservice.model.CarteAutor;
import com.example.abservice.model.Order;
import com.example.abservice.service.ABService;
import net.minidev.json.JSONObject;
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
        JSONObject jsonObj = new JSONObject();
        Carte x = abService.getBookByISBN(ISBN);
        if(x==null)
        {
            jsonObj.put("message","No books with this ISBN");
            return new ResponseEntity<>(jsonObj,HttpStatus.NOT_FOUND);
        }
        if (verbose) {
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
            jsonObj.put("isbn", x.getISBN());
            jsonObj.put("titlu", x.getTitlu());
            jsonObj.put("genliterar", x.getGenliterar());
            links.add(linkTo(methodOn(ABController.class).getbookByISBN(ISBN, false)).withSelfRel());
            links.add(linkTo(methodOn(ABController.class).getbookByISBN(ISBN, true)).withRel("more_info"));
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("genre", null);
            parameters.put("year", null);
            parameters.put("page", null);
            parameters.put("items_per_page", null);
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("all_books").expand(parameters));
            return new ResponseEntity<>(EntityModel.of(jsonObj,links), HttpStatus.OK);
        }
    }

    @DeleteMapping("/books/{ISBN}")
    ResponseEntity<?> deletebooks(@PathVariable String ISBN)
    {
        abService.deleteBook(ISBN);
        return new ResponseEntity<>("Book deleted",HttpStatus.OK);

    }

    @PostMapping("/books")
    ResponseEntity<?> addbook(@RequestBody Carte carte){

        return new ResponseEntity<>(abService.addBook(carte),HttpStatus.CREATED);
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
        JSONObject error=new JSONObject();
        error.put("message","No books");

        if (page != null) {
            if (genre != null && year != null) {
                books = abService.getBookByYearAndGenre(year, genre);
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
                parameters.put("page",books.size()/itp);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

                if(books.size()==0 || books.size()<page*itp)
                    return new ResponseEntity<>(CollectionModel.of(error, links), HttpStatus.NOT_FOUND);
                else
                {
                    if(books.size()<(page+1)*itp)
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                    else
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
                }
            }
            if (genre != null) {
                books = abService.getBookByGenre(genre);
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
                parameters.put("page",books.size()/itp);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

                if(books.size()==0 || books.size()<page*itp)
                    return new ResponseEntity<>(CollectionModel.of(error, links), HttpStatus.NOT_FOUND);
                else
                {
                    if(books.size()<(page+1)*itp)
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                    else
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
                }
            }
            if (year != null) {
                books = abService.getBookByYear(year);
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
                parameters.put("page",books.size()/itp);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

                if(books.size()==0 || books.size()<page*itp)
                    return new ResponseEntity<>(CollectionModel.of(error, links), HttpStatus.NOT_FOUND);
                else
                {
                    if(books.size()<(page+1)*itp)
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                    else
                        return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
                }
            }

            books = abService.getAllBooks();
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
            parameters.put("page",books.size()/itp);
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withRel("last_page").expand(parameters));

            if(books.size()==0 || books.size()<page*itp)
                return new ResponseEntity<>(CollectionModel.of(error, links), HttpStatus.NOT_FOUND);
            else
            {
                if(books.size()<(page+1)*itp)
                    return new ResponseEntity<>(CollectionModel.of(books.subList(page*itp,books.size()),links),HttpStatus.OK);
                else
                    return new ResponseEntity<>(CollectionModel.of(books.subList(page * itp, (page + 1) * itp), links), HttpStatus.OK);
            }

        } else {
            if (genre != null && year != null) {
                books = abService.getBookByYearAndGenre(year, genre);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                if (books.size()==0)
                {
                    return new ResponseEntity<>(CollectionModel.of(error,links),HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);
            }
            if (genre != null) {
                books = abService.getBookByGenre(genre);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                if (books.size()==0)
                {
                    return new ResponseEntity<>(CollectionModel.of(error,links),HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);
            }
            if (year != null) {
                books = abService.getBookByYear(year);
                links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
                if (books.size()==0)
                {
                    return new ResponseEntity<>(CollectionModel.of(error,links),HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);
            }

            books = abService.getAllBooks();
            links.add(linkTo(methodOn(ABController.class).getBooksFiltred(null, null, null, null)).withSelfRel().expand(parameters));
            if (books.size()==0)
            {
                return new ResponseEntity<>(CollectionModel.of(error,links),HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(CollectionModel.of(books, links), HttpStatus.OK);

        }

    }

    @GetMapping("/authors")
    ResponseEntity<?> getautor(@RequestParam String name, @RequestParam Boolean match)
    {
        JSONObject error=new JSONObject();
        error.put("message","No authors found");

        if(match) {
            List<Autor> a = abService.getAuthorByName(name);
            for (Autor autor: a)
            {
                Link selflink = linkTo(methodOn(ABController.class).getautor(name, true)).withSelfRel();
                autor.add(selflink);
            }
            return new ResponseEntity<>(a, HttpStatus.OK);
        }
        else
        {
            List<Autor> a =abService.getAuthorByNameMatch(name);
            for (Autor autor: a)
            {
                Link selflink = linkTo(methodOn(ABController.class).getautor(name, false)).withSelfRel();
                autor.add(selflink);
            }
            if(a.size()==0)
            {
                return new ResponseEntity<>(error,HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(a, HttpStatus.OK);
        }
    }

    @PostMapping("/authors")
    ResponseEntity<?> addAutor(@RequestBody Autor autor)
    {
        return new ResponseEntity<>(abService.addAuthor(autor),HttpStatus.CREATED);
    }

    @GetMapping("/authors/{ID}")
    ResponseEntity<?> getAuthorsById(@PathVariable Integer ID)
    {
        JSONObject error=new JSONObject();
        error.put("message","No author found");
        Autor a = abService.getAuthorByID(ID);
        if(a==null)
        {
            return new ResponseEntity<>(error,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(a,HttpStatus.OK);
    }

    @DeleteMapping ("/authors/{ID}")
    ResponseEntity<?> deleteauthors(@PathVariable Integer ID)
    {
        abService.deleteAuthor(ID);
        return new ResponseEntity<>("Author deleted",HttpStatus.OK);

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

    @PostMapping (value = "/books/{ISBN}/authors")
    ResponseEntity <?> addAuthorsToBook(@PathVariable String ISBN,@RequestBody List<Autor> autori){
        JSONObject error=new JSONObject();
        Carte c=abService.getBookByISBN(ISBN);
        if (c==null)
        {
            error.put("message","No book found");
            return new ResponseEntity<>(error,HttpStatus.BAD_REQUEST);
        }
        int index=Objects.requireNonNullElse(abService.getIndexAutor(c) ,-1) +1;
        for (Autor a:autori) {
            Autor checkAutor = abService.checkAutor(a);
            if(checkAutor == null)
            {
                error.put("message","No author found");
                return new ResponseEntity<>(error,HttpStatus.BAD_REQUEST);
            }
            CarteAutor ca= new CarteAutor();
            ca.setAutor(a);
            ca.setCarte(c);
            ca.setId(a.getID(),ISBN);
            ca.setIndex_autor(index);
            abService.addRelationBookAuthor(ca);
            index=index+1;

        }
        return new ResponseEntity<>(autori,HttpStatus.CREATED);
    }

    @PostMapping(value="/books/stockChange")
    ResponseEntity<?> stock_endpoint(@RequestBody List<Order> orders) {
        List <Order> temporary=new ArrayList<>();
        boolean value = true;
        for(Order o:orders){
            if(!abService.checkStoc(o.getISBN(), o.getQuantity()))
            {
                value=false;
                break;
            }
            abService.modifyStock(o.getISBN(),o.getQuantity());
            temporary.add(o);
        }
        if(!value)
        {
            for( Order o:temporary)
            {
                abService.modifyStock(o.getISBN(),-o.getQuantity());
            }
        }
        return new ResponseEntity<>(value,HttpStatus.OK);
    }
}
