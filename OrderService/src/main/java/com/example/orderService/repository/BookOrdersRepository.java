package com.example.orderService.repository;

import com.example.orderService.model.BookOrders;
import com.example.orderService.repository.customRepository.ConfigRepositoryCustom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("bookOrders")
public interface BookOrdersRepository extends MongoRepository<BookOrders, String>, ConfigRepositoryCustom {

    @Override
    List<BookOrders> findAll();
    BookOrders getById(String x);
}
