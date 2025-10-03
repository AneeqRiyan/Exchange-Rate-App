package com.ExchangeApp.project.service;

import com.ExchangeApp.project.model.ConversionResult;
import com.ExchangeApp.project.model.CurrencyRequest;
import com.ExchangeApp.project.model.ExchangeRate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ExchangeRateService {
    private final Map<String, BigDecimal> eurRates = new ConcurrentHashMap<>();
    private final Map<String, Integer> currencyRequestCount = new ConcurrentHashMap<>();
    private final RestTemplate restTemplate;

    public ExchangeRateService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
        initializeRates();
    }

    private void initializeRates() {
        // Initial rates (would fetch from ECB in real implementation)
        eurRates.put("USD", new BigDecimal("1.0850"));
        eurRates.put("GBP", new BigDecimal("0.8550"));
        eurRates.put("HUF", new BigDecimal("385.50"));
        eurRates.put("JPY", new BigDecimal("157.80"));
        eurRates.put("CHF", new BigDecimal("0.9550"));
    }

    public ExchangeRate getExchangeRate(String fromCurrency, String toCurrency) {
        trackCurrencyUsage(fromCurrency);
        trackCurrencyUsage(toCurrency);

        if (fromCurrency.equals(toCurrency)) {
            return new ExchangeRate(fromCurrency, toCurrency, BigDecimal.ONE, LocalDate.now());
        }

        if (fromCurrency.equals("EUR")) {
            BigDecimal rate = eurRates.get(toCurrency);
            return new ExchangeRate(fromCurrency, toCurrency, rate, LocalDate.now());
        }

        if (toCurrency.equals("EUR")) {
            BigDecimal rate = BigDecimal.ONE.divide(eurRates.get(fromCurrency), 6, RoundingMode.HALF_UP);
            return new ExchangeRate(fromCurrency, toCurrency, rate, LocalDate.now());
        }

        // Cross rate calculation: fromCurrency/EUR * EUR/toCurrency
        BigDecimal eurToFrom = eurRates.get(fromCurrency);
        BigDecimal eurToTo = eurRates.get(toCurrency);
        BigDecimal crossRate = eurToTo.divide(eurToFrom, 6, RoundingMode.HALF_UP);

        return new ExchangeRate(fromCurrency, toCurrency, crossRate, LocalDate.now());
    }

    public ConversionResult convertAmount(String fromCurrency, String toCurrency, BigDecimal amount) {
        ExchangeRate rate = getExchangeRate(fromCurrency, toCurrency);
        BigDecimal convertedAmount = amount.multiply(rate.getRate());

        return new ConversionResult(fromCurrency, toCurrency, amount, convertedAmount);
    }

    public List<CurrencyRequest> getSupportedCurrencies() {
        return eurRates.keySet().stream()
                .map(currency -> new CurrencyRequest(currency,
                        currencyRequestCount.getOrDefault(currency, 0)))
                .collect(Collectors.toList());
    }

    private void trackCurrencyUsage(String currency) {
        if (!currency.equals("EUR")) {
            currencyRequestCount.merge(currency, 1, Integer::sum);
        }
    }

    // Method to refresh rates from ECB (would be implemented with scheduled task)
    public void refreshRates() {
        // Implementation to fetch latest rates from ECB API
    }
}