package com.example.cartservice.controller;

import com.example.cartservice.model.Cart;
import com.example.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartController {

    @Autowired
    CartService cartService;

    @GetMapping("/cart")
    ResponseEntity<?> getCart(@RequestParam Integer clientid){

        return new ResponseEntity<>(cartService.getCartOfClient(clientid), HttpStatus.OK);
    }

    @PostMapping("/cart")
    ResponseEntity<?> addIteminCart(@RequestParam Integer clientid, @RequestBody Cart item)
    {
        return new ResponseEntity<>(cartService.addItem(item), HttpStatus.OK);
    }
}
