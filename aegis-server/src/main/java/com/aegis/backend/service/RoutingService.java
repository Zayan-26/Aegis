package com.aegis.backend.service;

import java.util.List; // Needed for the database list!

import org.springframework.stereotype.Service;

import com.aegis.backend.entity.UnsafeZone;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.config.Profile;
import com.graphhopper.util.GHUtility;

import jakarta.annotation.PostConstruct; // Needed to understand what a "List" is!

@Service
public class RoutingService {

    private GraphHopper hopper;

    @PostConstruct
    public void init() {
        hopper = new GraphHopper();
        
        // pointer to map
        hopper.setOSMFile("map-data/part_birmingham_230326.osm.pbf"); 
        
        // setting up local cache
        hopper.setGraphHopperLocation("target/routing-graph-cache");
        
        // graphhopper set up
        hopper.setEncodedValuesString("foot_access, foot_average_speed, foot_priority, hike_rating");
        hopper.setProfiles(new Profile("foot").setCustomModel(GHUtility.loadCustomModelFromJar("foot.json")));
        
        // process map
        hopper.importOrLoad();
    }

    // dangerous zone list
    public GHResponse getRoute(double startLat, double startLon, double endLat, double endLon, List<UnsafeZone> dangerousZones) {
        GHRequest request = new GHRequest(startLat, startLon, endLat, endLon)
                .setProfile("foot")
                .setLocale("en-GB");

        // Highlight unsafe zones
        if (dangerousZones != null && !dangerousZones.isEmpty()) {
            StringBuilder blockAreaStr = new StringBuilder();
            
            for (int i = 0; i < dangerousZones.size(); i++) {
                UnsafeZone zone = dangerousZones.get(i);
                
                // format data
                blockAreaStr.append(zone.getMinLat()).append(",")
                            .append(zone.getMinLon()).append(",")
                            .append(zone.getMaxLat()).append(",")
                            .append(zone.getMaxLon());
                
                if (i < dangerousZones.size() - 1) {
                    blockAreaStr.append(";");
                }
            }
            
            // applying unsafe zones
            request.putHint("block_area", blockAreaStr.toString());
            
            // disabling cache for errors when making new zones
            request.putHint("ch.disable", true); 
        }

        return hopper.route(request);
    }
}