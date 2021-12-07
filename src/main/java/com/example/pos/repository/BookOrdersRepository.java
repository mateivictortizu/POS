package com.example.pos.repository;

import com.example.pos.model.BookOrders;
import com.example.pos.model.Status;
import com.example.pos.repository.customRepository.ConfigRepositoryCustom;
import com.jayway.jsonpath.Criteria;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("bookOrders")
public interface BookOrdersRepository extends MongoRepository<BookOrders, String>, ConfigRepositoryCustom {

    @Override
    List<BookOrders> findAll();
}
