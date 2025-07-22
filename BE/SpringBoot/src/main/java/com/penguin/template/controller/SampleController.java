package com.penguin.template.controller;

import com.penguin.template.repo.OrderRepository;
import com.penguin.template.service.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SampleController {
    private final OrderService orderService;

    public SampleController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/")
    public String index() {
        return "Hello World!";
    }

    @GetMapping("/order/count")
    public Long count() {
        return orderService.countAll();
    }

}
