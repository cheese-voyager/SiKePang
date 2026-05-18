package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.Petani;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PetaniResponse {

    private Long id;
    private String nama;
    private String email;
    private String role;
    private String kelompokTani;
    private String alamat;
    private String nomorTelepon;
    private LocalDateTime createdAt;

    public static PetaniResponse fromEntity(Petani petani) {
        PetaniResponse response = new PetaniResponse();
        response.setId(petani.getId());
        response.setNama(petani.getNama());
        response.setEmail(petani.getEmail());
        response.setRole(petani.getRole());
        response.setKelompokTani(petani.getKelompokTani());
        response.setAlamat(petani.getAlamat());
        response.setNomorTelepon(petani.getNomorTelepon());
        response.setCreatedAt(petani.getCreatedAt());
        return response;
    }
}
