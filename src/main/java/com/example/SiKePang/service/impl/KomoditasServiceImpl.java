package com.example.SiKePang.service.impl;

import com.example.SiKePang.entity.Komoditas;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.KomoditasRepository;
import com.example.SiKePang.service.KomoditasService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KomoditasServiceImpl implements KomoditasService {
    
    private final KomoditasRepository komoditasRepository;

    public KomoditasServiceImpl(KomoditasRepository komoditasRepository) {
        this.komoditasRepository = komoditasRepository;
    }

    @Override
    public List<Komoditas> getAll() {
        return komoditasRepository.findAll();
    }

    @Override
    public Komoditas getById(Long id) {
        return komoditasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Komoditas tidak ditemukan"));
    }

    @Override
    public Komoditas create(Komoditas komoditas) {
        return komoditasRepository.save(komoditas);
    }

    @Override
    public Komoditas update(Long id, Komoditas request) {
        Komoditas komoditas = getById(id);
        komoditas.setNama(request.getNama());
        komoditas.setKategori(request.getKategori());
        komoditas.setSatuan(request.getSatuan());
        komoditas.setHarga(request.getHarga());
        return komoditasRepository.save(komoditas);
    }

    @Override
    public void delete(Long id) {
        Komoditas komoditas = getById(id);
        komoditasRepository.delete(komoditas);
    }
}
