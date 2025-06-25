package com.template.template.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "sample")
public class Sample {

    @Id
    @GeneratedValue
    private Long id;

    private String firstName;
    private String lastName;

    public Sample() {
    }

    public Sample(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

}
