package com.ExchangeApp.project.controller;

import com.ExchangeApp.project.model.ConversionResult;
import com.ExchangeApp.project.model.CurrencyRequest;
import com.ExchangeApp.project.model.ExchangeRate;
import com.ExchangeApp.project.model.LastUpdatedResponse;
import com.ExchangeApp.project.service.ExchangeRateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exchange-rates")
@Validated
@Tag(name = "Exchange Rates", description = "Endpoints for currency conversion, exchange rates, and currency statistics")
public class ExchangeRateController {
    private final ExchangeRateService exchangeRateService;

    public ExchangeRateController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @GetMapping("/rate/{from}/{to}")
    @Operation(summary = "Get exchange rate between two currencies")
    public ResponseEntity<ExchangeRate> getRate(
            @Parameter(description = "Base currency 3-letter code (e.g. EUR, USD)") @PathVariable String from,
            @Parameter(description = "Target currency 3-letter code (e.g. USD, GBP)") @PathVariable String to) {

        String fromNormalized = from.trim().toUpperCase();
        String toNormalized = to.trim().toUpperCase();

        validateCurrency(fromNormalized);
        validateCurrency(toNormalized);

        ExchangeRate rate = exchangeRateService.getExchangeRate(fromNormalized, toNormalized);
        return ResponseEntity.ok(rate);
    }

    @GetMapping("/convert")
    @Operation(summary = "Convert an amount from one currency to another")
    public ResponseEntity<ConversionResult> convert(
            @Parameter(description = "Source currency code") @RequestParam String from,
            @Parameter(description = "Target currency code") @RequestParam String to,
            @Parameter(description = "Amount to convert (must be > 0)") @RequestParam @Positive(message = "Amount must be greater than zero") BigDecimal amount) {

        String fromNormalized = from.trim().toUpperCase();
        String toNormalized = to.trim().toUpperCase();

        validateCurrency(fromNormalized);
        validateCurrency(toNormalized);

        ConversionResult result = exchangeRateService.convertAmount(fromNormalized, toNormalized, amount);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/currencies")
    @Operation(summary = "Get list of all supported currencies and their request counts")
    public ResponseEntity<List<CurrencyRequest>> getSupportedCurrencies() {
        List<CurrencyRequest> currencies = exchangeRateService.getSupportedCurrencies();
        return ResponseEntity.ok(currencies);
    }

    @GetMapping("/last-updated")
    @Operation(summary = "Get metadata about the last ECB exchange rate update")
    public ResponseEntity<LastUpdatedResponse> getLastUpdated() {
        return ResponseEntity.ok(new LastUpdatedResponse(
                exchangeRateService.getLastRefreshedAt(),
                exchangeRateService.getRateDate()
        ));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Force a refresh of exchange rates from the ECB")
    public ResponseEntity<Map<String, String>> refreshRates() {
        exchangeRateService.refreshRates();
        return ResponseEntity.ok(Collections.singletonMap("message", "Rates refreshed successfully"));
    }

    private void validateCurrency(String currency) {
        if (!exchangeRateService.isCurrencySupported(currency)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported currency: " + currency);
        }
    }
}
