package com.ExchangeApp.project.model;


import java.math.BigDecimal;
import java.time.LocalDate;

public class ExchangeRate {

    String baseCurrency;
    String targetCurrency;
    BigDecimal rate;
    LocalDate date;

    public ExchangeRate(String baseCurrency, String targetCurrency, BigDecimal rate, LocalDate date) {
        this.baseCurrency = baseCurrency;
        this.targetCurrency = targetCurrency;
        this.rate = rate;
        this.date = date;
    }

    public ExchangeRate() {
    }

    public String getBaseCurrency() {
        return baseCurrency;
    }

    public void setBaseCurrency(String baseCurrency) {
        this.baseCurrency = baseCurrency;
    }

    public String getTargetCurrency() {
        return targetCurrency;
    }

    public void setTargetCurrency(String targetCurrency) {
        this.targetCurrency = targetCurrency;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
