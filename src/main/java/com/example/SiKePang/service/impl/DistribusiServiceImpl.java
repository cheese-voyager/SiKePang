package com.example.SiKePang.service.impl;

import com.example.SiKePang.entity.Distribusi;
import com.example.SiKePang.exception.BadRequestException;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.DistribusiRepository;
import com.example.SiKePang.service.DistribusiService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistribusiServiceImpl implements DistribusiService {

    private final DistribusiRepository distribusiRepository;

    public DistribusiServiceImpl(DistribusiRepository distribusiRepository) {
        this.distribusiRepository = distribusiRepository;
    }

    @Override
    public List<Distribusi> getAll() {
        return distribusiRepository.findAll();
    }

    @Override
    public Distribusi getById(Long id) {
        return distribusiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Distribusi tidak ditemukan"));
    }

    @Override
    public Distribusi create(Distribusi distribusi) {
        distribusi.setStatus("PENDING");
        if (distribusi.getDetailDistribusi() == null || distribusi.getDetailDistribusi().isEmpty()) {
            throw new BadRequestException("Distribusi harus memiliki minimal 1 komoditas");
        }
        // Link bidirectional
        distribusi.getDetailDistribusi().forEach(detail -> detail.setDistribusi(distribusi));
        return distribusiRepository.save(distribusi);
    }

    @Override
    public Distribusi updateStatus(Long id, String status) {
        Distribusi distribusi = getById(id);
        distribusi.setStatus(status);
        return distribusiRepository.save(distribusi);
    }

    @Override
    public void delete(Long id) {
        Distribusi distribusi = getById(id);
        distribusiRepository.delete(distribusi);
    }
}
