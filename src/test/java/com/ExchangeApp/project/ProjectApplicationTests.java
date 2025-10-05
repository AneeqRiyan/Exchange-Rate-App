package com.ExchangeApp.project;

import com.ExchangeApp.project.model.ConversionResult;
import com.ExchangeApp.project.model.ExchangeRate;
import com.ExchangeApp.project.service.ExchangeRateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class ProjectApplicationTests {

	@Test
	void contextLoads() {
	}
	@Autowired
	private ExchangeRateService exchangeRateService;

	@Test
	void testGetEurToUsdRate() {
		ExchangeRate rate = exchangeRateService.getExchangeRate("EUR", "USD");
		assertNotNull(rate);
		assertTrue(rate.getRate().compareTo(BigDecimal.ZERO) > 0);
	}

	@Test
	void testCrossRateCalculation() {
		ExchangeRate rate = exchangeRateService.getExchangeRate("USD", "GBP");
		assertNotNull(rate);
		assertTrue(rate.getRate().compareTo(BigDecimal.ZERO) > 0);
	}

	@Test
	void testCurrencyConversion() {
		ConversionResult result = exchangeRateService.convertAmount("EUR", "USD",
				new BigDecimal("100"));
		assertNotNull(result);
		assertTrue(result.getConvertedAmount().compareTo(BigDecimal.ZERO) > 0);
	}


}
