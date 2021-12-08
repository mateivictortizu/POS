package com.example.pos.service;

import com.example.pos.model.BookOrders;
import com.example.pos.model.Order;
import com.example.pos.repository.BookOrdersRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Boolean addBookOrder(BookOrders booksOrder, Integer client_id) {
        bookOrdersRepository.setCollectionName("client." + client_id);
        for (Order a : booksOrder.getItems()) {
            UriComponentsBuilder renewURIBuilder= UriComponentsBuilder.fromHttpUrl("http://127.0.0.1:8080").path("/api/bookcollection/books/").path(a.getISBN()).path("/stockChange").queryParam("stock", a.getQuantity());
            UriComponents uriComponent=renewURIBuilder.build(true);
            URI uri=uriComponent.toUri();
            return new RestTemplate().postForObject(uri,null, Boolean.class);
        }
        return true;
    }
}

