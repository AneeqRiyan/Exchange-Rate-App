package com.ExchangeApp.project.service;

import com.ExchangeApp.project.model.ECBExchangeData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class ECBRateFetcherService {
    private static final String ECB_DAILY_RATES_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

    private final RestTemplate restTemplate;

    public ECBRateFetcherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable(value = "ecb-rates", key = "'daily-rates'")
    public ECBExchangeData fetchDailyRates() {
        try {
            log.info("Fetching daily exchange rates from ECB: {}", ECB_DAILY_RATES_URL);
            ResponseEntity<String> response = restTemplate.getForEntity(ECB_DAILY_RATES_URL, String.class);
            log.debug("Received response from ECB: status={}", response.getStatusCode());
            return parseECBXmlRates(response.getBody());
        } catch (Exception e) {
            log.error("Failed to fetch ECB rates from external service: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch ECB rates", e);
        }
    }

    private ECBExchangeData parseECBXmlRates(String xmlContent) {
        Map<String, BigDecimal> rates = new ConcurrentHashMap<>();
        rates.put("EUR", BigDecimal.ONE); // Base currency

        LocalDate rateDate = LocalDate.now();

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            // Prevent XXE attacks
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(xmlContent.getBytes(StandardCharsets.UTF_8)));

            NodeList cubeNodes = doc.getElementsByTagName("Cube");
            for (int i = 0; i < cubeNodes.getLength(); i++) {
                Element element = (Element) cubeNodes.item(i);
                if (element.hasAttribute("time")) {
                    try {
                        rateDate = LocalDate.parse(element.getAttribute("time"));
                    } catch (Exception e) {
                        log.warn("Could not parse ECB date attribute '{}': {}", element.getAttribute("time"), e.getMessage());
                    }
                }
                if (element.hasAttribute("currency") && element.hasAttribute("rate")) {
                    String currency = element.getAttribute("currency");
                    String rateStr = element.getAttribute("rate");
                    try {
                        rates.put(currency, new BigDecimal(rateStr));
                    } catch (NumberFormatException e) {
                        log.warn("Invalid rate format for currency {}: {}", currency, rateStr);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse ECB XML rates: {}", e.getMessage());
            throw new RuntimeException("Failed to parse ECB XML rates", e);
        }

        return new ECBExchangeData(rateDate, rates);
    }
}