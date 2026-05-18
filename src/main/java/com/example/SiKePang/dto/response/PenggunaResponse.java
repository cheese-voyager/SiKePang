package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.BasePengguna;
import com.example.SiKePang.entity.Petani;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PenggunaResponse {
    private Long id;
    private String nama;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    // Petani fields (if applicable)
    private String nomorTelepon;
    private String kelompokTani;
    private String alamat;

    public static PenggunaResponse fromEntity(BasePengguna pengguna) {
        PenggunaResponse response = new PenggunaResponse();
        response.setId(pengguna.getId());
        response.setNama(pengguna.getNama());
        response.setEmail(pengguna.getEmail());
        response.setRole(pengguna.getRole());
        response.setCreatedAt(pengguna.getCreatedAt());

        if (pengguna instanceof Petani) {
            Petani petani = (Petani) pengguna;
            response.setNomorTelepon(petani.getNomorTelepon());
            response.setKelompokTani(petani.getKelompokTani());
            response.setAlamat(petani.getAlamat());
        }

        return response;
    }
}
