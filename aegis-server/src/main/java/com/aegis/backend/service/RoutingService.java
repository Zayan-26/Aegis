package com.aegis.backend.service;

import org.springframework.stereotype.Service;

import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.config.Profile;
import com.graphhopper.util.GHUtility;

import jakarta.annotation.PostConstruct;

@Service
public class RoutingService {

    private GraphHopper hopper;

    @PostConstruct
    public void init() {
        hopper = new GraphHopper();
        
        // Points to the map we are using for Aegis
        hopper.setOSMFile("map-data/part_birmingham_230326.osm.pbf");
        
        // creating cache 
        hopper.setGraphHopperLocation("target/routing-graph-cache");
        
        // specifying that we are using foot data, Aegis is a walking app
        hopper.setEncodedValuesString("foot_access, foot_average_speed, foot_priority, hike_rating");
        
        // using JSON profile for walking 
        hopper.setProfiles(new Profile("foot").setCustomModel(GHUtility.loadCustomModelFromJar("foot.json")));
        
        // processing the map
        hopper.importOrLoad();
    }

    // controller requests for routing
    public GHResponse getRoute(double startLat, double startLon, double endLat, double endLon) {
        GHRequest request = new GHRequest(startLat, startLon, endLat, endLon)
                .setProfile("foot")
                .setLocale("en-GB");
        
        return hopper.route(request);
    }
}