package com.example.SiKePang.repository;

import com.example.SiKePang.entity.Komoditas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KomoditasRepository extends JpaRepository<Komoditas, Long> {
    List<Komoditas> findByKategori(String kategori);
}
