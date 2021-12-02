package com.example.pos.controller;

import com.example.pos.model.Autor;
import com.example.pos.service.AutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AutorController {

    @Autowired
    AutorService autorService;

    @GetMapping("/authors")
    ResponseEntity<?> getautor(@RequestParam String name, @RequestParam (required = false) String match)
    {
        if(match == null)
            return new ResponseEntity<>(autorService.findbyName(name), HttpStatus.OK);
        else
        {
            return new ResponseEntity<>(autorService.findbyNameMatch(name),HttpStatus.OK);
        }
    }

    @PostMapping("/authors")
    ResponseEntity<?> addAutor(@RequestBody Autor autor)
    {
        return new ResponseEntity<>(autorService.add(autor),HttpStatus.CREATED);
    }

    @RequestMapping (value = "/bookcollection/authors", method = RequestMethod.OPTIONS)
    ResponseEntity <?> getRelativeToAuthors(){
        return null;
    }
}
