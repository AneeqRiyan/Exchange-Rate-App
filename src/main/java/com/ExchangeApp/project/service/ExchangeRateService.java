package com.ExchangeApp.project.service;

import com.ExchangeApp.project.model.ConversionResult;
import com.ExchangeApp.project.model.CurrencyRequest;
import com.ExchangeApp.project.model.ECBExchangeData;
import com.ExchangeApp.project.model.ExchangeRate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExchangeRateService {
    private volatile Map<String, BigDecimal> eurRates = new ConcurrentHashMap<>();
    private final Map<String, Integer> currencyRequestCount = new ConcurrentHashMap<>();
    private final ECBRateFetcherService rateFetcherService;

    private volatile LocalDate rateDate = LocalDate.now();
    private volatile LocalDateTime lastRefreshedAt = LocalDateTime.now();

    public ExchangeRateService(ECBRateFetcherService rateFetcherService) {
        this.rateFetcherService = rateFetcherService;
        initializeRates();
    }

    private void initializeRates() {
        try {
            log.info("Initializing exchange rates from ECB...");
            ECBExchangeData data = rateFetcherService.fetchDailyRates();
            applyNewRates(data);
            log.info("Successfully loaded {} exchange rates dated {}", eurRates.size(), rateDate);
        } catch (Exception e) {
            log.warn("Failed to fetch initial rates from ECB (offline mode). Loading fallback rates. Error: {}", e.getMessage());
            loadFallbackRates();
        }
    }

    private void loadFallbackRates() {
        Map<String, BigDecimal> fallback = new ConcurrentHashMap<>();
        fallback.put("EUR", BigDecimal.ONE);
        fallback.put("USD", new BigDecimal("1.0850"));
        fallback.put("GBP", new BigDecimal("0.8550"));
        fallback.put("HUF", new BigDecimal("385.50"));
        fallback.put("JPY", new BigDecimal("157.80"));
        fallback.put("CHF", new BigDecimal("0.9550"));
        fallback.put("CAD", new BigDecimal("1.4720"));
        fallback.put("AUD", new BigDecimal("1.6450"));
        fallback.put("CNY", new BigDecimal("7.8650"));

        this.eurRates = Collections.unmodifiableMap(fallback);
        this.rateDate = LocalDate.now();
        this.lastRefreshedAt = LocalDateTime.now();
        log.info("Fallback rates loaded with {} currencies", fallback.size());
    }

    private void applyNewRates(ECBExchangeData data) {
        if (data != null && data.getRates() != null && !data.getRates().isEmpty()) {
            Map<String, BigDecimal> newMap = new ConcurrentHashMap<>(data.getRates());
            newMap.put("EUR", BigDecimal.ONE); // Guarantee EUR is present
            this.eurRates = Collections.unmodifiableMap(newMap);
            if (data.getDate() != null) {
                this.rateDate = data.getDate();
            }
            this.lastRefreshedAt = LocalDateTime.now();
        } else {
            log.warn("Received empty rate dataset from ECB");
        }
    }

    public boolean isCurrencySupported(String currency) {
        if (currency == null) {
            return false;
        }
        return eurRates.containsKey(currency.trim().toUpperCase());
    }

    public ExchangeRate getExchangeRate(String fromCurrency, String toCurrency) {
        String from = fromCurrency.trim().toUpperCase();
        String to = toCurrency.trim().toUpperCase();

        trackCurrencyUsage(from);
        trackCurrencyUsage(to);

        if (from.equals(to)) {
            return new ExchangeRate(from, to, BigDecimal.ONE, rateDate);
        }

        if (from.equals("EUR")) {
            BigDecimal rate = eurRates.get(to);
            return new ExchangeRate(from, to, rate, rateDate);
        }

        if (to.equals("EUR")) {
            BigDecimal eurToFrom = eurRates.get(from);
            BigDecimal rate = BigDecimal.ONE.divide(eurToFrom, 6, RoundingMode.HALF_UP);
            return new ExchangeRate(from, to, rate, rateDate);
        }

        // Cross rate calculation: fromCurrency/EUR * EUR/toCurrency => (EUR/to) / (EUR/from)
        BigDecimal eurToFrom = eurRates.get(from);
        BigDecimal eurToTo = eurRates.get(to);
        BigDecimal crossRate = eurToTo.divide(eurToFrom, 6, RoundingMode.HALF_UP);

        return new ExchangeRate(from, to, crossRate, rateDate);
    }

    public ConversionResult convertAmount(String fromCurrency, String toCurrency, BigDecimal amount) {
        ExchangeRate rate = getExchangeRate(fromCurrency, toCurrency);
        BigDecimal convertedAmount = amount.multiply(rate.getRate()).setScale(4, RoundingMode.HALF_UP);

        return new ConversionResult(
                fromCurrency.trim().toUpperCase(),
                toCurrency.trim().toUpperCase(),
                amount,
                convertedAmount
        );
    }

    public List<CurrencyRequest> getSupportedCurrencies() {
        return eurRates.keySet().stream()
                .map(currency -> new CurrencyRequest(currency, currencyRequestCount.getOrDefault(currency, 0)))
                .sorted((a, b) -> a.getCurrency().compareTo(b.getCurrency()))
                .collect(Collectors.toList());
    }

    private void trackCurrencyUsage(String currency) {
        currencyRequestCount.merge(currency, 1, Integer::sum);
    }

    @CacheEvict(value = "ecb-rates", allEntries = true)
    @Scheduled(cron = "${exchange.rates.refresh-cron:0 15 16 * * MON-FRI}", zone = "Europe/Paris")
    public void refreshRates() {
        log.info("Refreshing exchange rates from ECB...");
        try {
            ECBExchangeData newRates = rateFetcherService.fetchDailyRates();
            applyNewRates(newRates);
            log.info("Exchange rates refreshed successfully. Total currencies: {}", eurRates.size());
        } catch (Exception e) {
            log.error("Failed to refresh rates from ECB, retaining existing cached rates: {}", e.getMessage());
        }
    }

    public LocalDate getRateDate() {
        return rateDate;
    }

    public LocalDateTime getLastRefreshedAt() {
        return lastRefreshedAt;
    }

    public int getRateCount() {
        return eurRates.size();
    }
}