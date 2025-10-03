package com.ExchangeApp.project.model;

public class CurrencyRequest {

    String currency;
    int requestCount;

    public CurrencyRequest() {
    }
    public CurrencyRequest(String currency, int requestCount) {
        this.currency = currency;
        this.requestCount = requestCount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public int getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(int requestCount) {
        this.requestCount = requestCount;
    }
}
