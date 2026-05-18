package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.StokPangan;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StokPanganResponse {

    private Long id;
    private Long petaniId;
    private String namaPetani;
    private Long komoditasId;
    private String namaKomoditas;
    private String satuanKomoditas;
    private Double jumlah;
    private String jenisTransaksi;
    private LocalDateTime tanggal;

    public static StokPanganResponse fromEntity(StokPangan stok) {
        StokPanganResponse response = new StokPanganResponse();
        response.setId(stok.getId());
        response.setJumlah(stok.getJumlah());
        response.setJenisTransaksi(stok.getJenisTransaksi());
        response.setTanggal(stok.getTanggal());

        if (stok.getPetani() != null) {
            response.setPetaniId(stok.getPetani().getId());
            response.setNamaPetani(stok.getPetani().getNama());
        }
        if (stok.getKomoditas() != null) {
            response.setKomoditasId(stok.getKomoditas().getId());
            response.setNamaKomoditas(stok.getKomoditas().getNama());
            response.setSatuanKomoditas(stok.getKomoditas().getSatuan());
        }
        return response;
    }
}
