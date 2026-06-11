package com.example.SiKePang.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.*;

@Service
public class ChatbotService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // System prompt bertema Ketahanan Pangan
    private static final String SYSTEM_PROMPT =
            "Kamu adalah Pakar Ketahanan Pangan dan Konsultan Pertanian untuk aplikasi SiKePang (Sistem Ketahanan Pangan). " +
            "Tugasmu adalah memberikan saran ahli mengenai ketahanan pangan, pertanian, pencegahan hama, manajemen stok pangan, " +
            "rekomendasi pupuk, dan topik seputar pangan Indonesia. " +
            "Jawablah dengan bahasa Indonesia yang formal, sopan, mendetail, akademis, dan mudah dipahami oleh petani dan petugas dinas. " +
            "Jika pengguna menanyakan topik di luar ketahanan pangan, pertanian, peternakan, perikanan darat, atau mitigasi pangan, " +
            "kamu WAJIB menolak dengan sopan dan mengarahkan mereka untuk hanya menanyakan hal seputar ketahanan pangan dan budidaya tani.";

    @SuppressWarnings("unchecked")
    public String generateResponse(String userMessage) {
        // Jika kunci tidak tersedia di properti, coba ambil dari variabel lingkungan
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "Kunci API Gemini belum dikonfigurasi di server. " +
                   "Silakan tambahkan 'gemini.api.key' di application.properties " +
                   "atau set environment variable GEMINI_API_KEY.";
        }

        // =====================================================
        // Gemini REST API endpoint
        // PENTING: API key dikirim sebagai query parameter ?key=...
        // BUKAN sebagai Bearer token di header Authorization
        // =====================================================
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        try {
            // Header: hanya Content-Type, TANPA Authorization header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // =====================================================
            // Format request body Gemini (BERBEDA dari OpenAI/DeepSeek):
            //
            // {
            //   "system_instruction": {
            //     "parts": [{ "text": "system prompt..." }]
            //   },
            //   "contents": [
            //     {
            //       "role": "user",
            //       "parts": [{ "text": "pesan pengguna" }]
            //     }
            //   ]
            // }
            // =====================================================
            Map<String, Object> requestBody = new HashMap<>();

            // System instruction (mengarahkan AI ke tema Ketahanan Pangan)
            Map<String, Object> systemInstruction = new HashMap<>();
            Map<String, String> systemPart = new HashMap<>();
            systemPart.put("text", SYSTEM_PROMPT);
            systemInstruction.put("parts", Collections.singletonList(systemPart));
            requestBody.put("system_instruction", systemInstruction);

            // User message
            Map<String, Object> userContent = new HashMap<>();
            userContent.put("role", "user");
            Map<String, String> userPart = new HashMap<>();
            userPart.put("text", userMessage);
            userContent.put("parts", Collections.singletonList(userPart));
            requestBody.put("contents", Collections.singletonList(userContent));

            // Kirim request ke Gemini API
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            // =====================================================
            // Format response Gemini (BERBEDA dari OpenAI/DeepSeek):
            //
            // {
            //   "candidates": [
            //     {
            //       "content": {
            //         "parts": [{ "text": "jawaban AI" }],
            //         "role": "model"
            //       }
            //     }
            //   ]
            // }
            // =====================================================
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Object text = parts.get(0).get("text");
                            if (text != null) {
                                return text.toString().trim();
                            }
                        }
                    }
                }
            }
            return "Maaf, sistem tidak dapat memproses respons dari Gemini AI.";

        } catch (Exception e) {
            return "Terjadi kesalahan saat berkomunikasi dengan server AI: " + e.getMessage();
        }
    }
}
