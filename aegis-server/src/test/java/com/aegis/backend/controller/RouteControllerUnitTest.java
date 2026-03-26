package com.aegis.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.aegis.backend.repository.UnsafeZoneRepository;
import com.aegis.backend.service.RoutingService;
import com.graphhopper.GHResponse;
import com.graphhopper.ResponsePath;

@ExtendWith(MockitoExtension.class)
public class RouteControllerUnitTest {

    private MockMvc mockMvc;

    @Mock
    private RoutingService routingService;

    @Mock
    private UnsafeZoneRepository unsafeZoneRepository;

    @InjectMocks
    private RouteController routeController;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(routeController).build();
    }

    @Test
    public void testCalculateRouteEndpointExists() throws Exception {
        
        // Create a mock response
        GHResponse fakeResponse = new GHResponse();
        fakeResponse.add(new ResponsePath()); 

        // using mock service to test this route
        when(routingService.getRoute(anyDouble(), anyDouble(), anyDouble(), anyDouble(), any()))
            .thenReturn(fakeResponse);

        // make the request
        mockMvc.perform(get("/api/routes/calculate")
                .param("startLat", "52.456228")
                .param("startLon", "-1.938147")
                .param("endLat", "52.476992")
                .param("endLon", "-1.894509")
                .accept("application/json"))
                .andExpect(status().isOk());
    }
}