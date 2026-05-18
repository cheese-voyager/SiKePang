package com.example.SiKePang.service;

import com.example.SiKePang.entity.Komoditas;
import java.util.List;

public interface KomoditasService {
    List<Komoditas> getAll();
    Komoditas getById(Long id);
    Komoditas create(Komoditas komoditas);
    Komoditas update(Long id, Komoditas komoditas);
    void delete(Long id);
}
