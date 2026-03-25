package com.aegis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aegis.backend.entity.UnsafeZone;

@Repository
public interface UnsafeZoneRepository extends JpaRepository<UnsafeZone, Long> {
   //SpringBoot dependency has all built in commands
}