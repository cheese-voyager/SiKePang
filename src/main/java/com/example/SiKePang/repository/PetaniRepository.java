package com.example.SiKePang.repository;

import com.example.SiKePang.entity.Petani;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetaniRepository extends JpaRepository<Petani, Long> {
}
