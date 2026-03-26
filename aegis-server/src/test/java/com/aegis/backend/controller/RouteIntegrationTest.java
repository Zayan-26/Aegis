package com.aegis.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RouteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testFullRoutingEngineIntegration() throws Exception {
        // We make a real request that will travel through the Controller, to the Service, into GraphHopper, and back
        mockMvc.perform(get("/api/routes/calculate")
                .param("startLat", "52.4508")
                .param("startLon", "-1.9305")
                .param("endLat", "52.4540")
                .param("endLon", "-1.9250")
                .accept("application/json"))
                .andExpect(status().isOk())
                // We assert that the response is actually an array (which proves GraphHopper generated routes)
                .andExpect(jsonPath("$").isArray())
                // We check that the first item has a safety score, proving your custom safety algorithm fired
                .andExpect(jsonPath("$[0].safetyScore").exists());
    }
}