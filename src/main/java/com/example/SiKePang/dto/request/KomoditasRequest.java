package com.example.SiKePang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KomoditasRequest {

    @NotBlank(message = "Nama komoditas tidak boleh kosong")
    private String nama;

    @NotBlank(message = "Kategori tidak boleh kosong")
    private String kategori;

    @NotBlank(message = "Satuan tidak boleh kosong")
    private String satuan;
}
