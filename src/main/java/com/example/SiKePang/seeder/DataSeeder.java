package com.example.SiKePang.seeder;

import com.example.SiKePang.entity.Admin;
import com.example.SiKePang.entity.Komoditas;
import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.repository.AdminRepository;
import com.example.SiKePang.repository.KomoditasRepository;
import com.example.SiKePang.repository.PetaniRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PetaniRepository petaniRepository;
    private final KomoditasRepository komoditasRepository;

    public DataSeeder(AdminRepository adminRepository, PetaniRepository petaniRepository, KomoditasRepository komoditasRepository) {
        this.adminRepository = adminRepository;
        this.petaniRepository = petaniRepository;
        this.komoditasRepository = komoditasRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seeding Admin
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setNama("Super Admin");
            admin.setEmail("admin@sikepang.com");
            admin.setPassword("admin123");
            adminRepository.save(admin);
        }

        // Seeding Petani
        if (petaniRepository.count() == 0) {
            Petani petani = new Petani();
            petani.setNama("Budi Santoso");
            petani.setEmail("budi@petani.com");
            petani.setPassword("petani123");
            petani.setKelompokTani("Maju Jaya");
            petani.setAlamat("Desa Sukatani, Blok A");
            petani.setNomorTelepon("081234567890");
            petaniRepository.save(petani);
        }

        // Seeding Komoditas
        if (komoditasRepository.count() == 0) {
            Komoditas padi = new Komoditas();
            padi.setNama("Padi / Beras");
            padi.setKategori("Biji-bijian");
            padi.setSatuan("Kg");
            komoditasRepository.save(padi);

            Komoditas jagung = new Komoditas();
            jagung.setNama("Jagung Manis");
            jagung.setKategori("Sayuran");
            jagung.setSatuan("Kg");
            komoditasRepository.save(jagung);
        }
    }
}
