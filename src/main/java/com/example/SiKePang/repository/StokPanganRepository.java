package com.example.SiKePang.repository;

import com.example.SiKePang.entity.StokPangan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StokPanganRepository extends JpaRepository<StokPangan, Long> {
    List<StokPangan> findByPetaniId(Long petaniId);
    List<StokPangan> findByKomoditasId(Long komoditasId);
}
