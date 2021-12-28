package com.concretepage.service;

import com.concretepage.entity.Article;
import com.concretepage.entity.Wishlist;

import java.util.List;

public interface IWishlistService {
    List<Wishlist> getAllWishlist();
    Wishlist getWishlistById(Integer wishlistID);
    boolean addWishlist(Wishlist wishlist);
    void updateWishlist(Wishlist wishlist);
    void deleteWishlist(Wishlist wishlist);
}
