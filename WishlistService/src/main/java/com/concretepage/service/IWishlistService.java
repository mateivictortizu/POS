package com.concretepage.service;

import com.concretepage.entity.Wishlist;

import java.util.List;

public interface IWishlistService {
    List<Wishlist> getAllWishlist();
    List<Wishlist> getWishlistByClientId(Integer clientID);
    Wishlist getWishlistByWishlistId(Integer wishlistID);
    boolean addWishlist(Wishlist wishlist);
    void updateWishlist(Wishlist wishlist);
    void deleteWishlist(Wishlist wishlist);
}
