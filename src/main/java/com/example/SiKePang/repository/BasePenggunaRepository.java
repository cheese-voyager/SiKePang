package com.example.SiKePang.repository;

import com.example.SiKePang.entity.BasePengguna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BasePenggunaRepository extends JpaRepository<BasePengguna, Long> {
    Optional<BasePengguna> findByEmail(String email);
    boolean existsByEmail(String email);
}
