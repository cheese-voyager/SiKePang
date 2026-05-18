package com.example.SiKePang.service;

import com.example.SiKePang.entity.Distribusi;
import java.util.List;

public interface DistribusiService {
    List<Distribusi> getAll();
    Distribusi getById(Long id);
    Distribusi create(Distribusi distribusi);
    Distribusi updateStatus(Long id, String status);
    void delete(Long id);
}
