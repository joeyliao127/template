package com.template.template.repository;

import com.template.template.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, Integer> {
    Sample findById(long id);
    List<Sample> findByFirstName(String firstName);
    List<Sample> findByLastName(String lastName);
}
