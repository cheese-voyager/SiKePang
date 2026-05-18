package com.example.SiKePang.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "distribusi_komoditas")
@Data
public class DistribusiKomoditas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distribusi_id", nullable = false)
    private Distribusi distribusi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "komoditas_id", nullable = false)
    private Komoditas komoditas;

    @Column(nullable = false)
    private Double jumlah;
}
