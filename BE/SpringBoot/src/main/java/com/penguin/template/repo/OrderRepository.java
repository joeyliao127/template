package com.penguin.template.repo;

import com.penguin.template.entity.Orders;
import org.springframework.data.repository.CrudRepository;


public interface OrderRepository extends CrudRepository<Orders, Long> {
}
