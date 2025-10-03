package com.ExchangeApp.project.service;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ECBRateFetcherService {
    private static final String ECB_DAILY_RATES_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
    private static final String ECB_HISTORICAL_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.xml";

    private final RestTemplate restTemplate;

    public ECBRateFetcherService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public Map<String, BigDecimal> fetchDailyRates() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(ECB_DAILY_RATES_URL, String.class);
            return parseECBXmlRates(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch ECB rates", e);
        }
    }

    private Map<String, BigDecimal> parseECBXmlRates(String xmlContent) {
        Map<String, BigDecimal> rates = new HashMap<>();
        rates.put("EUR", BigDecimal.ONE); // Base currency

        try {
            // Simple XML parsing (in real implementation, use proper XML parser)
            String[] lines = xmlContent.split("\n");
            for (String line : lines) {
                if (line.contains("currency=") && line.contains("rate=")) {
                    String currency = extractValue(line, "currency");
                    String rateStr = extractValue(line, "rate");
                    if (currency != null && rateStr != null) {
                        rates.put(currency, new BigDecimal(rateStr));
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse ECB XML rates", e);
        }

        return rates;
    }

    private String extractValue(String line, String attribute) {
        Pattern pattern = Pattern.compile(attribute + "=\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(line);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    // Alternative method for CSV parsing if needed
    public Map<String, BigDecimal> parseECBCsvRates(String csvContent) {
        Map<String, BigDecimal> rates = new HashMap<>();
        rates.put("EUR", BigDecimal.ONE);

        try {
            String[] lines = csvContent.split("\n");
            for (int i = 1; i < lines.length; i++) { // Skip header
                String[] parts = lines[i].split(",");
                if (parts.length >= 2) {
                    String currency = parts[0].trim();
                    String rateStr = parts[1].trim();
                    rates.put(currency, new BigDecimal(rateStr));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse ECB CSV rates", e);
        }

        return rates;
    }
}