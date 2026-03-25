package com.aegis.backend.service;

import java.util.HashMap;
import java.util.List; 

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Service;

import com.aegis.backend.entity.UnsafeZone;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.config.Profile;
import com.graphhopper.util.CustomModel;
import com.graphhopper.util.GHUtility;
import com.graphhopper.util.JsonFeature;
import com.graphhopper.util.JsonFeatureCollection;
import com.graphhopper.json.Statement;
import jakarta.annotation.PostConstruct; 

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
            CustomModel customModel = new CustomModel();
            GeometryFactory geometryFactory = new GeometryFactory();

            JsonFeatureCollection areaCollection = new JsonFeatureCollection();
            
            for (int i = 0; i < dangerousZones.size(); i++) {
                UnsafeZone zone = dangerousZones.get(i);
                String areaId = "danger_zone_" + i;
                
                // creating the unsafe zone
                Coordinate[] coords = new Coordinate[] {
                    new Coordinate(zone.getMinLon(), zone.getMinLat()),
                    new Coordinate(zone.getMaxLon(), zone.getMinLat()),
                    new Coordinate(zone.getMaxLon(), zone.getMaxLat()),
                    new Coordinate(zone.getMinLon(), zone.getMaxLat()),
                    new Coordinate(zone.getMinLon(), zone.getMinLat()) 
                };
                Polygon polygon = geometryFactory.createPolygon(coords);
                
                // getting the zone "ready" for graphHopper
                JsonFeature feature = new JsonFeature(areaId, "Feature", null, polygon, new HashMap<>());
                areaCollection.getFeatures().add(feature);
                
                // adding penalties
                customModel.addToPriority(Statement.If("in_" + areaId, Statement.Op.MULTIPLY, String.valueOf(zone.getSafetyMultiplier())));
            }
            
            // adding zones onto model
            customModel.addAreas(areaCollection);

            request.setCustomModel(customModel);
            request.putHint("ch.disable", true); 
        }

        return hopper.route(request);
    }
}