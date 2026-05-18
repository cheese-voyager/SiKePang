package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.HargaPasar;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HargaPasarResponse {

    private Long id;
    private Long komoditasId;
    private String nama;
    private String kategori;
    private Double harga;
    private String satuanHarga;
    private Double perubahan;
    private LocalDateTime tanggalUpdate;

    public static HargaPasarResponse fromEntity(HargaPasar hp) {
        HargaPasarResponse response = new HargaPasarResponse();
        response.setId(hp.getId());
        response.setHarga(hp.getHarga());
        response.setSatuanHarga(hp.getSatuanHarga());
        response.setPerubahan(hp.getPerubahan());
        response.setTanggalUpdate(hp.getTanggalUpdate());

        if (hp.getKomoditas() != null) {
            response.setKomoditasId(hp.getKomoditas().getId());
            response.setNama(hp.getKomoditas().getNama());
            response.setKategori(hp.getKomoditas().getKategori());
        }
        return response;
    }
}
