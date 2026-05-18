package com.example.SiKePang.service;

import com.example.SiKePang.entity.StokPangan;
import java.util.List;

public interface StokPanganService {
    List<StokPangan> getAll();
    List<StokPangan> getByPetaniId(Long petaniId);
    StokPangan getById(Long id);
    StokPangan create(StokPangan stokPangan);
    StokPangan update(Long id, StokPangan stokPangan);
    void delete(Long id);
}
