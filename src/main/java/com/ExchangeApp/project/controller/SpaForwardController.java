package com.ExchangeApp.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    /**
     * Forwards known client-side React routes to index.html.
     * Specifically avoids wildcard regex patterns that could collide with
     * actuator, OpenAPI docs, or missing static resource 404 handling.
     */
    @GetMapping(value = {
            "/converter",
            "/currencies"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
