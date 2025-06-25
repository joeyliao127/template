package com.template.template.service;

import com.template.template.entity.Sample;
import com.template.template.repository.SampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SampleService {

    private final SampleRepository sampleRepository;

    @Autowired
    public SampleService(SampleRepository sampleRepository) {
        this.sampleRepository = sampleRepository;
    }

    public Sample save(String firstName, String lastName) {
        Sample sample = new Sample();
        sample.setFirstName(firstName);
        sample.setLastName(lastName);
        return sampleRepository.save(sample);
    }

    public List<Sample> findAll() {
        return sampleRepository.findAll();
    }

    public Sample findById(Long id) {
        return sampleRepository.findById(id);
    }

    public List<Sample> findByFirstName(String firstName) {
        return this.sampleRepository.findByFirstName(firstName);
    }

    public List<Sample> findByLastName(String lastName) {
        return this.sampleRepository.findByLastName(lastName);
    }
}
