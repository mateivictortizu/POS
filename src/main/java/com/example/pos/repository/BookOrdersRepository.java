package com.example.pos.repository;

import com.example.pos.model.BookOrders;
import com.example.pos.repository.customRepository.ConfigRepositoryCustom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("bookOrders")
public interface BookOrdersRepository extends MongoRepository<BookOrders, String>, ConfigRepositoryCustom {

}
