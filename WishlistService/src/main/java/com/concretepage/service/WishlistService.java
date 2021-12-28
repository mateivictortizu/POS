package com.concretepage.service;

import com.concretepage.entity.Wishlist;
import com.concretepage.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishlistService implements IWishlistService{

    @Autowired
    private WishlistRepository wishlistRepository;

    @Override
    public List<Wishlist> getAllWishlist() {
        List<Wishlist> list = new ArrayList<>();
        wishlistRepository.findAll().forEach(e -> list.add(e));
        return list;
    }

    @Override
    public List<Wishlist> getWishlistByClientId(Integer clientID) {
        List<Wishlist> obj = wishlistRepository.findByClientId(clientID);
        return obj;
    }

    @Override
    public Wishlist getWishlistByWishlistId(Integer wishlistID) {
        return wishlistRepository.findByWishlistID(wishlistID);
    }


    @Override
    public boolean addWishlist(Wishlist wishlist) {
        List<Wishlist> list = wishlistRepository.findByClientIdAndBookISBN(wishlist.getClientId(), wishlist.getBookISBN());
        if (list.size() > 0) {
            return false;
        } else {
            wishlist = wishlistRepository.save(wishlist);
            return true;
        }
    }

    @Override
    public void updateWishlist(Wishlist wishlist) {
        wishlistRepository.save(wishlist);
    }

    @Override
    public void deleteWishlist(Wishlist wishlist) {
        wishlistRepository.delete(wishlist);
    }
}
