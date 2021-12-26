package com.example.orderService.service;

import com.example.orderService.model.BookOrders;
import com.example.orderService.repository.BookOrdersRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
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

    public ResponseEntity addBookOrder(BookOrders booksOrder, Integer client_id) {
        bookOrdersRepository.setCollectionName("client." + client_id);
        UriComponentsBuilder renewURIBuilder= UriComponentsBuilder.fromHttpUrl("http://127.0.0.1:8080").path("/api/bookcollection/books/").path("/stockChange");
        UriComponents uriComponent=renewURIBuilder.build(true);
        URI uri=uriComponent.toUri();
        return new RestTemplate().postForObject(uri,booksOrder.getItems(), ResponseEntity.class);
    }
}

