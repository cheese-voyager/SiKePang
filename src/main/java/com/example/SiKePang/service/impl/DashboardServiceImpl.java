package com.example.SiKePang.service.impl;

import com.example.SiKePang.dto.response.DashboardStatsResponse;
import com.example.SiKePang.dto.response.DistribusiPerBulanResponse;
import com.example.SiKePang.dto.response.StokTrendResponse;
import com.example.SiKePang.entity.Distribusi;
import com.example.SiKePang.entity.StokPangan;
import com.example.SiKePang.repository.DistribusiRepository;
import com.example.SiKePang.repository.KomoditasRepository;
import com.example.SiKePang.repository.PetaniRepository;
import com.example.SiKePang.repository.StokPanganRepository;
import com.example.SiKePang.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final PetaniRepository petaniRepository;
    private final KomoditasRepository komoditasRepository;
    private final StokPanganRepository stokPanganRepository;
    private final DistribusiRepository distribusiRepository;

    public DashboardServiceImpl(PetaniRepository petaniRepository,
                                KomoditasRepository komoditasRepository,
                                StokPanganRepository stokPanganRepository,
                                DistribusiRepository distribusiRepository) {
        this.petaniRepository = petaniRepository;
        this.komoditasRepository = komoditasRepository;
        this.stokPanganRepository = stokPanganRepository;
        this.distribusiRepository = distribusiRepository;
    }

    @Override
    public DashboardStatsResponse getStats() {
        long totalPetani = petaniRepository.count();
        long totalKomoditas = komoditasRepository.count();

        List<StokPangan> allStok = stokPanganRepository.findAll();
        double totalStokMasuk = allStok.stream()
                .filter(s -> "MASUK".equals(s.getJenisTransaksi()))
                .mapToDouble(StokPangan::getJumlah)
                .sum();
        double totalStokKeluar = allStok.stream()
                .filter(s -> "KELUAR".equals(s.getJenisTransaksi()))
                .mapToDouble(StokPangan::getJumlah)
                .sum();

        List<Distribusi> allDistribusi = distribusiRepository.findAll();
        long totalDistribusi = allDistribusi.size();
        long distribusiSelesai = allDistribusi.stream().filter(d -> "SELESAI".equals(d.getStatus())).count();
        long distribusiProses = allDistribusi.stream().filter(d ->
                "DIPROSES".equals(d.getStatus()) || "DIKIRIM".equals(d.getStatus())).count();
        long distribusiMenunggu = allDistribusi.stream().filter(d -> "PENDING".equals(d.getStatus()) || "MENUNGGU".equals(d.getStatus())).count();

        return new DashboardStatsResponse(totalPetani, totalKomoditas, totalStokMasuk, totalStokKeluar,
                totalDistribusi, distribusiSelesai, distribusiProses, distribusiMenunggu);
    }

    @Override
    public List<StokTrendResponse> getStokTrend() {
        List<StokPangan> allStok = stokPanganRepository.findAll();

        // Group by month name (last 6 months at most)
        Map<Integer, double[]> monthMap = new TreeMap<>();
        for (StokPangan stok : allStok) {
            int monthValue = stok.getTanggal().getMonthValue();
            monthMap.putIfAbsent(monthValue, new double[]{0, 0});
            if ("MASUK".equals(stok.getJenisTransaksi())) {
                monthMap.get(monthValue)[0] += stok.getJumlah();
            } else {
                monthMap.get(monthValue)[1] += stok.getJumlah();
            }
        }

        List<StokTrendResponse> result = new ArrayList<>();
        Locale locale = new Locale("id", "ID");
        for (Map.Entry<Integer, double[]> entry : monthMap.entrySet()) {
            String monthName = Month.of(entry.getKey()).getDisplayName(TextStyle.SHORT, locale);
            // Capitalize first letter
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);
            result.add(new StokTrendResponse(monthName, entry.getValue()[0], entry.getValue()[1]));
        }
        return result;
    }

    @Override
    public List<DistribusiPerBulanResponse> getDistribusiPerBulan() {
        List<Distribusi> allDistribusi = distribusiRepository.findAll();

        Map<Integer, Long> monthMap = new TreeMap<>();
        for (Distribusi dist : allDistribusi) {
            int monthValue = dist.getTanggalDistribusi().getMonthValue();
            monthMap.merge(monthValue, 1L, Long::sum);
        }

        List<DistribusiPerBulanResponse> result = new ArrayList<>();
        Locale locale = new Locale("id", "ID");
        for (Map.Entry<Integer, Long> entry : monthMap.entrySet()) {
            String monthName = Month.of(entry.getKey()).getDisplayName(TextStyle.SHORT, locale);
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);
            result.add(new DistribusiPerBulanResponse(monthName, entry.getValue()));
        }
        return result;
    }
}
