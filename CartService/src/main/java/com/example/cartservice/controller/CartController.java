package com.example.cartservice.controller;

import com.example.cartservice.model.Cart;
import com.example.cartservice.service.CartService;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartController {

    @Autowired
    CartService cartService;

    @CrossOrigin(origins = "*")
    @GetMapping("/cart")
    ResponseEntity<?> getCart(@RequestParam Integer clientid){
        if(cartService.getCartOfClient(clientid) == null)
            return new ResponseEntity<>(cartService.getCartOfClient(clientid), HttpStatus.NOT_FOUND);
        else
            return new ResponseEntity<>(cartService.getCartOfClient(clientid), HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/cart")
    ResponseEntity<?> addIteminCart(@RequestBody Cart item)
    {
        return new ResponseEntity<>(cartService.addItem(item), HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/cart")
    ResponseEntity<?>deleteAllCart(@RequestParam Integer clientid)
    {
        JSONObject message= new JSONObject();
        if(cartService.getCartOfClient(clientid).size()>0) {
            cartService.deleteAllCartOfClient(clientid);
            message.put("message", "Cosul a fost golit");
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        else {
            message.put("message", "Cosul este deja gol!");
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/addCart")
    ResponseEntity<?> addQuantity(@RequestParam Integer clientid, @RequestParam String ISBN)
    {
        cartService.addQuantity(clientid,ISBN);
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/downCart")
    ResponseEntity<?> downQuantity(@RequestParam Integer clientid, @RequestParam String ISBN)
    {
        cartService.downQuantity(clientid,ISBN);
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/removeItem")
    ResponseEntity<?> removeItem(@RequestParam Integer clientid, @RequestParam String ISBN)
    {
        cartService.removeItem(clientid,ISBN);
        return new ResponseEntity<>(null,HttpStatus.OK);
    }
}
