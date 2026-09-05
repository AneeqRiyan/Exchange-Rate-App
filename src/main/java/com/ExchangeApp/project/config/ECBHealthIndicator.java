package com.ExchangeApp.project.config;

import com.ExchangeApp.project.service.ExchangeRateService;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class ECBHealthIndicator implements HealthIndicator {

    private final ExchangeRateService exchangeRateService;

    public ECBHealthIndicator(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @Override
    public Health health() {
        int rateCount = exchangeRateService.getRateCount();
        if (rateCount > 0) {
            return Health.up()
                    .withDetail("ecbRateDate", exchangeRateService.getRateDate())
                    .withDetail("lastRefreshedAt", exchangeRateService.getLastRefreshedAt())
                    .withDetail("currenciesAvailable", rateCount)
                    .build();
        } else {
            return Health.down()
                    .withDetail("error", "No exchange rates available")
                    .build();
        }
    }
}
