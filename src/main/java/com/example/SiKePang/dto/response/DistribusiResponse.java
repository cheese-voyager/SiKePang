package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.Distribusi;
import com.example.SiKePang.entity.DistribusiKomoditas;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class DistribusiResponse {

    private Long id;
    private Long petaniId;
    private String namaPetani;
    private LocalDateTime tanggalDistribusi;
    private String tujuan;
    private String status;
    private List<DetailKomoditasResponse> detailDistribusi;

    @Data
    public static class DetailKomoditasResponse {
        private Long id;
        private Long komoditasId;
        private String namaKomoditas;
        private String satuan;
        private Double jumlah;

        public static DetailKomoditasResponse fromEntity(DistribusiKomoditas detail) {
            DetailKomoditasResponse response = new DetailKomoditasResponse();
            response.setId(detail.getId());
            response.setJumlah(detail.getJumlah());
            if (detail.getKomoditas() != null) {
                response.setKomoditasId(detail.getKomoditas().getId());
                response.setNamaKomoditas(detail.getKomoditas().getNama());
                response.setSatuan(detail.getKomoditas().getSatuan());
            }
            return response;
        }
    }

    public static DistribusiResponse fromEntity(Distribusi distribusi) {
        DistribusiResponse response = new DistribusiResponse();
        response.setId(distribusi.getId());
        response.setTanggalDistribusi(distribusi.getTanggalDistribusi());
        response.setTujuan(distribusi.getTujuan());
        response.setStatus(distribusi.getStatus());

        if (distribusi.getPetani() != null) {
            response.setPetaniId(distribusi.getPetani().getId());
            response.setNamaPetani(distribusi.getPetani().getNama());
        }
        if (distribusi.getDetailDistribusi() != null) {
            response.setDetailDistribusi(
                distribusi.getDetailDistribusi().stream()
                    .map(DetailKomoditasResponse::fromEntity)
                    .collect(Collectors.toList())
            );
        }
        return response;
    }
}
