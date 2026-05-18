package com.example.SiKePang.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "petugas")
@Data
@EqualsAndHashCode(callSuper = true)
public class Petugas extends BasePengguna {

    @Override
    public String getRole() {
        return "PETUGAS";
    }
}
