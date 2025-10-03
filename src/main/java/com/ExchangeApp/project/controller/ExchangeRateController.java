package com.ExchangeApp.project.controller;

import com.ExchangeApp.project.model.ConversionResult;
import com.ExchangeApp.project.model.CurrencyRequest;
import com.ExchangeApp.project.model.ExchangeRate;
import com.ExchangeApp.project.service.ExchangeRateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/exchange-rates")
@Validated
public class ExchangeRateController {
    private final ExchangeRateService exchangeRateService;

    public ExchangeRateController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @GetMapping("/rate/{from}/{to}")
    public ResponseEntity<ExchangeRate> getRate(
            @PathVariable String from,
            @PathVariable String to) {

        from = from.toUpperCase();
        to = to.toUpperCase();

        validateCurrency(from);
        validateCurrency(to);

        ExchangeRate rate = exchangeRateService.getExchangeRate(from, to);
        return ResponseEntity.ok(rate);
    }

    @GetMapping("/convert")
    public ResponseEntity<ConversionResult> convert(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam BigDecimal amount) {

        from = from.toUpperCase();
        to = to.toUpperCase();

        validateCurrency(from);
        validateCurrency(to);

        ConversionResult result = exchangeRateService.convertAmount(from, to, amount);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/currencies")
    public ResponseEntity<List<CurrencyRequest>> getSupportedCurrencies() {
        List<CurrencyRequest> currencies = exchangeRateService.getSupportedCurrencies();
        return ResponseEntity.ok(currencies);
    }

    private void validateCurrency(String currency) {
        if (!currency.equals("EUR") && !exchangeRateService.getSupportedCurrencies()
                .stream().anyMatch(c -> c.getCurrency().equals(currency))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Unsupported currency: " + currency);
        }
    }
}
