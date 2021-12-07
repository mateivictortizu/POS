package com.example.pos.service;

import com.example.pos.model.BookOrders;
import com.example.pos.repository.BookOrdersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final BookOrdersRepository bookOrdersRepository;

    public OrderService(BookOrdersRepository bookOrdersRepository) {
        this.bookOrdersRepository = bookOrdersRepository;
    }

    public List<BookOrders> getBookOrder(Integer client_id){
        bookOrdersRepository.setCollectionName("client."+client_id);
        return bookOrdersRepository.findAll();
    }

    public void addBookOrder(BookOrders booksOrder, Integer client_id) {
        bookOrdersRepository.setCollectionName("client."+client_id);
        bookOrdersRepository.save(booksOrder);
    }
}

