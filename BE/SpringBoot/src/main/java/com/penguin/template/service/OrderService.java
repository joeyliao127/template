package com.penguin.template.service;

import com.penguin.template.entity.Orders;
import com.penguin.template.repo.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Iterable<Orders> index() {
        return orderRepository.findAll();
    }

    public long countAll() {
        return orderRepository.count();
    }
}
