package com.ExchangeApp.project;

import com.ExchangeApp.project.model.ConversionResult;
import com.ExchangeApp.project.model.CurrencyRequest;
import com.ExchangeApp.project.model.ExchangeRate;
import com.ExchangeApp.project.service.ExchangeRateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectApplicationTests {

    @Autowired
    private ExchangeRateService exchangeRateService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Application context loads successfully")
    void contextLoads() {
        assertNotNull(exchangeRateService);
    }

    @Test
    @DisplayName("Fetch direct rate from EUR to USD")
    void testGetEurToUsdRate() {
        ExchangeRate rate = exchangeRateService.getExchangeRate("EUR", "USD");
        assertNotNull(rate);
        assertEquals("EUR", rate.getBaseCurrency());
        assertEquals("USD", rate.getTargetCurrency());
        assertTrue(rate.getRate().compareTo(BigDecimal.ZERO) > 0);
        assertNotNull(rate.getDate());
    }

    @Test
    @DisplayName("Fetch reverse rate from USD to EUR")
    void testGetUsdToEurRate() {
        ExchangeRate rate = exchangeRateService.getExchangeRate("USD", "EUR");
        assertNotNull(rate);
        assertEquals("USD", rate.getBaseCurrency());
        assertEquals("EUR", rate.getTargetCurrency());
        assertTrue(rate.getRate().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Same currency rate returns 1.0")
    void testSameCurrencyReturnsRateOne() {
        ExchangeRate eurEur = exchangeRateService.getExchangeRate("EUR", "EUR");
        assertEquals(BigDecimal.ONE, eurEur.getRate());

        ExchangeRate usdUsd = exchangeRateService.getExchangeRate("USD", "USD");
        assertEquals(BigDecimal.ONE, usdUsd.getRate());
    }

    @Test
    @DisplayName("Cross rate calculation between non-EUR currencies (USD to GBP)")
    void testCrossRateCalculation() {
        ExchangeRate rate = exchangeRateService.getExchangeRate("USD", "GBP");
        assertNotNull(rate);
        assertEquals("USD", rate.getBaseCurrency());
        assertEquals("GBP", rate.getTargetCurrency());
        assertTrue(rate.getRate().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Convert amount from EUR to USD")
    void testCurrencyConversion() {
        ConversionResult result = exchangeRateService.convertAmount("EUR", "USD", new BigDecimal("100"));
        assertNotNull(result);
        assertEquals("EUR", result.getFromCurrency());
        assertEquals("USD", result.getToCurrency());
        assertEquals(new BigDecimal("100"), result.getAmount());
        assertTrue(result.getConvertedAmount().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("EUR is included and tracked in supported currencies")
    void testEurIncludedInSupportedCurrencies() {
        exchangeRateService.getExchangeRate("EUR", "USD");
        List<CurrencyRequest> currencies = exchangeRateService.getSupportedCurrencies();
        assertTrue(currencies.stream().anyMatch(c -> c.getCurrency().equals("EUR")), "EUR must be in supported list");

        CurrencyRequest eur = currencies.stream()
                .filter(c -> c.getCurrency().equals("EUR"))
                .findFirst()
                .orElse(null);
        assertNotNull(eur);
        assertTrue(eur.getRequestCount() > 0, "EUR queries must increment request count");
    }

    @Test
    @DisplayName("REST: GET /rate/EUR/USD returns 200 with rate JSON")
    void testGetRateEndpoint() throws Exception {
        mockMvc.perform(get("/api/exchange-rates/rate/EUR/USD"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.baseCurrency").value("EUR"))
                .andExpect(jsonPath("$.targetCurrency").value("USD"))
                .andExpect(jsonPath("$.rate").isNumber())
                .andExpect(jsonPath("$.date").isNotEmpty());
    }

    @Test
    @DisplayName("REST: GET /rate with unsupported currency returns structured 400 error")
    void testGetRateUnsupportedCurrencyReturns400() throws Exception {
        mockMvc.perform(get("/api/exchange-rates/rate/EUR/XYZ"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Unsupported currency: XYZ"))
                .andExpect(jsonPath("$.path").value("/api/exchange-rates/rate/EUR/XYZ"));
    }

    @Test
    @DisplayName("REST: GET /convert with negative amount returns 400 validation error")
    void testConvertNegativeAmountReturns400() throws Exception {
        mockMvc.perform(get("/api/exchange-rates/convert")
                        .param("from", "EUR")
                        .param("to", "USD")
                        .param("amount", "-10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    @DisplayName("REST: GET /last-updated returns 200 with lastRefreshed and ecbRateDate")
    void testGetLastUpdatedEndpoint() throws Exception {
        mockMvc.perform(get("/api/exchange-rates/last-updated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastRefreshed").isNotEmpty())
                .andExpect(jsonPath("$.ecbRateDate").isNotEmpty());
    }

    @Test
    @DisplayName("REST: POST /refresh triggers rate update and returns 200")
    void testRefreshRatesEndpoint() throws Exception {
        mockMvc.perform(post("/api/exchange-rates/refresh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Rates refreshed successfully"));
    }

    @Test
    @DisplayName("Actuator /actuator/health includes ECB health indicator")
    void testActuatorHealthEndpoint() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.components.ECB.status").value("UP"))
                .andExpect(jsonPath("$.components.ECB.details.currenciesAvailable").isNumber());
    }
}
