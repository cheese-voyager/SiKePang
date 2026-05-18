package com.example.SiKePang.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "harga_pasar")
@Data
public class HargaPasar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "komoditas_id", nullable = false)
    private Komoditas komoditas;

    @Column(nullable = false)
    private Double harga;

    @Column(name = "satuan_harga", nullable = false)
    private String satuanHarga; // e.g. "/Kg"

    @Column(nullable = false)
    private Double perubahan; // percentage change

    @Column(name = "tanggal_update", nullable = false)
    private LocalDateTime tanggalUpdate;

    @PrePersist
    protected void onCreate() {
        if (tanggalUpdate == null) {
            tanggalUpdate = LocalDateTime.now();
        }
    }
}
