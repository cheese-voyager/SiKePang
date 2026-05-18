package com.example.SiKePang.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "komoditas")
@Data
public class Komoditas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nama;

    @Column(nullable = true)
    private String kategori;

    @Column(nullable = false)
    private String satuan;

    @Column(nullable = true)
    private Double harga;
}
