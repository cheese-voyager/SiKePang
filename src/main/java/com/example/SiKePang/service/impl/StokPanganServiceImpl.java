package com.example.SiKePang.service.impl;

import com.example.SiKePang.entity.StokPangan;
import com.example.SiKePang.exception.BadRequestException;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.StokPanganRepository;
import com.example.SiKePang.service.StokPanganService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StokPanganServiceImpl implements StokPanganService {

    private final StokPanganRepository stokPanganRepository;

    public StokPanganServiceImpl(StokPanganRepository stokPanganRepository) {
        this.stokPanganRepository = stokPanganRepository;
    }

    @Override
    public List<StokPangan> getAll() {
        return stokPanganRepository.findAll();
    }

    @Override
    public List<StokPangan> getByPetaniId(Long petaniId) {
        return stokPanganRepository.findByPetaniId(petaniId);
    }

    @Override
    public StokPangan getById(Long id) {
        return stokPanganRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stok Pangan tidak ditemukan"));
    }

    @Override
    public StokPangan create(StokPangan stokPangan) {
        if (stokPangan.getJumlah() == null || stokPangan.getJumlah() <= 0) {
            throw new BadRequestException("Jumlah stok harus lebih dari 0");
        }
        return stokPanganRepository.save(stokPangan);
    }

    @Override
    public StokPangan update(Long id, StokPangan updatedStok) {
        StokPangan existing = getById(id);
        if (updatedStok.getPetani() != null) existing.setPetani(updatedStok.getPetani());
        if (updatedStok.getKomoditas() != null) existing.setKomoditas(updatedStok.getKomoditas());
        if (updatedStok.getJumlah() != null) existing.setJumlah(updatedStok.getJumlah());
        if (updatedStok.getJenisTransaksi() != null) existing.setJenisTransaksi(updatedStok.getJenisTransaksi());
        return stokPanganRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        StokPangan stokPangan = getById(id);
        stokPanganRepository.delete(stokPangan);
    }
}
