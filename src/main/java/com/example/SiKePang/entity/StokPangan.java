package com.example.SiKePang.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "stok_pangan")
@Data
public class StokPangan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "petani_id", nullable = false)
    private Petani petani;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "komoditas_id", nullable = false)
    private Komoditas komoditas;

    @Column(nullable = false)
    private Double jumlah;

    @Column(name = "jenis_transaksi", nullable = false)
    private String jenisTransaksi; // MASUK, KELUAR

    @Column(nullable = false)
    private LocalDateTime tanggal;

    @PrePersist
    protected void onCreate() {
        if (tanggal == null) {
            tanggal = LocalDateTime.now();
        }
    }
}
