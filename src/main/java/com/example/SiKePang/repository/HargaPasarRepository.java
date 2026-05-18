package com.example.SiKePang.repository;

import com.example.SiKePang.entity.HargaPasar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HargaPasarRepository extends JpaRepository<HargaPasar, Long> {
    List<HargaPasar> findByKomoditasId(Long komoditasId);

    /**
     * Ambil harga terbaru untuk setiap komoditas (1 entry per komoditas).
     */
    @Query("SELECT h FROM HargaPasar h WHERE h.tanggalUpdate = " +
           "(SELECT MAX(h2.tanggalUpdate) FROM HargaPasar h2 WHERE h2.komoditas.id = h.komoditas.id)")
    List<HargaPasar> findLatestPrices();
}
