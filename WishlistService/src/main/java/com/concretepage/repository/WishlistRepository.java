package com.concretepage.repository;

import com.concretepage.entity.Wishlist;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface WishlistRepository extends CrudRepository<Wishlist, Long> {
    List<Wishlist> findByClientId(Integer clientID);
    Wishlist findByWishlistID(Integer wishlistId);
    List<Wishlist> findByClientIdAndBookISBN(Integer clientId, String bookISBN);

}
