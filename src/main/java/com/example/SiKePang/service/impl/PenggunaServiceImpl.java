package com.example.SiKePang.service.impl;

import com.example.SiKePang.dto.request.PenggunaRequest;
import com.example.SiKePang.entity.Admin;
import com.example.SiKePang.entity.BasePengguna;
import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.entity.Petugas;
import com.example.SiKePang.exception.BadRequestException;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.BasePenggunaRepository;
import com.example.SiKePang.service.PenggunaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PenggunaServiceImpl implements PenggunaService {

    private final BasePenggunaRepository penggunaRepository;

    public PenggunaServiceImpl(BasePenggunaRepository penggunaRepository) {
        this.penggunaRepository = penggunaRepository;
    }

    @Override
    public List<BasePengguna> getAll() {
        return penggunaRepository.findAll();
    }

    @Override
    public BasePengguna getById(Long id) {
        return penggunaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan."));
    }

    @Override
    public BasePengguna create(PenggunaRequest request) {
        if (penggunaRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah digunakan.");
        }

        BasePengguna pengguna;
        String role = request.getRole().toUpperCase();

        if ("ADMIN".equals(role)) {
            Admin admin = new Admin();
            admin.setNama(request.getNama());
            admin.setEmail(request.getEmail());
            admin.setPassword(request.getPassword());
            pengguna = admin;
        } else if ("PETUGAS".equals(role)) {
            Petugas petugas = new Petugas();
            petugas.setNama(request.getNama());
            petugas.setEmail(request.getEmail());
            petugas.setPassword(request.getPassword());
            pengguna = petugas;
        } else {
            Petani petani = new Petani();
            petani.setNama(request.getNama());
            petani.setEmail(request.getEmail());
            petani.setPassword(request.getPassword());
            petani.setNomorTelepon(request.getNomorTelepon());
            petani.setKelompokTani(request.getKelompokTani() != null ? request.getKelompokTani() : "-");
            petani.setAlamat(request.getAlamat() != null ? request.getAlamat() : "-");
            pengguna = petani;
        }

        return penggunaRepository.save(pengguna);
    }

    @Override
    public BasePengguna update(Long id, PenggunaRequest request) {
        BasePengguna pengguna = getById(id);

        // Check if email changed and is already taken
        if (!pengguna.getEmail().equals(request.getEmail()) && penggunaRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah digunakan oleh pengguna lain.");
        }

        pengguna.setNama(request.getNama());
        pengguna.setEmail(request.getEmail());
        
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            pengguna.setPassword(request.getPassword());
        }

        if (pengguna instanceof Petani) {
            Petani petani = (Petani) pengguna;
            petani.setNomorTelepon(request.getNomorTelepon());
            if (request.getKelompokTani() != null) petani.setKelompokTani(request.getKelompokTani());
            if (request.getAlamat() != null) petani.setAlamat(request.getAlamat());
        }

        return penggunaRepository.save(pengguna);
    }

    @Override
    public void delete(Long id) {
        BasePengguna pengguna = getById(id);
        penggunaRepository.delete(pengguna);
    }
}
