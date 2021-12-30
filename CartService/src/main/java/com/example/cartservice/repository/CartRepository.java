package com.example.cartservice.repository;

import com.example.cartservice.model.Cart;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CartRepository extends CrudRepository<Cart,Integer> {
    List<Cart> getByClientid(Integer clientid);
    Cart getCartByClientidAndISBN(Integer clientid, String bookISBN);
}
