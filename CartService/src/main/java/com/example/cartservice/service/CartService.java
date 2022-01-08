package com.example.cartservice.service;

import com.example.cartservice.model.Cart;
import com.example.cartservice.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<Cart> getCartOfClient(Integer clientid)
    {
        return cartRepository.getByClientid(clientid);
    }

    public Cart addItem(Cart item)
    {
        Cart x = cartRepository.getCartByClientidAndISBN(item.getClientid(), item.getISBN());
        if(x==null)
        {
            return cartRepository.save(item);
        }
        else
        {
            x.setQuantity(x.getQuantity()+item.getQuantity());
            return cartRepository.save(x);
        }
    }

    public void deleteAllCartOfClient(Integer clientid)
    {
        List<Cart> items = cartRepository.getByClientid(clientid);
        cartRepository.deleteAll(items);
    }

    public void addQuantity(Integer clientid, String ISBN){
        Cart item=cartRepository.getCartByClientidAndISBN(clientid,ISBN);
        item.setQuantity(item.getQuantity()+1);
        cartRepository.save(item);
    }

    public void downQuantity(Integer clientid, String ISBN){
        Cart item=cartRepository.getCartByClientidAndISBN(clientid,ISBN);
        if(item.getQuantity()<=0)
        {
            cartRepository.delete(item);
        }
        else
        {
            item.setQuantity(item.getQuantity() - 1);
            cartRepository.save(item);
        }
    }

    public void removeItem(Integer clientid, String ISBN){
        Cart item=cartRepository.getCartByClientidAndISBN(clientid,ISBN);
        cartRepository.delete(item);
    }
}
