package com.example.SiKePang.service;

import com.example.SiKePang.dto.request.PenggunaRequest;
import com.example.SiKePang.entity.BasePengguna;

import java.util.List;

public interface PenggunaService {
    List<BasePengguna> getAll();
    BasePengguna getById(Long id);
    BasePengguna create(PenggunaRequest request);
    BasePengguna update(Long id, PenggunaRequest request);
    void delete(Long id);
}
