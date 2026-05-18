package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.Komoditas;
import lombok.Data;

@Data
public class KomoditasResponse {

    private Long id;
    private String nama;
    private String kategori;
    private String satuan;

    public static KomoditasResponse fromEntity(Komoditas komoditas) {
        KomoditasResponse response = new KomoditasResponse();
        response.setId(komoditas.getId());
        response.setNama(komoditas.getNama());
        response.setKategori(komoditas.getKategori());
        response.setSatuan(komoditas.getSatuan());
        return response;
    }
}
