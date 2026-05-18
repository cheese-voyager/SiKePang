package com.example.SiKePang.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "petani")
@Data
@EqualsAndHashCode(callSuper = true)
public class Petani extends BasePengguna {

    @Column(name = "kelompok_tani")
    private String kelompokTani;

    private String alamat;

    @Column(name = "nomor_telepon")
    private String nomorTelepon;

    @Override
    public String getRole() {
        return "PETANI";
    }
}
