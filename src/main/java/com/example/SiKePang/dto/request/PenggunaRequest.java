package com.example.SiKePang.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PenggunaRequest {

    @NotBlank(message = "Nama tidak boleh kosong")
    private String nama;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    private String email;

    private String password;

    @NotBlank(message = "Role tidak boleh kosong")
    private String role;

    // Optional fields for Petani
    private String nomorTelepon;
    private String kelompokTani;
    private String alamat;
}
