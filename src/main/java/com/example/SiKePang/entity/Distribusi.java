package com.example.SiKePang.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "distribusi")
@Data
public class Distribusi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "petani_id", nullable = false)
    private Petani petani;

    @Column(name = "tanggal_distribusi", nullable = false)
    private LocalDateTime tanggalDistribusi;

    @Column(nullable = false)
    private String tujuan;

    @Column(nullable = false)
    private String status; // PENDING, SELESAI, BATAL

    @OneToMany(mappedBy = "distribusi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DistribusiKomoditas> detailDistribusi;

    @PrePersist
    protected void onCreate() {
        if (tanggalDistribusi == null) {
            tanggalDistribusi = LocalDateTime.now();
        }
    }
}
