package com.example.SiKePang.service;

import com.example.SiKePang.entity.Petani;
import java.util.List;

public interface PetaniService {
    List<Petani> getAll();
    Petani getById(Long id);
    Petani create(Petani petani);
    Petani update(Long id, Petani petani);
    void delete(Long id);
}
