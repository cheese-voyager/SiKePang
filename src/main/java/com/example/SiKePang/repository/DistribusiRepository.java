package com.example.SiKePang.repository;

import com.example.SiKePang.entity.Distribusi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistribusiRepository extends JpaRepository<Distribusi, Long> {
    List<Distribusi> findByPetaniId(Long petaniId);
    List<Distribusi> findByStatus(String status);
}
